export default function SubmitRequest() {
  return (
    <div>
      <h2>Подать обращение</h2>
      <form>
        <input placeholder="ФИО" />
        <input placeholder="Контакт" />
        <input placeholder="Тема обращения" />
        <input placeholder="Заголовок" />
        <textarea placeholder="Описание" />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}