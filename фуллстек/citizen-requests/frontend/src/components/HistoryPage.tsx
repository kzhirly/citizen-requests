// frontend/src/components/HistoryPage.tsx

import { useState, useEffect } from 'react';
import { getRequests, getAccessToken } from '../api';

type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface RequestItem {
  request_id: number;
  full_name?: string;
  contact?: string;
  topic?: string;
  title?: string;
  description?: string;
  assigned_department?: string;
  status: string;
  created_at: string;
  response?: string;
}

interface HistoryPageProps {
  navigate: (page: Page, department?: string) => void;
  userData: UserData | null;
  logout: () => void;
}

type SortField = 'created_at' | 'status' | 'assigned_department';
type SortOrder = 'asc' | 'desc';

export function HistoryPage({ navigate, userData, logout }: HistoryPageProps) {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  // Сортировка
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Загрузка данных с сервера
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (token) {
        const data = await getRequests();
        setRequests(Array.isArray(data) ? data : []);
      } else {
        // Mock данные для демо (если нет бэкенда)
        setRequests(mockRequests);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  // Получение уникальных отделов для фильтра
  const departments = Array.from(new Set(requests.map(r => r.assigned_department).filter(Boolean)));

  // Фильтрация
  const filteredRequests = requests.filter(req => {
    // Поиск по тексту
    const searchMatch = searchQuery === '' || 
      req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтр по статусу
    const statusMatch = statusFilter === 'all' || req.status === statusFilter;
    
    // Фильтр по отделу
    const departmentMatch = departmentFilter === 'all' || req.assigned_department === departmentFilter;
    
    return searchMatch && statusMatch && departmentMatch;
  });

  // Сортировка (исправленная версия)
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortField === 'created_at') {
      const aDate = new Date(a.created_at || '').getTime();
      const bDate = new Date(b.created_at || '').getTime();
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    }
    
    let aVal = (a[sortField] || '').toString().toLowerCase();
    let bVal = (b[sortField] || '').toString().toLowerCase();
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Пагинация
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, departmentFilter, sortField, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'in_progress': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'closed': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'Новое';
      case 'in_progress': return 'В работе';
      case 'closed': return 'Закрыто';
      default: return status || 'Новое';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden py-12 animate-fadeIn"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1691843406245-a1a236fead50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full px-8">
        {/* Навигация */}
        <div className="flex justify-between items-center mb-6 animate-slideDown">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-black rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-white">👋 {userData?.firstName || 'Пользователь'}</span>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-black rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="max-w-5xl mx-auto animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50">
            <h1 className="text-center mb-8 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              История обращений
            </h1>

            {/* Блок фильтрации */}
            <div className="mb-8 p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Фильтры и поиск
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Поиск */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Поиск</label>
                  <input
                    type="text"
                    placeholder="Поиск по заголовку или описанию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                {/* Фильтр по статусу */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Статус</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">Все статусы</option>
                    <option value="new">Новые</option>
                    <option value="in_progress">В работе</option>
                    <option value="closed">Закрытые</option>
                  </select>
                </div>
                
                {/* Фильтр по отделу */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Отдел</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">Все отделы</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Сброс фильтров */}
              {(searchQuery || statusFilter !== 'all' || departmentFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setDepartmentFilter('all');
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ✕ Сбросить все фильтры
                </button>
              )}
            </div>

            {/* Таблица с сортировкой */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <tr>
                    <th 
                      className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-1">
                        Дата
                        {sortField === 'created_at' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left">Тема</th>
                    <th 
                      className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleSort('assigned_department')}
                    >
                      <div className="flex items-center gap-1">
                        Отдел
                        {sortField === 'assigned_department' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Статус
                        {sortField === 'status' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        <div className="flex justify-center items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Загрузка...
                        </div>
                      </td>
                    </tr>
                  ) : paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        Нет обращений, соответствующих фильтрам
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((req, index) => (
                      <tr 
                        key={req.request_id} 
                        className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors animate-slideRight"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(req.created_at).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{req.title || req.topic || 'Без темы'}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{req.description?.slice(0, 100)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {req.assigned_department || 'Не назначен'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                            {getStatusText(req.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  ←
                </button>
                <span className="px-4 py-1 bg-blue-600 text-white rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  →
                </button>
              </div>
            )}

            {/* Информация о количестве записей */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Найдено: {filteredRequests.length} обращений
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock данные на случай отсутствия бэкенда
const mockRequests: RequestItem[] = [
  {
    request_id: 1,
    title: "Не работает лифт",
    description: "В подъезде №3 уже неделю не работает лифт",
    assigned_department: "ЖКХ",
    status: "new",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    request_id: 2,
    title: "Проблема с автобусом",
    description: "Автобус №12 постоянно опаздывает",
    assigned_department: "Транспорт",
    status: "in_progress",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    request_id: 3,
    title: "Нужен ремонт школы",
    description: "В школе №15 протекает крыша",
    assigned_department: "Образование",
    status: "closed",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    request_id: 4,
    title: "Освещение на улице",
    description: "На улице Ленина не горит фонарь",
    assigned_department: "ЖКХ",
    status: "new",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    request_id: 5,
    title: "Запись к врачу",
    description: "Не могу записаться к терапевту",
    assigned_department: "Здравоохранение",
    status: "in_progress",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    request_id: 6,
    title: "Детская площадка",
    description: "Сломаны качели на детской площадке",
    assigned_department: "Благоустройство",
    status: "new",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];