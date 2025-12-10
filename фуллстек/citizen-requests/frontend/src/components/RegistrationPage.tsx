import { useState } from 'react';
import { registerUser } from "../api";

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
}

interface RegistrationPageProps {
  navigate: (page: Page, department?: string) => void;
  login: (user: UserData) => void;
}

export function RegistrationPage({ navigate, login }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
  });



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await registerUser(formData.phone, formData.password);
  console.log("REGISTER RESPONSE:", res);

  if (res.detail === "User exists") {
    alert("Такой пользователь уже есть!");
    return;
  }

  if (!res.user_id) {
    alert("Ошибка регистрации!");
    return;
  }

  login({
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
  });
};
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden py-12 animate-fadeIn"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1691843406245-a1a236fead50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2dneSUyMGNpdHklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYxODIyMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full px-8">
        {/* Navigation links */}
        <div className="absolute top-8 left-8 flex gap-4 animate-slideDown">
        </div>

        {/* Registration form */}
        <div className="max-w-md mx-auto animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50">
            <h1 className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Регистрация
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="animate-slideRight" style={{ animationDelay: '0.1s' }}>
                <label className="block mb-2 text-gray-700">
                  Имя
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Введите имя"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="animate-slideRight" style={{ animationDelay: '0.2s' }}>
                <label className="block mb-2 text-gray-700">
                  Фамилия
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Введите фамилию"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="animate-slideRight" style={{ animationDelay: '0.3s' }}>
                <label className="block mb-2 text-gray-700">
                  Номер телефона
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    type="tel"
                    placeholder="Введите номер"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="animate-slideRight" style={{ animationDelay: '0.4s' }}>
                <label className="block mb-2 text-gray-700">
                  Пароль
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    placeholder="Введите пароль"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                Уже есть аккаунт?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Войти!
                </button>
              </p>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-fadeIn"
                style={{ animationDelay: '0.6s' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Зарегистрироваться
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}