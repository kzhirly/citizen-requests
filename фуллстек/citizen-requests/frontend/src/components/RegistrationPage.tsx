//RegistrationPage.tsx
import { useState } from 'react';
import { registerUser } from "../api";

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
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
    role: 'user', // по умолчанию обычный пользователь
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await registerUser(formData.phone, formData.password);

    if (res.detail === "User exists") {
      alert("Такой пользователь уже есть!");
      return;
    }

    if (!res.user_id) {
      alert("Ошибка регистрации!");
      return;
    }

    // Сохраняем роль в localStorage, чтобы HomePage сразу увидел
    localStorage.setItem('role', formData.role);

  // RegistrationPage handleSubmit
  login({
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    role: formData.role, // обязательно!
  });

    // Переходим на главную сразу после регистрации
    navigate('home');
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden py-12 animate-fadeIn"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1691843406245-a1a236fead50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2dneSUyMGNpdHklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYxODIyMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full px-8">
        {/* Registration form */}
        <div className="max-w-md mx-auto animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50">
            <h1 className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Регистрация
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Имя */}
              <div className="animate-slideRight" style={{ animationDelay: '0.1s' }}>
                <label className="block mb-2 text-gray-700">Имя</label>
                <input
                  type="text"
                  placeholder="Введите имя"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full pl-3 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              {/* Фамилия */}
              <div className="animate-slideRight" style={{ animationDelay: '0.2s' }}>
                <label className="block mb-2 text-gray-700">Фамилия</label>
                <input
                  type="text"
                  placeholder="Введите фамилию"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full pl-3 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              {/* Телефон */}
              <div className="animate-slideRight" style={{ animationDelay: '0.3s' }}>
                <label className="block mb-2 text-gray-700">Номер телефона</label>
                <input
                type="tel"
                  placeholder="Введите номер"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-3 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              {/* Пароль */}
              <div className="animate-slideRight" style={{ animationDelay: '0.4s' }}>
                <label className="block mb-2 text-gray-700">Пароль</label>
                <input
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-3 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              {/* Выбор роли */}
              <div className="animate-slideRight" style={{ animationDelay: '0.5s' }}>
                <label className="block mb-2 text-gray-700">Роль</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full pl-3 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Админ</option>
                </select>
              </div>

              {/* Вход если уже есть аккаунт */}
              <p className="text-center text-sm text-gray-600 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                Уже есть аккаунт?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Войти!
                </button>
              </p>

              {/* Кнопка регистрации */}
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-fadeIn"
                style={{ animationDelay: '0.7s' }}
              >
                Зарегистрироваться
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}