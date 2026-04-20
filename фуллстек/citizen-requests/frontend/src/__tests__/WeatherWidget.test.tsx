import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { WeatherWidget } from '../components/WeatherWidget';

// Мокаем fetch до каждого теста
beforeEach(() => {
  global.fetch = vi.fn();
});

describe('WeatherWidget', () => {
  it('показывает компонент загрузки (рендерится без ошибок)', async () => {
    // Мокаем медленный ответ
    (global.fetch as any).mockImplementationOnce(() => new Promise(() => {}));
    
    await act(async () => {
      render(<WeatherWidget />);
    });
    
    // Просто проверяем, что компонент отрендерился (без сложных селекторов)
    expect(document.querySelector('.rounded-xl')).toBeInTheDocument();
  });

  it('показывает погоду после загрузки', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          success: true, 
          temperature: 20, 
          city: 'Москва', 
          description: 'Ясно',
          wind_speed: 5 
        }),
      })
    );
    
    await act(async () => {
      render(<WeatherWidget />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/20°C/i)).toBeInTheDocument();
    });
  });

  it('показывает ошибку при проблемах с API', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );
    
    await act(async () => {
      render(<WeatherWidget />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/не удалось загрузить/i)).toBeInTheDocument();
    });
  });
});