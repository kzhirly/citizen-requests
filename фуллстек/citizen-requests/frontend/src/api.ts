// frontend/src/api.ts

const API_URL = "http://127.0.0.1:8000/api";

// Хранение токенов
let accessToken: string | null = localStorage.getItem('token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

// Обновить токены в памяти и localStorage
function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('token', access);
  localStorage.setItem('refresh_token', refresh);
}

// Очистить токены
export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
}

// Получить access token (для заголовков)
export function getAccessToken() {
  return accessToken;
}

// --- REGISTRATION ---
export async function registerUser(username: string, password: string, role?: string) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username, 
        password,
        role: role || 'user'
      }),
    });
    return await res.json();
  } catch (e) {
    console.error("Register error:", e);
    return { error: true };
  }
}

// --- LOGIN (сохраняем оба токена) ---
export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    
    if (data.access_token && data.refresh_token) {
      setTokens(data.access_token, data.refresh_token);
    }
    
    return data;
  } catch (e) {
    console.error("Login error:", e);
    return { error: true };
  }
}

// --- REFRESH TOKEN (обновление access токена) ---
export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) {
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    const data = await res.json();
    
    if (data.access_token && data.refresh_token) {
      setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    }
    
    // Если refresh token невалидный - очищаем всё
    clearTokens();
    return null;
  } catch (e) {
    console.error("Refresh token error:", e);
    clearTokens();
    return null;
  }
}

// --- LOGOUT (отзываем refresh токен) ---
export async function logoutUser() {
  if (refreshToken) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (e) {
      console.error("Logout error:", e);
    }
  }
  clearTokens();
}

// --- Функция для авторизованных запросов с автоматическим обновлением токена ---
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // Функция для выполнения запроса с текущим токеном
  const makeRequest = async (token: string | null) => {
    // Создаем базовые заголовки с правильной типизацией
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Добавляем существующие заголовки из options
    if (options.headers) {
      const existingHeaders = options.headers as Record<string, string>;
      Object.entries(existingHeaders).forEach(([key, value]) => {
        headers[key] = value;
      });
    }
    
    // Добавляем Authorization если есть токен
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, {
      ...options,
      headers,
    });
  };

  // Пробуем выполнить запрос с текущим access токеном
  let response = await makeRequest(accessToken);
  
  // Если 401 Unauthorized - пробуем обновить токен
  if (response.status === 401 && refreshToken) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Повторяем запрос с новым токеном
      response = await makeRequest(newToken);
    } else {
      // Не удалось обновить - очищаем и редиректим на логин
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }
  
  return response;
}

// --- CREATE REQUEST (POST /api/requests) ---
export async function createRequest(description: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/requests`, {
      method: "POST",
      body: JSON.stringify({ description }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (e) {
    console.error("Create request error:", e);
    return { error: true };
  }
}

// --- GET ALL REQUESTS (GET /api/requests) ---
export async function getRequests() {
  try {
    const response = await fetchWithAuth(`${API_URL}/requests`, {
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (e) {
    console.error("Get requests error:", e);
    return [];
  }
}

// --- UPDATE REQUEST (PUT /api/requests/{id}) ---
export async function updateRequest(id: string, description: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify({ description }),
    });
    
    return await response.json();
  } catch (e) {
    console.error("Update request error:", e);
    return { error: true };
  }
}

// --- CLOSE REQUEST (PATCH /api/requests/{id}/close) ---
export async function closeRequest(id: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/requests/${id}/close`, {
      method: "PATCH",
    });
    
    return await response.json();
  } catch (e) {
    console.error("Close request error:", e);
    return { error: true };
  }
}

// --- UPDATE USER ROLE (PUT /api/users/{user_id}/role) ---
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role: newRole }),
    });
    
    return await response.json();
  } catch (e) {
    console.error("Update role error:", e);
    return { error: true };
  }
}

// --- GET PROFILE (GET /api/secure/profile) ---
export async function getProfile() {
  try {
    const response = await fetchWithAuth(`${API_URL}/secure/profile`, {
      method: "GET",
    });
    
    return await response.json();
  } catch (e) {
    console.error("Get profile error:", e);
    return null;
  }
}

// --- HEALTH CHECK (GET /api/health) ---
export async function healthCheck() {
  try {
    const res = await fetch(`${API_URL}/health`);
    return await res.json();
  } catch (e) {
    console.error("Health check error:", e);
    return { error: true };
  }
}

// --- ROOT ENDPOINT (GET /) ---
export async function getRoot() {
  try {
    const res = await fetch(`${API_URL}/`);
    return await res.text();
  } catch (e) {
    console.error("Root error:", e);
    return "Server error";
  }
}

// --- Функции для работы с пользователями в localStorage (временное решение) ---
export function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem('registered_users') || '[]');
}

export function saveUserRegistration(phone: string, role: string): void {
  const users = getRegisteredUsers();
  users.push({ 
    phone, 
    role, 
    registeredAt: new Date().toISOString(),
    id: Date.now().toString()
  });
  localStorage.setItem('registered_users', JSON.stringify(users));
}

export function isFirstUser(): boolean {
  return getRegisteredUsers().length === 0;
}


// --- ЗАГРУЗКА ФАЙЛОВ (для 3-й лабораторной) ---
export async function uploadFile(requestId: string, file: File) {
  try {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/requests/${requestId}/files`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    return await response.json();
  } catch (e) {
    console.error("Upload file error:", e);
    return { error: true };
  }
}

export async function getFiles(requestId: string) {
  try {
    const token = getAccessToken();
    const response = await fetch(`${API_URL}/requests/${requestId}/files`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await response.json();
  } catch (e) {
    console.error("Get files error:", e);
    return [];
  }
}