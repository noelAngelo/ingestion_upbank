import json
from webhook.index import handler, DEFAULT_LOG_FORMAT
from loguru import logger

logger.add(
    "app/tests/lambda/webhook/test_handler.log", 
    format=DEFAULT_LOG_FORMAT)

def test_handler_empty_event():
    event = {}  # Mock event data if needed
    context = None  # Mock context object if needed
    response = handler(event, context)
    
    assert response["statusCode"] == 400
    assert json.loads(response["body"])["message"] == "No webhook payload found in the request body"

def test_handler_log_level_event():
    event = {"LOG_LEVEL": "DEBUG", "body": {}}  # Mock event data if needed
    context = None  # Mock context object if needed
    response = handler(event, context)
    
    assert response["statusCode"] == 200
    assert json.loads(response["body"])["message"] == "Webhook processed successfully"