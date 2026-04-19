# backend/app/services/weather_service.py
import httpx
from typing import Optional, Dict, Any
from fastapi import HTTPException

# Бесплатный API погоды (Open-Meteo) — не требует ключа!
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"

async def get_weather(city: str = "Moscow") -> Dict[str, Any]:
    """
    Получение погоды через Open-Meteo API (бесплатно, без ключа)
    """
    # Координаты городов
    cities = {
        "moscow": {"lat": 55.7558, "lon": 37.6173},
        "spb": {"lat": 59.9343, "lon": 30.3351},
        "kazan": {"lat": 55.7887, "lon": 49.1221},
        "novosibirsk": {"lat": 55.0084, "lon": 82.9357},
        "ekaterinburg": {"lat": 56.8389, "lon": 60.6057},
    }
    
    city_key = city.lower()
    if city_key not in cities:
        city_key = "moscow"
    
    coords = cities[city_key]
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                WEATHER_API_URL,
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
            
            return {
                "success": True,
                "city": city,
                "temperature": current.get("temperature"),
                "wind_speed": current.get("windspeed"),
                "weather_code": current.get("weathercode"),
                "description": _get_weather_description(current.get("weathercode", 0))
            }
        except httpx.TimeoutException:
            return {"success": False, "error": "Сервис погоды временно недоступен"}
        except httpx.HTTPStatusError as e:
            return {"success": False, "error": f"Ошибка API: {e.response.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

def _get_weather_description(code: int) -> str:
    """Расшифровка кода погоды"""
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
    return weather_codes.get(code, "Неизвестно")