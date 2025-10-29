import { useState } from "react";

export default function SubmitRequest() {
  const [form, setForm] = useState({
    full_name: "", contact: "", topic: "", title: "", description: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // заглушка: позже здесь вызов api.post("/requests", form)
    setResult({ request_id: Math.floor(Math.random()*1000), assigned_department: "ЖКХ" });
  };

  return (
    <div className="card">
      <h2>Подать обращение</h2>
      <form onSubmit={handleSubmit}>
        <label>ФИО</label>
        <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Иван Иванов" />
        <label>Контакт (телефон или e-mail)</label>
        <input name="contact" value={form.contact} onChange={handleChange} placeholder="ivan@mail.ru" />
        <label>Тема</label>
        <select name="topic" value={form.topic} onChange={handleChange}>
          <option value="">Выберите тему</option>
          <option>ЖКХ</option>
          <option>Транспорт</option>
          <option>Социальная сфера</option>
          <option>Благоустройство</option>
          <option>Другое</option>
        </select>
        <label>Заголовок</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Короткий заголовок" />
        <label>Описание</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Подробное описание проблемы" />
        <button type="submit">Отправить обращение</button>
      </form>

<p className="note">
  Мы автоматически выбираем отдел — модель будет улучшена в следующих ЛР.
</p>
      {result && (
        <div className="result card">
          <p style={{margin:0}}>Ваше обращение <b>№{result.request_id}</b> отправлено.</p>
          <p style={{margin:'6px 0 0'}}>Назначенный отдел: <b>{result.assigned_department}</b></p>
          <div style={{marginTop:8}}>
            <span className={`badge ${result.status || 'new'}`}>{(result.status==='in_progress')? 'В работе' : (result.status==='closed')? 'Закрыто' : 'Новое'}</span>
          </div>
        </div>
      )}
    </div>
  );
}