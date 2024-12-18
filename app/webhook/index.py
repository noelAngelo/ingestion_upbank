import json
import os
import boto3

from pathlib import Path

from aws_lambda_powertools import Tracer, Logger
from aws_lambda_powertools.utilities.typing import LambdaContext
from helpers import handle_webhook, retrieve_secret_value



LAMBDA_DIR = Path(__file__).parent

DEFAULT_LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(funcName)s() - %(message)s"
DEFAULT_PARAMETERS_SECRETS_EXTENSION_HTTP_PORT = 2773

tracer = Tracer()
logger = Logger(service="webhook", name="%(name)s")
s3_client = boto3.client("s3")


@logger.inject_lambda_context
@tracer.capture_lambda_handler
def handler(event: dict, context: LambdaContext) -> dict:
    
    if event is None:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request"}),
        }
    
    webhook_secret = retrieve_secret_value(
        secret_id=os.environ.get("SECRET_UPBANK_WEBHOOK"),
        port=DEFAULT_PARAMETERS_SECRETS_EXTENSION_HTTP_PORT,
        secret_key="secretKey",
    )

    result_dict = handle_webhook(event=event, secret=webhook_secret, s3_client=s3_client)
    return {
        "statusCode": result_dict["status_code"],
        "body": json.dumps(result_dict["content"]),
    }
