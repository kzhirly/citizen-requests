import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SubmitRequest from "./pages/SubmitRequest";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/register">Регистрация</Link> |{" "}
        <Link to="/login">Вход</Link> |{" "}
        <Link to="/submit">Подать обращение</Link> |{" "}
        <Link to="/history">История обращений</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit" element={<SubmitRequest />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;