import pytest
from dotenv import load_dotenv
from loguru import logger
from omegaconf.errors import ConfigKeyError

from app.webhook.index import DEFAULT_LOG_FORMAT, LAMBDA_DIR
from app.webhook.utils import compute_hmac_sha256, LambdaConfig

logger.remove(0)
logger.add("test_handler.log", format=DEFAULT_LOG_FORMAT, level="DEBUG")

load_dotenv()  # take environment variables from .env


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
        message = {"example": "data"}

        # WHEN
        computed_signature = compute_hmac_sha256(secret_key, message)

        # THEN
        assert (
                computed_signature
                == "cb5b54a0678ce6a2d342bbdae74ff93a7595cf408d996319b846d4ede2c611d8"
        )


class TestLambdaConfig:

    def test_collect_path_from_valid_path(self):
        # GIVEN
        stage = "landing"
        source_root = "s3://bucket-name"
        context = {"config_path": LAMBDA_DIR, "config_file_name": "config.yaml"}
        logger.debug(f"LambdaConfig context: {context}")

        # WHEN
        result = LambdaConfig(context).collect_path(stage)

        # THEN
        assert result == f"{source_root}/stage=landing/"

    def test_collect_path_from_invalid_stage(self):
        # GIVEN
        stage = "some-stage"
        context = {"config_path": LAMBDA_DIR, "config_file_name": "config.yaml"}
        logger.debug(f"LambdaConfig context: {context}")

        # THEN
        with pytest.raises(ConfigKeyError):
            # WHEN
            LambdaConfig(context).collect_path(stage)
