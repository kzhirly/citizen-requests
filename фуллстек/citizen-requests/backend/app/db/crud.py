_store = {
    "users": [],
    "requests": []
}

def ping():
    return True


# ------------------ USERS ------------------

def add_user(user):
    _store["users"].append(user)
    return user

def find_user(username):
    for u in _store["users"]:
        if u["username"] == username:
            return u
    return None


# ------------------ REQUESTS ------------------

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
    """
    updates может содержать:
    {"status": "...", "response": "..."}
    """
    for i, r in enumerate(_store["requests"]):
        if r["request_id"] == rid:
            _store["requests"][i].update(updates)
            return _store["requests"][i]
    return None

def delete_request(rid):
    for i, r in enumerate(_store["requests"]):
        if r["request_id"] == rid:
            return _store["requests"].pop(i)
    return None