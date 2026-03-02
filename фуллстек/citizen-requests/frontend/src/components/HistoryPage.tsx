import { useState } from 'react';


type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface HistoryPageProps {
  navigate: (page: Page, department?: string) => void;
  userData: UserData | null;
  logout: () => void;
}

const mockAppeals = [
  {
    id: 1,
    title: 'Снова обращения',
    date: '15 октября 2025',
    status: 'На рассмотрении',
    statusType: 'pending' as const,
    department: 'ЖКХ',
  },
  {
    id: 2,
    title: 'Ответ на обращения',
    date: '12 октября 2025',
    status: 'Обработано',
    statusType: 'completed' as const,
    department: 'Транспорт',
  },
  {
    id: 3,
    title: 'Отклонено обращение',
    date: '08 октября 2025',
    status: 'Отклонено',
    statusType: 'rejected' as const,
    department: 'Образование',
  },
  {
    id: 4,
    title: 'Снова обращения',
    date: '05 октября 2025',
    status: 'На рассмотрении',
    statusType: 'pending' as const,
    department: 'ЖКХ',
  },
  {
    id: 5,
    title: 'Проблема с освещением',
    date: '03 октября 2025',
    status: 'Обработано',
    statusType: 'completed' as const,
    department: 'ЖКХ',
  },
  {
    id: 6,
    title: 'Расписание автобусов',
    date: '01 октября 2025',
    status: 'На рассмотрении',
    statusType: 'pending' as const,
    department: 'Транспорт',
  },
];

const getStatusIcon = (type: 'pending' | 'completed' | 'rejected') => {
  switch (type) {
    case 'pending':
      return (
        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'completed':
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'rejected':
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const getStatusColor = (type: 'pending' | 'completed' | 'rejected') => {
  switch (type) {
    case 'pending':
      return 'bg-yellow-50 border-yellow-200 hover:border-yellow-300';
    case 'completed':
      return 'bg-green-50 border-green-200 hover:border-green-300';
    case 'rejected':
      return 'bg-red-50 border-red-200 hover:border-red-300';
  }
};

export function HistoryPage({ navigate, userData, logout }: HistoryPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Get unique departments for filter
  const departments = Array.from(new Set(mockAppeals.map(appeal => appeal.department)));

  // Filter appeals based on selected filters
  const filteredAppeals = mockAppeals.filter(appeal => {
    const statusMatch = statusFilter === 'all' || appeal.statusType === statusFilter;
    const departmentMatch = departmentFilter === 'all' || appeal.department === departmentFilter;
    return statusMatch && departmentMatch;
  });

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
        {/* Navigation */}
        <div className="absolute top-8 left-8 animate-slideDown">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </button>
        </div>

        {/* History content */}
        <div className="max-w-3xl mx-auto animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50">
            <h1 className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              История обращений
            </h1>

            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div className="animate-slideRight" style={{ animationDelay: '0.1s' }}>
                  <label className="block mb-2 text-gray-700 text-sm">
                    Фильтр по статусу
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="all">Все статусы</option>
                    <option value="pending">На рассмотрении</option>
                    <option value="completed">Обработано</option>
                    <option value="rejected">Отклонено</option>
                  </select>
                </div>

                {/* Department Filter */}
                <div className="animate-slideRight" style={{ animationDelay: '0.2s' }}>
                  <label className="block mb-2 text-gray-700 text-sm">
                    Фильтр по отделу
                  </label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="all">Все отделы</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppeals.map((appeal, index) => (
                <div 
                  key={appeal.id}
                  className={`p-5 rounded-xl border-2 ${getStatusColor(appeal.statusType)} transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] animate-slideRight`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-gray-800 mb-2">{appeal.title}</div>
                      <div className="text-sm text-gray-500 mb-1">{appeal.date}</div>
                      <div className="text-sm text-purple-600">Отдел: {appeal.department}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusIcon(appeal.statusType)}
                      <span className="text-sm text-gray-600">{appeal.status}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredAppeals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Нет обращений, соответствующих выбранным фильтрам
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}