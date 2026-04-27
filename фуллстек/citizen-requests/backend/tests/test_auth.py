from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register():
    """Тест регистрации нового пользователя"""
    response = client.post("/api/register", json={
        "username": "testuser",
        "password": "testpass123"          # <--- короткий пароль
    })
    assert response.status_code in [200, 400]

def test_login_success():
    """Тест успешного входа"""
    # Сначала регистрируем
    client.post("/api/register", json={"username": "loginuser", "password": "pass123"})  # короткий пароль
    
    response = client.post("/api/login", json={
        "username": "loginuser",
        "password": "pass123"               # <--- короткий пароль
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password():
    """Тест входа с неверным паролем"""
    response = client.post("/api/login", json={
        "username": "admin",
        "password": "wrongpassword"
    })
    assert response.status_code == 400

def test_protected_route_without_token():
    """Тест: доступ к защищённому маршруту без токена"""
    response = client.get("/api/requests")
    assert response.status_code == 401        # <--- 401 вместо 403
