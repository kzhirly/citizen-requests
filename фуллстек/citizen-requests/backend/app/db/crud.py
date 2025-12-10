_store = {
    "users": [],  # {id, username, password}
    "requests": []
}

def create_user(username, password):
    for u in _store["users"]:
        if u["username"] == username:
            return None   # user exists

    new_user = {
        "id": len(_store["users"]) + 1,
        "username": username,
        "password": password
    }
    _store["users"].append(new_user)
    return new_user

def verify_user(username, password):
    for u in _store["users"]:
        if u["username"] == username and u["password"] == password:
            return u
    return None