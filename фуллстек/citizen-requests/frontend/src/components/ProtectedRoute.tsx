// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';

type Role = 'guest' | 'user' | 'admin';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
  currentRole: string | null;
  isAuthenticated: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'guest', 
  currentRole, 
  isAuthenticated,
  fallback 
}: ProtectedRouteProps) {
  
  // Если страница для гостей (регистрация, логин) - пускаем всех
  if (requiredRole === 'guest') {
    // Для гостевых страниц проверяем, что пользователь НЕ авторизован
    if (isAuthenticated) {
      return fallback ? <>{fallback}</> : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Вы уже авторизованы</h2>
            <p className="text-gray-600 mb-4">Для доступа к этой странице нужно выйти из системы</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              На главную
            </button>
          </div>
        </div>
      );
    }
    // Если не авторизован - пускаем на гостевую страницу
    return <>{children}</>;
  }

  // Для защищенных страниц (user, admin) проверяем авторизацию
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Доступ запрещен</h2>
          <p className="text-gray-600 mb-4">Пожалуйста, войдите в систему</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  // Проверяем права доступа для авторизованных пользователей
  const userRole = currentRole as Role || 'guest';
  
  // Admin имеет доступ ко всем защищенным страницам
  if (userRole === 'admin') {
    return <>{children}</>;
  }
  
  // Для user проверяем, что требуется именно user роль
  if (requiredRole === 'user' && userRole === 'user') {
    return <>{children}</>;
  }

  // Если ни одно условие не подошло - нет доступа
  return fallback ? <>{fallback}</> : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Недостаточно прав</h2>
        <p className="text-gray-600 mb-4">
          У вас нет доступа к этой странице. 
          Ваша роль: <span className="font-semibold">{userRole}</span>, 
          требуется: <span className="font-semibold">{requiredRole}</span>
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          На главную
        </button>
      </div>
    </div>
  );
}