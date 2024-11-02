import os
import requests
import json
import logging
import datetime
from utils import compute_hmac_sha256

logger = logging.getLogger(__name__)


def handle_webhook(event: dict, secret: str, s3_client) -> dict:

    headers = event.get("headers", {})
    if "X-Up-Authenticity-Signature" not in headers:
        return dict(status_code=403, content="Forbidden, signature missing")

    received_signature = event["headers"]["X-Up-Authenticity-Signature"]
    signature = compute_hmac_sha256(secret_key=secret, message=event["body"])

    if received_signature != signature:
        return dict(status_code=403, content=f"Forbidden, {signature}")

    s3_uri = dump_webhook_event(event=event, s3_client=s3_client)
    return dict(status_code=200, content=dict(message="Event stored", s3_uri=s3_uri))


def retrieve_secret_value(secret_id: str, port: int, secret_key: str) -> str:

    endpoint = f"secretsmanager/get?secretId={secret_id}"

    url = f"http://localhost:{port}/{endpoint}"

    headers = {"X-Aws-Parameters-Secrets-Token": os.environ.get("AWS_SESSION_TOKEN")}

    response = requests.get(url, headers=headers)
    response_json = response.json()
    return json.loads(response_json["SecretString"])[secret_key]


def dump_webhook_event(event: dict, s3_client):
    logger.info(f"Received event")
    bucket = os.environ.get("BUCKET_NAME")
    request_context = event.get("requestContext", {})
    request_time = request_context.get(
        "requestTimeEpoch", int(datetime.datetime.now().strftime("%s")) * 1000
    )
    key = f"stage=landing/source=webhook/events/{request_time}.json"
    s3_client.put_object(Bucket=bucket, Key=key, Body=json.dumps(event), ContentType="application/json")
    return f"s3://{bucket}/{key}"
