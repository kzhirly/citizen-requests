// LoginPage.tsx (добавьте после формы)
import { useState } from 'react';
import { loginUser } from "../api";
import { jwtDecode } from "jwt-decode";

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface LoginPageProps {
  navigate: (page: Page, department?: string) => void;
  login: (user: UserData) => void;
}
export function LoginPage({ navigate, login }: LoginPageProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser(phone, password);
    if (!res.access_token) {
      alert("Ошибка входа!");
      return;
    }
    localStorage.setItem("token", res.access_token);
    const decoded: any = jwtDecode(res.access_token);
    localStorage.setItem("role", decoded.role);
    login({
      firstName: "Пользователь",
      lastName: "",
      phone: phone,
      role: decoded.role,
    });
    navigate('home');
  };

  const handleGuestLogin = () => {
    const guestUser = {
      firstName: 'Гость',
      lastName: '',
      phone: 'guest_' + Date.now(),
      role: 'guest',
    };
    localStorage.setItem('role', 'guest');
    localStorage.setItem('firstName', 'Гость');
    localStorage.setItem('isGuest', 'true');
    login(guestUser);
    navigate('home');
  };


  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden animate-fadeIn"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1691843406245-a1a236fead50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full px-8">
        <div className="max-w-md mx-auto animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50">
            <h1 className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Вход
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-gray-700">Номер телефона/почта</label>
                <input
                  type="text"
                  placeholder="Введите телефон или email"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Пароль</label>
                <input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Войти
              </button>
            </form>

            {/* Кнопка гостевого входа */}
            <div className="mt-6">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/90 text-gray-500">или</span>
                </div>
              </div>
              
              <button
                onClick={handleGuestLogin}
                className="w-full bg-gray-600 hover:bg-gray-700 text-black rounded-xl py-3 px-6 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Войти как гость
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Гость может только просматривать информацию
              </p>
            </div>

            <div className="mt-4 flex justify-between">
              <button onClick={() => navigate('registration')} className="text-sm text-gray-500 hover:text-blue-600">
                Регистрация
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}