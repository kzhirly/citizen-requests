export default function Login() {
  return (
    <div>
      <h2>Вход</h2>
      <form>
        <input placeholder="Логин" />
        <input placeholder="Пароль" type="password" />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}