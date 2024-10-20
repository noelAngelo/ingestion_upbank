import json
from loguru import logger


def handler(event, context):
    # Extract the POST request body sent via API Gateway
    body = json.loads(event["body"], "{}")

    # Log the webhook payload
    logger.debug(f"Received webhook payload: {body}")

    # Process the webhook payload
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Webhook processed successfully"}),
    }
