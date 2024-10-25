import os
import requests
import json
import logging
from utils import compute_hmac_sha256

logger = logging.getLogger(__name__)


def handle_webhook(event: dict, secret: str) -> dict:
    received_signature = event["headers"]["X-Up-Authenticity-Signature"]
    signature = compute_hmac_sha256(secret_key=secret, message=event["body"])
    
    if received_signature != signature:
        return dict(status_code=403, content=f"Forbidden, {signature}")

    return dict(status_code=200, content="Hello World")


def retrieve_secret_value(secret_id: str, port: int, secret_key: str) -> str:

    endpoint = f"secretsmanager/get?secretId={secret_id}"

    url = f"http://localhost:{port}/{endpoint}"

    headers = {"X-Aws-Parameters-Secrets-Token": os.environ.get("AWS_SESSION_TOKEN")}

    response = requests.get(url, headers=headers)
    response_json = response.json()
    return json.loads(response_json["SecretString"])[secret_key]