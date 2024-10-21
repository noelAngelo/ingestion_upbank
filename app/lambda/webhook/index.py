from aws_lambda_powertools import Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext
from webhook.utils import compute_hmac_sha256

DEFAULT_LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(funcName)s() - %(message)s"
tracer = Tracer()


def handle_webhook(event: dict, secret: str) -> dict:
    received_signature = event["headers"]["X-Up-Authenticity-Signature"]
    signature = compute_hmac_sha256(secret_key=secret, message=event["body"])

    if received_signature != signature:
        return {"statusCode": 403, "body": "Forbidden"}
    
    return {"statusCode": 200, "body": "Success"}


@tracer.capture_lambda_handler
def handler(event: dict, context: LambdaContext) -> dict:
    return handle_webhook(event, secret="test")
