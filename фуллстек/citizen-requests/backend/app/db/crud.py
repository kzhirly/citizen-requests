from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

_store = {
    "users": [],       # {id, username, password_hash}
    "requests": []
}

# ---------------- USERS ----------------

def get_user(username: str):
    for u in _store["users"]:
        if u["username"] == username:
            return u
    return None

def create_user(username: str, password: str):
    user = get_user(username)
    if user:
        return None

    new_user = {
        "id": len(_store["users"]) + 1,
        "username": username,
        "password_hash": pwd_context.hash(password)
    }
    _store["users"].append(new_user)
    return new_user

def verify_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return None

    if not pwd_context.verify(password, user["password_hash"]):
        return None

    return user

# ---------------- REQUESTS ----------------

def add_request(item):
    _store["requests"].append(item)
    return item

def list_requests():
    return _store["requests"]

def get_request_by_id(rid):
    for r in _store["requests"]:
        if r["request_id"] == rid:
            return r
    return None

def update_request(rid, updates: dict):
    for r in _store["requests"]:
        if r["request_id"] == rid:
            r.update(updates)
            return r
    return None

def delete_request(rid):
    for r in _store["requests"]:
        if r["request_id"] == rid:
            _store["requests"].remove(r)
            return True
    return False