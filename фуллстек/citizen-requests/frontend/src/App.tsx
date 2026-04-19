import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginPage } from './components/LoginPage';
import { HistoryPage } from './components/HistoryPage';
import { SuccessPage } from './components/SuccessPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { clearTokens, getAccessToken } from './api';

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

// Функция для обновления мета-тегов при смене страницы
function updateMetaTags(page: Page) {
  const titles = {
    home: 'Главная - Сервис обращений граждан',
    registration: 'Регистрация - Сервис обращений граждан',
    login: 'Вход - Сервис обращений граждан',
    history: 'История обращений - Сервис обращений граждан',
    success: 'Обращение отправлено - Сервис обращений граждан'
  };
  
  const descriptions = {
    home: 'Подайте обращение в государственные органы. ЖКХ, транспорт, образование, здравоохранение - выберите тему и отправьте заявку.',
    registration: 'Зарегистрируйтесь в сервисе обращений граждан. Быстрая регистрация по номеру телефона.',
    login: 'Войдите в личный кабинет сервиса обращений граждан.',
    history: 'Просмотр истории ваших обращений и отслеживание статуса.',
    success: 'Ваше обращение успешно отправлено. Следите за статусом в истории.'
  };
  
  document.title = titles[page];
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', descriptions[page]);
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  // Обновляем мета-теги при смене страницы
  useEffect(() => {
    updateMetaTags(currentPage);
  }, [currentPage]);

  // Слушаем событие принудительного выхода (при ошибке refresh токена)
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };
    
    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  // Восстанавливаем сессию при загрузке
  useEffect(() => {
    const token = getAccessToken();
    const savedRole = localStorage.getItem('role');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const phone = localStorage.getItem('phone');

    // Гость не имеет токена, но мы всё равно пускаем его
    if (savedRole === 'guest') {
      setIsAuthenticated(true);
      setRole('guest');
      setUserData({
        firstName: firstName || 'Гость',
        lastName: lastName || '',
        phone: phone || '',
        role: 'guest',
      });
    }
    // Для обычных пользователей проверяем наличие токена
    else if (savedRole && token) {
      setIsAuthenticated(true);
      setRole(savedRole);
      setUserData({
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        role: savedRole,
      });
    }
  }, []);

  const navigate = (page: Page, department?: string) => {
    if (department) {
      setSelectedDepartment(department);
    }
    setCurrentPage(page);
  };

  const login = (user: UserData) => {
    setUserData(user);
    setRole(user.role);
    setIsAuthenticated(true);
    localStorage.setItem('role', user.role);
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem('phone', user.phone);
    navigate('home');
  };

  const logout = () => {
    setUserData(null);
    setRole(null);
    setIsAuthenticated(false);
    clearTokens();
    localStorage.removeItem('role');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('phone');
    localStorage.removeItem('isGuest');
    navigate('home');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          navigate={navigate}
          isAuthenticated={isAuthenticated}
          userData={userData}
          logout={logout}
          role={role}
        />
      )}

      {currentPage === 'registration' && (
        <ProtectedRoute requiredRole="guest" currentRole={role} isAuthenticated={isAuthenticated}>
          <RegistrationPage navigate={navigate} login={login} />
        </ProtectedRoute>
      )}

      {currentPage === 'login' && (
        <ProtectedRoute requiredRole="guest" currentRole={role} isAuthenticated={isAuthenticated}>
          <LoginPage navigate={navigate} login={login} />
        </ProtectedRoute>
      )}

      {currentPage === 'history' && (
        <ProtectedRoute requiredRole="user" currentRole={role} isAuthenticated={isAuthenticated}>
          <HistoryPage navigate={navigate} userData={userData} logout={logout} />
        </ProtectedRoute>
      )}

      {currentPage === 'success' && (
        <ProtectedRoute requiredRole="user" currentRole={role} isAuthenticated={isAuthenticated}>
          <SuccessPage 
            navigate={navigate} 
            department={selectedDepartment} 
            userData={userData} 
            logout={logout} 
          />
        </ProtectedRoute>
      )}
    </>
  );
}