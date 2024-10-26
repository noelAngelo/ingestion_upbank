import hashlib
import hmac
import json
import logging
import os
import pathlib

from omegaconf import OmegaConf

logger = logging.getLogger(__name__)


def compute_hmac_sha256(secret_key: str, message: dict) -> str:
    # Convert the secret key and message to bytes
    secret_key_bytes = secret_key.encode("utf-8")
    message_bytes = json.dumps(message).encode("utf-8")

    # Create HMAC object and compute the signature
    hmac_obj = hmac.new(secret_key_bytes, message_bytes, hashlib.sha256)

    # Return the computed signature
    return hmac_obj.hexdigest()


class LambdaConfig:

    def __init__(self, context):
        self.context = context
        self.config_path: pathlib.Path = context["config_path"]
        self.conf_file_name = context.get("config_file_name", "config.yaml")

        logger.debug(f"LambdaConfig context: {context}")
        logger.debug(f"LambdaConfig config_path: {self.config_path}")
        logger.debug(f"LambdaConfig conf_file_name: {self.conf_file_name}")

    def collect_path(self, stage) -> str:
        source_root = os.environ.get("BUCKET_NAME")
        OmegaConf.register_new_resolver(
            "make_path", lambda x: f"{source_root}/stage={x}/", replace=True
        )
        conf_path = self.config_path.joinpath(self.conf_file_name)
        conf = OmegaConf.load(conf_path.resolve())
        return conf["path"][stage]
