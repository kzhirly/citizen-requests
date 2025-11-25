import { useState } from 'react';

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
}

interface HomePageProps {
  navigate: (page: Page, department?: string) => void;
  isAuthenticated: boolean;
  userData: UserData | null;
  logout: () => void;
}

// Mock AI function to determine department based on appeal content
const determineDepartment = (appealText: string): string => {
  const text = appealText.toLowerCase();
  
  if (text.includes('дорог') || text.includes('транспорт') || text.includes('автобус') || text.includes('остановк')) {
    return 'Транспорт';
  } else if (text.includes('жкх') || text.includes('отопление') || text.includes('вода') || text.includes('свет') || text.includes('освещение') || text.includes('лифт') || text.includes('мусор')) {
    return 'ЖКХ';
  } else if (text.includes('школ') || text.includes('детский сад') || text.includes('образован') || text.includes('учител')) {
    return 'Образование';
  } else if (text.includes('больниц') || text.includes('поликлиник') || text.includes('врач') || text.includes('здоровь')) {
    return 'Здравоохранение';
  } else if (text.includes('парк') || text.includes('сквер') || text.includes('благоустройств') || text.includes('двор')) {
    return 'Благоустройство';
  } else if (text.includes('документ') || text.includes('справк') || text.includes('паспорт')) {
    return 'Документы и регистрация';
  } else {
    return 'Общий отдел обращений';
  }
};

export function HomePage({ navigate, isAuthenticated, userData, logout }: HomePageProps) {
  const [appeal, setAppeal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appeal.trim()) {
      // Determine department using mock AI function
      const department = determineDepartment(appeal);
      navigate('success', department);
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
        {/* Navigation for authenticated users */}
        {isAuthenticated ? (
          <div className="absolute top-8 right-8 flex gap-4 items-center animate-slideDown">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Здравствуйте, {userData?.firstName}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выход
            </button>
          </div>
        ) : null}

        {/* Main content */}
        {isAuthenticated ? (
          // Authenticated view - show appeal form
          <>
            <div className="max-w-md mx-auto animate-scaleIn">
              <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50">
                <h1 className="text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Сервис обращений граждан
                </h1>
                <p className="text-center text-gray-600 mb-8">
                  Здесь вы можете отправить обращение<br />
                  и отслеживать его статус
                </p>

                <form onSubmit={handleSubmit}>
                  <label className="block mb-2 text-gray-700">
                    Введите ваше обращение
                  </label>
                  <textarea
                    value={appeal}
                    onChange={(e) => setAppeal(e.target.value)}
                    placeholder="Опишите вашу проблему или вопрос..."
                    className="w-full min-h-[180px] mb-6 bg-white border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    required
                  />

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Отправить обращение
                  </button>
                </form>
              </div>
            </div>

            {/* History link */}
            <button 
              onClick={() => navigate('history')}
              className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200 animate-slideDown"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              История обращений
            </button>
          </>
        ) : (
          // Not authenticated view - show welcome message and auth buttons
          <div className="max-w-md mx-auto animate-scaleIn">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Сервис обращений граждан
              </h1>
              
              <p className="text-gray-600 mb-8">
                Для отправки обращения необходимо<br />
                войти в систему или зарегистрироваться
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate('login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Вход
                </button>

                <button 
                  onClick={() => navigate('registration')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-xl py-3 px-6 transition-all shadow hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
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