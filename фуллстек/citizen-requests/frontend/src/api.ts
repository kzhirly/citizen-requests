const API_URL = "http://127.0.0.1:8000/api";

// --- REGISTRATION ---
export async function registerUser(username: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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