import hmac
import hashlib


def compute_hmac_sha256(secret_key, message):
    # Convert the secret key and message to bytes
    secret_key_bytes = secret_key.encode("utf-8")
    message_bytes = message.encode("utf-8")

    # Create HMAC object and compute the signature
    hmac_obj = hmac.new(secret_key_bytes, message_bytes, hashlib.sha256)

    # Return the computed signature
    return hmac_obj.hexdigest()
