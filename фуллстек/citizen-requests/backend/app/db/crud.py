from app.db.models import User, Request

def create_user(db, username, password, role):
    existing = db.query(User).filter(User.username==username).first()
    if existing:
        return None
    user = User(username=username, password=password, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def verify_user(db, username, password):
    return db.query(User).filter(User.username == username, User.password == password).first()

def get_all_requests(db):
    return db.query(Request).all()

def create_request(db, payload):
    req = Request(**payload)
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

def update_request(db, id, payload, user):
    req = db.query(Request).get(id)
    if not req:
        return {"error":"not found"}
    if user["role"] == "user" and req.full_name != user["username"]:
        return {"error":"forbidden"}
    for k,v in payload.items(): setattr(req,k,v)
    db.commit()
    return req

def close_request(db, id):
    req = db.query(Request).get(id)
    if req:
        req.status = "closed"
        db.commit()
    return req

def set_user_role(db, user_id, new_role):
    u = db.query(User).get(user_id)
    if u:
        u.role = new_role
        db.commit()
    return u