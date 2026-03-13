//RegistrationPage.tsx
import { useState } from 'react';
import { registerUser, loginUser } from "../api";
import { jwtDecode } from "jwt-decode";

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
  });
  const [isLoading, setIsLoading] = useState(false); // ✅ было определено

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // 1. Регистрируем пользователя
    const regRes = await registerUser(formData.phone, formData.password);
    
    if (regRes.detail === "User exists") {
      alert("Такой пользователь уже есть!");
      setIsLoading(false);
      return;
    }

    if (!regRes.user_id && !regRes.id) {
      alert("Ошибка регистрации!");
      setIsLoading(false);
      return;
    }

    // 2. Сразу логинимся, чтобы получить токен с правильной ролью
    const loginRes = await loginUser(formData.phone, formData.password);
    
    if (!loginRes.access_token) {
      alert("Ошибка автоматического входа после регистрации");
      setIsLoading(false);
      return;
    }

    // 3. Декодируем токен, получаем реальную роль
    const decoded: any = jwtDecode(loginRes.access_token);
    const role = decoded.role; // роль от бэкенда

    // 4. Сохраняем данные
    localStorage.setItem('token', loginRes.access_token);
    localStorage.setItem('role', role);
    localStorage.setItem('firstName', formData.firstName);
    localStorage.setItem('lastName', formData.lastName);
    localStorage.setItem('phone', formData.phone);
    localStorage.setItem('userId', regRes.user_id || regRes.id);

    // 5. Обновляем список в localStorage (для админ-панели)
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    existingUsers.push({
      id: regRes.user_id || regRes.id,
      phone: formData.phone,
      role: role,
      registeredAt: new Date().toISOString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
    });
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));

    // 6. Сообщаем, если роль admin
    if (role === 'admin') {
      alert("🎉 Вы первый пользователь! Вам назначена роль администратора.");
    }

    // 7. Вызываем login из пропсов
    login({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: role,
    });

    navigate('home');
  } catch (error) {
    console.error("Registration error:", error);
    alert("Ошибка при регистрации");
  } finally {
    setIsLoading(false);
  }
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

              {/* Информация о ролях */}
              <div className="bg-blue-50 p-4 rounded-lg animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                <p className="text-sm text-blue-800">
                  <span className="font-bold">ℹ️ Как назначаются роли:</span>
                  <br />
                  • Первый пользователь становится <span className="font-bold text-red-600">администратором</span>
                  <br />
                  • Остальные получают роль <span className="font-bold text-green-600">пользователя</span>
                  <br />
                  • Администратор может менять роли других пользователей
                </p>
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-fadeIn disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animationDelay: '0.7s' }}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}