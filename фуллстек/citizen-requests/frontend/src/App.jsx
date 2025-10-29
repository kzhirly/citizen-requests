import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SubmitRequest from "./pages/SubmitRequest";
import History from "./pages/History";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="topnav">
        <Link to="/">Главная</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/login">Вход</Link>
        <Link to="/submit">Подать обращение</Link>
        <Link to="/history">История</Link>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<div><h2>Сервис обращений граждан</h2><p>Добро пожаловать — выберите действие в навигации.</p></div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/submit" element={<SubmitRequest />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;