_store = {
    "users": [],      # {id, username, password} — в MVP можно хранить открыто (или хешировать)
    "requests": []    # каждый запрос: {request_id, full_name, contact, topic, title, description, assigned_department, status, created_at, response}
}

def ping():
    return True

def add_user(user):
    _store["users"].append(user)
    return user

def find_user(username):
    for u in _store["users"]:
        if u["username"] == username:
            return u
    return None

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