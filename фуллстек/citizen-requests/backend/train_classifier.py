# backend/train_classifier.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from joblib import dump
import json

# Простой тренировочный набор — расширяй по необходимости
data = [
    ("Не работает лифт, подъезд в грязи", "ЖКХ"),
    ("Пропал автобус маршрута 12", "Транспорт"),
    ("В школе нужно открыть дополнительные группы", "Образование"),
    ("Нужна прививка в поликлинике", "Здравоохранение"),
    ("Сломана детская площадка в парке", "Благоустройство"),
    ("Хочу получить паспорт нового образца", "Документы и регистрация"),
    ("Нет воды в доме", "ЖКХ"),
    ("Автобус запоздал на 40 минут", "Транспорт"),
    ("Отсутствие освещения на улице", "ЖКХ"),
    ("Проблема с расписанием школьного автобуса", "Транспорт"),
    ("У меня вопрос по регистрации предприятия", "Документы и регистрация"),
    ("Проблема с больницей: нет специалистов", "Здравоохранение"),
    ("Требуется убрать мусор на детской площадке", "Благоустройство"),
]

# Подготовим X (text) и y (labels)
texts = [f"{t[0]}" for t in data]
labels = [t[1] for t in data]

# Pipeline: TFIDF + MultinomialNB
pipeline = make_pipeline(TfidfVectorizer(ngram_range=(1,2), max_features=3000), MultinomialNB())

# Для простоты — train_test_split, но можно обучить на всех данных
X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42)

pipeline.fit(X_train, y_train)

# Оценка (для отладки)
print("Train score:", pipeline.score(X_train, y_train))
print("Test score:", pipeline.score(X_test, y_test))

# Сохраним модель
dump(pipeline, "app/models/department_classifier.joblib")
print("Saved: backend/app/models/department_classifier.joblib")

# Можно также сохранить mapping (если понадобятся)
with open("app/models/labels.json", "w", encoding="utf-8") as f:
    json.dump(sorted(list(set(labels))), f, ensure_ascii=False, indent=2)