import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../components/HomePage';

// Мокаем API
vi.mock('../api', () => ({
  createRequest: vi.fn(),
  uploadFile: vi.fn(),
}));

describe('HomePage', () => {
  it('рендерит главную страницу для гостя', () => {
    const mockNavigate = vi.fn();
    const mockLogout = vi.fn();
    
    render(
      <HomePage
        navigate={mockNavigate}
        isAuthenticated={false}
        userData={null}
        logout={mockLogout}
        role={null}
      />
    );
    
    expect(screen.getByText(/Сервис обращений граждан/i)).toBeInTheDocument();
  });

  it('показывает кнопку входа для неавторизованных', () => {
    const mockNavigate = vi.fn();
    const mockLogout = vi.fn();
    
    render(
      <HomePage
        navigate={mockNavigate}
        isAuthenticated={false}
        userData={null}
        logout={mockLogout}
        role={null}
      />
    );
    
    expect(screen.getByText(/Вход в систему/i)).toBeInTheDocument();
  });
});