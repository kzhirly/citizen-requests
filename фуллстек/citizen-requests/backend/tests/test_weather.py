import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_weather_moscow():
    """Тест получения погоды для Москвы"""
    response = client.get("/api/weather?city=Moscow")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["city"] == "Москва"
    assert "temperature" in data

def test_weather_spb():
    """Тест получения погоды для СПб"""
    response = client.get("/api/weather?city=spb")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["city"] == "Санкт-Петербург"

def test_weather_unknown_city():
    """Тест: неизвестный город (должен вернуть Москву по умолчанию)"""
    response = client.get("/api/weather?city=unknown")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True