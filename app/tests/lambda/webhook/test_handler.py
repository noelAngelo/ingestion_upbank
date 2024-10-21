from webhook.index import handler, DEFAULT_LOG_FORMAT
from webhook.utils import compute_hmac_sha256
import logging

# Configure logging with custom format
logging.basicConfig(level=logging.INFO, format=DEFAULT_LOG_FORMAT)

# Create a logger
logger = logging.getLogger(__name__)


class TestWebhookHandler:
    # def test_handler(self, mocker):
    #     # GIVEN
    #     event = {"key": "value"}
    #     context = None

    #     # WHEN
    #     response = handler(event, context)

    #     # THEN
    #     assert response == {"statusCode": 200, "body": "Hello World"}

    def test_compute_hmac_sha256(self):
        # GIVEN
        secret_key = "test-secret-key"
        message = '{"example": "data"}'

        # WHEN
        computed_signature = compute_hmac_sha256(secret_key, message)

        # THEN
        assert (
            computed_signature
            == "cb5b54a0678ce6a2d342bbdae74ff93a7595cf408d996319b846d4ede2c611d8"
        )
