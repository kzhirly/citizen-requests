//SuccessPage.tsx
type Page = 'home' | 'registration' | 'login' | 'history' | 'success';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface SuccessPageProps {
  navigate: (page: Page, department?: string) => void;
  department: string;
  userData: UserData | null;
  logout: () => void;
}

export function SuccessPage({ navigate, department, userData, logout }: SuccessPageProps) {
  // Generate unique appeal number based on current date
  const generateAppealNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `№ ${year}-${month}-${random}`;
  };

  const appealNumber = generateAppealNumber();

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
        {/* Success message */}
        <div className="max-w-2xl mx-auto animate-scaleIn">
          <div className="bg-white/90 backdrop-blur-xl p-12 rounded-2xl shadow-2xl border border-white/50 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 animate-bounce-slow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Обращение успешно получено!
            </h1>

            <div className="space-y-6 mb-10">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 animate-slideRight" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <p>
                    Уникальный номер: <strong className="text-blue-700">{appealNumber}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 animate-slideRight" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>
                    Направлено в отдел: <strong className="text-purple-700">{department}</strong>
                  </p>
                </div>
              </div>

              <p className="text-gray-600 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                Следить за статусом вашего обращения вы можете в истории обращений
              </p>
            </div>

            <button 
              onClick={() => navigate('history')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 px-8 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto animate-fadeIn"
              style={{ animationDelay: '0.6s' }}
            >
              Перейти к истории обращений
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}