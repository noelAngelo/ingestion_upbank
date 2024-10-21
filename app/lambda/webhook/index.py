from aws_lambda_powertools import Tracer, Logger
from aws_lambda_powertools.utilities.typing import LambdaContext
from utils import compute_hmac_sha256
import os
import requests

DEFAULT_LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(funcName)s() - %(message)s"
DEFAULT_PARAMETERS_SECRETS_EXTENSION_HTTP_PORT = 2773

tracer = Tracer()
logger = Logger(service="webhook", name="%(name)s")
additional_log_attributes = {"process": "%(process)d", "function": "%(funcName)s"}
logger.append_keys(**additional_log_attributes)


def handle_webhook(event: dict, secret: str) -> dict:
    received_signature = event["headers"]["X-Up-Authenticity-Signature"]
    signature = compute_hmac_sha256(secret_key=secret, message=event["body"])
    tracer.put_annotation(key="signature", value=signature)

    if received_signature != signature:
        return dict(status_code=403, content="Forbidden")

    return dict(status_code=200, content="Hello World")


def retrieve_secret_value(secret_id: str, port: int) -> str:

    endpoint = f"/secretsmanager/get?secret_id={secret_id}"
    url = f"http://localhost:{port}/{endpoint}"

    headers = {"X-Aws-Parameters-Secrets-Token": os.environ.get("AWS_SESSION_TOKEN")}
    response = requests.get(url, headers=headers)
    return response.json()


@logger.inject_lambda_context
@tracer.capture_lambda_handler
def handler(event: dict, context: LambdaContext) -> dict:

    webhook_secret = retrieve_secret_value(
        secret_id=os.environ.get("SECRET_UPBANK_WEBHOOK"),
        port=DEFAULT_PARAMETERS_SECRETS_EXTENSION_HTTP_PORT,
    )
    return handle_webhook(event, secret="test")
