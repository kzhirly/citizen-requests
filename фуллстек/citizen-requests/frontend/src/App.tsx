//App.tsx
import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginPage } from './components/LoginPage';
import { HistoryPage } from './components/HistoryPage';
import { SuccessPage } from './components/SuccessPage';

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [role, setRole] = useState<string | null>(localStorage.getItem('role')); // 👈 добавили

  const navigate = (page: Page, department?: string) => {
    if (department) {
      setSelectedDepartment(department);
    }
    setCurrentPage(page);
  };

  const login = (user: UserData, userRole: string) => {
    setUserData(user);
    setIsAuthenticated(true);
    navigate('home');
  };

  const logout = () => {
    setUserData(null);
    setRole(null); // 👈 чистим роль
    setIsAuthenticated(false);
    localStorage.removeItem('role');
    navigate('home');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          navigate={navigate}
          isAuthenticated={isAuthenticated}
          userData={userData}
          logout={logout}
          role={role} // 👈 передаём роль в HomePage
        />
      )}
      {currentPage === 'registration' && (
        <RegistrationPage navigate={navigate} login={login} />
      )}
      {currentPage === 'login' && <LoginPage navigate={navigate} login={login} />}
      {currentPage === 'history' && <HistoryPage navigate={navigate} userData={userData} logout={logout} />}
      {currentPage === 'success' && <SuccessPage navigate={navigate} department={selectedDepartment} userData={userData} logout={logout} />}
    </>
  );
}