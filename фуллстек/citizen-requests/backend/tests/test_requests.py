import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_request_unauthorized():
    """Тест: создание заявки без авторизации"""
    response = client.post("/api/requests", json={
        "description": "Тестовая заявка",
        "title": "Тест"
    })
    assert response.status_code == 403

def test_robots_txt():
    """Тест: robots.txt доступен"""
    response = client.get("/robots.txt")
    assert response.status_code == 200
    assert "User-agent" in response.text

def test_sitemap_xml():
    """Тест: sitemap.xml доступен"""
    response = client.get("/sitemap.xml")
    assert response.status_code == 200
    assert "urlset" in response.text