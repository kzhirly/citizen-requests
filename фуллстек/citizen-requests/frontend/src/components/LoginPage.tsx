import { useState } from 'react';
import { loginUser } from "../api";

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
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
  console.log("LOGIN RESPONSE:", res);

  if (res.detail === "Invalid credentials") {
    alert("Неверный логин или пароль!");
    return;
  }

  if (!res.access_token) {
    alert("Ошибка входа!");
    return;
  }

  // сохраняем токен
  localStorage.setItem("token", res.access_token);

  login({
    firstName: "Пользователь",
    lastName: "",
    phone: phone,
  });
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
        {/* Navigation links */}
        <div className="absolute top-8 left-8 flex gap-4 animate-slideDown">

        </div>

        {/* Login form */}
        <div className="max-w-md mx-auto animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50">
            <h1 className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Вход
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slideRight" style={{ animationDelay: '0.1s' }}>
                <label className="block mb-2 text-gray-700">
                  Номер телефона/почта
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Введите телефон или email"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="animate-slideRight" style={{ animationDelay: '0.2s' }}>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
                <div className="text-right mt-2">
                  <button 
                    type="button"
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Забыли пароль?
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-6 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-fadeIn"
                style={{ animationDelay: '0.3s' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}