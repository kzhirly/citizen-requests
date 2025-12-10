import time
import jwt

SECRET = "SUPERSECRET"
ALGORITHM = "HS256"


def create_access_token(username: str):
    payload = {
        "user": username,
        "expires": time.time() + 3600
    }
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        decoded = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        if decoded["expires"] >= time.time():
            return decoded
        return None
    except:
        return None