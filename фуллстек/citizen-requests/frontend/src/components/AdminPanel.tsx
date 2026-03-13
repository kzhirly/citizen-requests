// AdminPanel.tsx (исправляем handleRoleChange)
import { useState, useEffect } from 'react';
import { updateUserRole } from '../api';

interface User {
  id: string;
  phone: string;
  role: string;
  registeredAt: string;
  firstName?: string;
  lastName?: string;
}

interface AdminPanelProps {
  userData: {
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  } | null;
}

export function AdminPanel({ userData }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Загрузка списка пользователей из localStorage
  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    setUsers(registeredUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(true);
    setMessage('');
    try {
      // Пытаемся вызвать API, если есть токен
      const token = localStorage.getItem('token');
      if (token) {
        await updateUserRole(userId, newRole);
      }
      // Обновляем localStorage
      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      );
      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      setMessage(`✅ Роль изменена на ${newRole === 'admin' ? 'администратора' : 'пользователя'}`);

      // Если меняем свою роль – перезагружаем страницу после короткой задержки
      if (userData && users.find(u => u.id === userId)?.phone === userData.phone) {
        localStorage.setItem('role', newRole);
        setMessage(`✅ Ваша роль изменена. Страница перезагрузится...`);
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Ошибка при изменении роли');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Если пользователь не админ – не показываем панель
  if (userData?.role !== 'admin') return null;

  return (
    <div className="relative overflow-hidden rounded-2xl animate-fadeIn">
      {/* Декоративный фон (такой же, как на главной) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm"></div>

      {/* Основное содержимое с glassmorphism */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50">
        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl animate-bounce-slow">👑</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-black">
            Админ-панель
          </h2>
        </div>

        {/* Подсказка */}
        <p className="text-purple-700 bg-purple-50 border-l-4 border-purple-500 p-3 rounded mb-6 text-sm animate-slideRight">
          Вы — администратор. Вам доступно управление ролями.
        </p>

        {/* Сообщение об успехе/ошибке */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200 animate-fadeIn">
            {message}
          </div>
        )}

        {/* Таблица пользователей */}
        <div className="overflow-x-auto animate-scaleIn">
          <table className="min-w-full bg-white/80 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Имя</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Телефон</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Роль</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Дата регистрации</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Пока нет зарегистрированных пользователей
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-purple-50/50 transition-colors animate-slideRight"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="py-3 px-4">
                      {user.firstName || '—'} {user.lastName || ''}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{user.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(user.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleRoleChange(user.id, 'admin')}
                          disabled={loading}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-purple-700 px-3 py-1.5 rounded-lg text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                          {loading ? '...' : 'Сделать админом'}
                        </button>
                      )}
                      {user.role === 'admin' && user.phone !== userData?.phone && (
                        <button
                          onClick={() => handleRoleChange(user.id, 'user')}
                          disabled={loading}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                          {loading ? '...' : 'Сделать пользователем'}
                        </button>
                      )}
                      {user.role === 'admin' && user.phone === userData?.phone && (
                        <span className="text-gray-400 text-sm italic">Это вы</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Матрица прав (для красоты) */}
        <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Матрица прав доступа
          </h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="font-medium text-purple-700">Администратор:</span> полный доступ (создание, просмотр всех заявок, управление ролями)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="font-medium text-green-700">Пользователь:</span> создание заявок и просмотр только своих
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
              <span className="font-medium text-gray-700">Гость:</span> только просмотр (без создания заявок)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}