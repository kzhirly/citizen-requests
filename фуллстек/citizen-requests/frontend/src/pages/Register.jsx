export default function Register() {
  return (
    <div>
      <h2>Регистрация</h2>
      <form>
        <input placeholder="Логин" />
        <input placeholder="Пароль" type="password" />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}