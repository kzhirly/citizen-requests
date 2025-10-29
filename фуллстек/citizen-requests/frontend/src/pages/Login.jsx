import { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // заглушка: здесь будет POST /api/auth/login
    setMsg("Вход (заглушка): токен получен (псевдо).");
  };

  return (
    <div className="card">
      <h2>Вход</h2>
      <form onSubmit={onSubmit}>
        <label>Логин</label>
        <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Введите логин" />
        <label>Пароль</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" />
        <button type="submit">Войти</button>
      </form>
      {msg && <p style={{marginTop:10}}>{msg}</p>}
    </div>
  );
}