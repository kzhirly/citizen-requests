// api.ts
const API_URL = "http://127.0.0.1:8000/api";

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

// --- LOGIN ---
export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (e) {
    console.error("Login error:", e);
    return { error: true };
  }
}

// --- CREATE REQUEST (POST /api/requests) ---
export async function createRequest(description: string) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/requests`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ description }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (e) {
    console.error("Create request error:", e);
    return { error: true };
  }
}

// --- GET ALL REQUESTS (GET /api/requests) ---
export async function getRequests() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/requests`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (e) {
    console.error("Get requests error:", e);
    return [];
  }
}

// --- UPDATE REQUEST (PUT /api/requests/{id}) ---
export async function updateRequest(id: string, description: string) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/requests/${id}`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ description }),
    });
    
    return await res.json();
  } catch (e) {
    console.error("Update request error:", e);
    return { error: true };
  }
}

// --- CLOSE REQUEST (PATCH /api/requests/{id}/close) ---
export async function closeRequest(id: string) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/requests/${id}/close`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
    });
    
    return await res.json();
  } catch (e) {
    console.error("Close request error:", e);
    return { error: true };
  }
}

// --- UPDATE USER ROLE (PUT /api/users/{user_id}/role) ---
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/users/${userId}/role`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ role: newRole }),
    });
    
    return await res.json();
  } catch (e) {
    console.error("Update role error:", e);
    return { error: true };
  }
}

// --- GET PROFILE (GET /api/secure/profile) ---
export async function getProfile() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/secure/profile`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
    });
    
    return await res.json();
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