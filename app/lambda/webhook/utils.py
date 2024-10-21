import hmac
import hashlib
import json


def compute_hmac_sha256(secret_key: str, message: dict) -> str:
    # Convert the secret key and message to bytes
    secret_key_bytes = secret_key.encode("utf-8")
    message_bytes = json.dumps(message).encode("utf-8")

    # Create HMAC object and compute the signature
    hmac_obj = hmac.new(secret_key_bytes, message_bytes, hashlib.sha256)

    # Return the computed signature
    return hmac_obj.hexdigest()
