// frontend/src/components/WeatherWidget.tsx
import { useState, useEffect } from 'react';

interface WeatherData {
  success: boolean;
  city?: string;
  temperature?: number;
  wind_speed?: number;
  description?: string;
  weather_icon?: string;
  error?: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Moscow');

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/weather?city=${city}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setWeather({ success: false, error: 'Не удалось загрузить погоду' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!weather?.success) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center text-gray-500">
        <p>🌧️ {weather?.error || 'Погода недоступна'}</p>
        <button 
          onClick={fetchWeather} 
          className="text-blue-600 text-sm mt-2 hover:underline"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Погода в {weather.city}</h3>
          <p className="text-3xl font-bold text-blue-600">{weather.temperature}°C</p>
          <p className="text-gray-500">{weather.description}</p>
          <p className="text-xs text-gray-400">Ветер: {weather.wind_speed} км/ч</p>
        </div>
        <div className="text-5xl">
          {weather.weather_icon || (weather.temperature && weather.temperature > 0 ? '☀️' : '❄️')}
        </div>
      </div>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="mt-3 w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
      >
        <option value="Moscow">Москва</option>
        <option value="spb">Санкт-Петербург</option>
        <option value="kazan">Казань</option>
        <option value="novosibirsk">Новосибирск</option>
        <option value="ekaterinburg">Екатеринбург</option>
      </select>
    </div>
  );
}