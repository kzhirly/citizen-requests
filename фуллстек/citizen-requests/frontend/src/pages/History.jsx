import { useState, useEffect } from "react";

export default function History() {
  const [filters, setFilters] = useState({
    assigned_department: "",
    status: "",
  });
  const [items, setItems] = useState([]);

  // Заглушечные данные — просто для отображения
  useEffect(() => {
    setItems([
      {
        request_id: 1,
        title: "Лифт не работает",
        assigned_department: "ЖКХ",
        status: "new",
        created_at: "2025-10-25",
      },
      {
        request_id: 2,
        title: "Сломана лавочка во дворе",
        assigned_department: "Благоустройство",
        status: "in_progress",
        created_at: "2025-10-20",
      },
      {
        request_id: 3,
        title: "Плохое освещение на улице",
        assigned_department: "Транспорт",
        status: "closed",
        created_at: "2025-09-15",
      },
    ]);
  }, []);

  // применяем фильтры локально
  const filtered = items.filter((i) => {
    const byDept = filters.assigned_department
      ? i.assigned_department === filters.assigned_department
      : true;
    const byStatus = filters.status ? i.status === filters.status : true;
    return byDept && byStatus;
  });

  return (
    <div className="card">
      <h2>История обращений</h2>

      {/* Блок фильтров */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <select
          onChange={(e) =>
            setFilters({ ...filters, assigned_department: e.target.value })
          }
          value={filters.assigned_department}
        >
          <option value="">Все отделы</option>
          <option value="ЖКХ">ЖКХ</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Социальная сфера">Социальная сфера</option>
          <option value="Благоустройство">Благоустройство</option>
          <option value="Другое">Другое</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          value={filters.status}
        >
          <option value="">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="closed">Закрытые</option>
        </select>

        <button className="secondary">Применить</button>
      </div>

      {/* Список обращений */}
      {filtered.length === 0 ? (
        <p>Пока нет обращений 🕊️</p>
      ) : (
        filtered.map((i) => (
          <div key={i.request_id} className="history-item">
            <div style={{ lineHeight: "1.5" }}>
              <b>{i.title}</b>
              <div className="meta" style={{ marginTop: 6 }}>
                <span className="date">
                  №{i.request_id} • {i.created_at}
                </span>
                <span> • {i.assigned_department}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge ${i.status}`}>
                  {i.status === "in_progress"
                    ? "В работе"
                    : i.status === "closed"
                    ? "Закрыто"
                    : "Новое"}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}