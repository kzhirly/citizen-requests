// HomePage.tsx
import { useState } from 'react';
import { AdminPanel } from './AdminPanel';
import { createRequest } from '../api';

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface HomePageProps {
  navigate: (page: Page, department?: string) => void;
  isAuthenticated: boolean;
  userData: UserData | null;
  logout: () => void;
  role: string | null;
}

// Матрица прав доступа
const permissions = {
  guest: {
    canCreateAppeal: false,
    canViewOwnAppeals: false,
    canViewAllAppeals: false,
    canManageUsers: false,
    canAccessAdminPanel: false,
  },
  user: {
    canCreateAppeal: true,
    canViewOwnAppeals: true,
    canViewAllAppeals: false,
    canManageUsers: false,
    canAccessAdminPanel: false,
  },
  admin: {
    canCreateAppeal: true,
    canViewOwnAppeals: true,
    canViewAllAppeals: true,
    canManageUsers: true,
    canAccessAdminPanel: true,
  },
};

export function HomePage({ navigate, isAuthenticated, userData, logout, role }: HomePageProps) {
  const [appeal, setAppeal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Определяем текущую роль (если не аутентифицирован, то гость)
  const currentRole = !isAuthenticated ? 'guest' : (role || userData?.role || 'guest');
  const userPermissions = permissions[currentRole as keyof typeof permissions] || permissions.guest;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPermissions.canCreateAppeal) {
      alert('У вас нет прав для создания обращений');
      return;
    }
    
    if (appeal.trim()) {
      setIsSubmitting(true);
      try {
        // Вызов API для создания обращения
        const result = await createRequest(appeal);
        console.log('Обращение создано:', result);
        setAppeal('');
        navigate('success', 'Общий отдел обращений');
      } catch (error) {
        console.error('Ошибка при создании обращения:', error);
        alert('Ошибка при создании обращения');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Определяем приветствие в зависимости от роли
  const getGreeting = () => {
    if (!isAuthenticated) return '';
    
    switch(currentRole) {
      case 'admin':
        return `Здравствуйте, `;
      case 'user':
        return `Здравствуйте, `;
      case 'guest':
        return `Здравствуйте, `;
      default:
        return `Здравствуйте, `;
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden animate-fadeIn"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1691843406245-a1a236fead50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2dneSUyMGNpdHklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYxODIyMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full min-h-screen px-4 py-8">
        {/* Навигация */}
        {isAuthenticated && (
          <div className="flex justify-end mb-8 animate-slideDown">
            <div className="flex gap-4 items-center bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 p-2">
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="font-medium">{getGreeting()}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentRole === 'admin' ? 'bg-purple-500/50' : 
                  currentRole === 'user' ? 'bg-blue-500/50' : 
                  'bg-gray-500/50'
                }`}>
                  {currentRole === 'admin' ? 'Администратор' : 
                   currentRole === 'user' ? 'Пользователь' : 
                   'Гость'}
                </span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
              >
                <span>Выход</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Основной контент */}
        <div className="max-w-md mx-auto">
          {/* Карточка с формой */}
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/50 animate-scaleIn mb-8">
            <h1 className="text-center mb-3 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Сервис обращений граждан
            </h1>

            <p className="text-center text-gray-600 mb-8 text-lg">
              {!isAuthenticated 
                ? 'Для отправки обращения войдите или зарегистрируйтесь'
                : userPermissions.canCreateAppeal
                  ? 'Здесь вы можете отправить обращение и отслеживать его статус'
                  : 'У вас ограниченный доступ к системе :('}
            </p>

{isAuthenticated ? (
  <>
    {/* Форма создания обращения - только для user и admin */}
    {userPermissions.canCreateAppeal && (
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="mb-6 w-full max-w-md">
          <textarea
            value={appeal}
            onChange={(e) => setAppeal(e.target.value)}
            placeholder="Опишите вашу проблему..."
            className="w-full min-h-[200px] mb-4 bg-white border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-700"
            required
            disabled={isSubmitting}
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Отправка...
              </>
            ) : (
              'Отправить обращение'
            )}
          </button>
        </form>
      </div>
    )}

    {/* Для гостя показываем информационное сообщение */}
    {currentRole === 'guest' && (
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Вы вошли как гость. Для создания обращений необходимо 
                <button 
                  onClick={() => navigate('registration')}
                  className="text-blue-600 underline ml-1 hover:text-blue-800"
                >
                  зарегистрироваться
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )}


                {/* Кнопки навигации */}
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {/* Мои заявки - доступно user и admin */}
                  {userPermissions.canViewOwnAppeals && (
                    <button
                      onClick={() => navigate('history')}
                      className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="black">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Мои заявки
                    </button>
                  )}

                  {/* Все заявки - только для admin */}
                  {userPermissions.canViewAllAppeals && (
                    <button
                      onClick={() => {
                        alert('Просмотр всех заявок (только для админа)');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Все заявки
                    </button>
                  )}

                  {/* Админ панель - только для admin */}
                  {userPermissions.canAccessAdminPanel && (
                    <button
                      onClick={() => setShowAdminPanel(!showAdminPanel)}
                      className="bg-orange-600 hover:bg-orange-700 text-black px-4 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 md:col-span-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      {showAdminPanel ? 'Скрыть админ панель' : 'Показать админ панель'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              // Если не залогинен - показываем кнопки входа/регистрации
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 px-6 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Вход в систему
                </button>
                <button 
                  onClick={() => navigate('registration')}
                  className="w-full bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl py-4 px-6 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Регистрация
                </button>
                
                {/* Кнопка гостевого входа */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/90 text-gray-500">или</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const guestUser = {
                      firstName: 'Гость',
                      lastName: '',
                      phone: 'guest_' + Date.now(),
                      role: 'guest',
                    };
                    localStorage.setItem('role', 'guest');
                    localStorage.setItem('firstName', 'Гость');
                    localStorage.setItem('isGuest', 'true');
                    window.location.reload(); // Простой способ обновить состояние
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-black rounded-xl py-3 px-6 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Войти как гость
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Гость может только просматривать информацию, но не создавать заявки
                </p>
              </div>
            )}
          </div>

          {/* Админ панель - показываем только для админа и если открыта */}
          {currentRole === 'admin' && showAdminPanel && (
            <div className="animate-slideUp">
              <AdminPanel userData={userData} />
            </div>
          )}
        </div>
      </div>

      {/* Добавляем стили для анимаций */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}