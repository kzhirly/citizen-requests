#app/services/classifier.py
from joblib import load
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "department_classifier.joblib"
)

try:
    model = load(MODEL_PATH)
except:
    model = None

def classify(text, title=""):
    if model is None:
        return "other"
    prediction = model.predict([title + " " + text])[0]
    return prediction