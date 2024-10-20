import os
import logging
import json

logger = logging.getLogger(__name__)

DEFAULT_LOGGING_FORMAT = "{time} | {level} | {message}"
DEFAULT_LOG_LEVEL = "INFO"
DEFAULT_LOG_FORMAT = (
    "[%(asctime)s %(filename)s->%(funcName)s():%(lineno)s]%(levelname)s: %(message)s"
)


def handler(event, context):
    # Configure the logger
    logging.basicConfig(
        format=event.get("LOG_FORMAT", DEFAULT_LOG_FORMAT),
        level=event.get("LOG_LEVEL", DEFAULT_LOG_LEVEL),
    )

    if "body" in event.keys():
        # Extract the POST request body sent via API Gateway
        body = event["body"]

        # Log the webhook payload
        logger.debug(f"Received webhook payload: {body}")
        
        # Process the webhook payload
        msg = "Webhook processed successfully"
        return {
            "statusCode": 200,
            "body": json.dumps({"message": msg}),
        }

    else:
        msg = "No webhook payload found in the request body"
        logger.error(msg=msg)
        return {
            "statusCode": 400,
            "body": json.dumps({"message": msg}),
        }
    
