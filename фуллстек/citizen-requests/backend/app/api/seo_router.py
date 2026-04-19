# backend/app/api/seo_router.py
from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
import httpx

router = APIRouter(tags=["SEO"])

@router.get("/robots.txt", response_class=PlainTextResponse)
async def robots_txt():
    """Файл robots.txt для поисковых роботов"""
    return PlainTextResponse("""
User-agent: *
Allow: /
Disallow: /api/login
Disallow: /api/register
Disallow: /api/refresh
Disallow: /api/logout
Disallow: /secure/

Sitemap: https://citizen-requests.ru/sitemap.xml
Host: https://citizen-requests.ru
""".strip())

@router.get("/sitemap.xml", response_class=PlainTextResponse)
async def sitemap_xml():
    """Sitemap.xml для индексации страниц"""
    return PlainTextResponse("""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://citizen-requests.ru/</loc>
    <lastmod>2026-04-19</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://citizen-requests.ru/history</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
""".strip())

# ========== СТОРОННИЙ API (ПОГОДА) ==========

@router.get("/api/weather")
async def get_weather(city: str = "Moscow"):
    """
    Получение погоды через Open-Meteo API (бесплатно, без ключа)
    """
    # Координаты городов
    cities = {
        "moscow": {"lat": 55.7558, "lon": 37.6173, "name": "Москва"},
        "spb": {"lat": 59.9343, "lon": 30.3351, "name": "Санкт-Петербург"},
        "kazan": {"lat": 55.7887, "lon": 49.1221, "name": "Казань"},
        "novosibirsk": {"lat": 55.0084, "lon": 82.9357, "name": "Новосибирск"},
        "ekaterinburg": {"lat": 56.8389, "lon": 60.6057, "name": "Екатеринбург"},
    }
    
    city_key = city.lower()
    if city_key not in cities:
        city_key = "moscow"
    
    coords = cities[city_key]
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": coords["lat"],
                    "longitude": coords["lon"],
                    "current_weather": True,
                    "timezone": "Europe/Moscow"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current_weather", {})
            
            # Расшифровка кода погоды
            weather_codes = {
                0: "Ясно",
                1: "Преимущественно ясно",
                2: "Переменная облачность",
                3: "Пасмурно",
                45: "Туман",
                51: "Морось",
                61: "Дождь",
                71: "Снег",
                80: "Ливень",
            }
            weather_code = current.get("weathercode", 0)
            description = weather_codes.get(weather_code, "Неизвестно")
            
            return {
                "success": True,
                "city": coords["name"],
                "temperature": current.get("temperature"),
                "wind_speed": current.get("windspeed"),
                "description": description,
                "weather_icon": "☀️" if current.get("temperature", 0) > 0 else "❄️"
            }
        except httpx.TimeoutException:
            return {"success": False, "error": "Сервис погоды временно недоступен"}
        except httpx.HTTPStatusError as e:
            return {"success": False, "error": f"Ошибка API: {e.response.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}