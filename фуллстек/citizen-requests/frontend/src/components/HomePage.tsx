//HomePage.tsx
import { useState } from 'react';

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
  role: string | null
}

export function HomePage({ navigate, isAuthenticated, userData, logout }: HomePageProps) {
  const [appeal, setAppeal] = useState('');
  const role = userData?.role || 'user';

{(role === 'user' || role === 'admin') && (
  <button onClick={() => navigate('history')}>Мои заявки</button>
)}
{role === 'admin' && (
  <button onClick={() => alert('Админ панель')}>Админ панель</button>
)}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appeal.trim()) {
      navigate('success', 'Общий отдел обращений'); // тут можно оставить простым
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden animate-fadeIn"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1691843406245-a1a236fead50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2dneSUyMGNpdHklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYxODIyMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full px-8">
        {/* Навигация */}
        {isAuthenticated && (
          <div className="absolute top-8 right-8 flex gap-4 items-center animate-slideDown">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20">
              <span>Здравствуйте, {userData?.firstName}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
            >
              Выход
            </button>
          </div>
        )}

        {/* Основной контент */}
        {isAuthenticated ? (
          <>
            <div className="max-w-md mx-auto animate-scaleIn">
              <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50">
                <h1 className="text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Сервис обращений граждан
                </h1>

                <p className="text-center text-gray-600 mb-8">
                  Здесь вы можете отправить обращение и отслеживать его статус
                </p>

                <form onSubmit={handleSubmit}>
                  <textarea
                    value={appeal}
                    onChange={(e) => setAppeal(e.target.value)}
                    placeholder="Опишите вашу проблему..."
                    className="w-full min-h-[180px] mb-6 bg-white border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Отправить обращение
                  </button>
                </form>

                {/* Кнопки по ролям */}
                <div className="mt-6 flex flex-col gap-2">
                  {(role === 'user' || role === 'admin') && (
                    <button
                      onClick={() => navigate('history')}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Мои заявки
                    </button>
                  )}
                  {role === 'admin' && (
                    <button
                      onClick={() => alert('Админ панель')}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Админ панель
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Если не залогинен
          <div className="max-w-md mx-auto animate-scaleIn">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50 text-center">
              <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Сервис обращений граждан
              </h1>
              <p className="text-gray-600 mb-8">
                Для отправки обращения войдите или зарегистрируйтесь
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 px-6"
                >
                  Вход
                </button>
                <button 
                  onClick={() => navigate('registration')}
                  className="w-full bg-white text-gray-700 border-2 border-gray-200 rounded-xl py-3 px-6"
                >
                  Регистрация
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}