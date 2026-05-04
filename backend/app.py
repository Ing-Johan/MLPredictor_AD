import os
import io
import json
import traceback

import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix
)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR  = os.path.join(BASE_DIR, "models")
FRONTEND_DIR= os.path.join(BASE_DIR, "frontend")
STATIC_DIR  = os.path.join(FRONTEND_DIR, "static")

# ── App ────────────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="/static")
CORS(app)

# ── Cargar modelos al iniciar ──────────────────────────────────────────────────
print("Cargando modelos…")
scaler   = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
model_lr = joblib.load(os.path.join(MODELS_DIR, "logistic_regression.pkl"))
model_nn = joblib.load(os.path.join(MODELS_DIR, "neural_network.pkl"))

with open(os.path.join(MODELS_DIR, "metadata.json")) as f:
    metadata = json.load(f)

FEATURES   = metadata["feature_names"]
LABEL_MAP  = metadata["label_map"]
print("Modelos cargados.")


# ── Utilidades ────────────────────────────────────────────────────────────────
def get_model(name: str):
    if name == "neural_network":
        return model_nn
    return model_lr   # default


def predict_single(features_dict: dict, model_name: str):
    """Retorna dict con predicción, probabilidad y etiqueta."""
    row = [features_dict.get(f, 0.0) for f in FEATURES]
    X   = np.array(row).reshape(1, -1)
    X_sc= scaler.transform(X)
    model   = get_model(model_name)
    pred    = int(model.predict(X_sc)[0])
    proba   = model.predict_proba(X_sc)[0].tolist()
    return {
        "prediction": pred,
        "label":      LABEL_MAP[str(pred)],
        "probability_malignant": round(proba[0], 4),
        "probability_benign":    round(proba[1], 4),
        "model": model_name,
    }


# ── Rutas ─────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


@app.route("/api/info", methods=["GET"])
def api_info():
    return jsonify({
        "dataset": "Breast Cancer Wisconsin (UCI / scikit-learn)",
        "task": "Clasificación binaria: Maligno vs Benigno",
        "n_samples": metadata["n_samples"],
        "n_features": len(FEATURES),
        "features": FEATURES,
        "labels": LABEL_MAP,
        "models_available": ["logistic_regression", "neural_network"],
    })


@app.route("/api/metrics")
def get_metrics():
    with open("models/metadata.json") as f:
        meta = json.load(f)

    with open("models/lr_metrics.json") as f:
        lr = json.load(f)

    with open("models/nn_metrics.json") as f:
        nn = json.load(f)

    return {
        "logistic_regression": lr,
        "neural_network": nn
    }


@app.route("/api/predict", methods=["POST"])
def api_predict():
    try:
        body       = request.get_json(force=True)
        model_name = body.get("model", "logistic_regression")
        features   = body.get("features", {})

        # Validar que llegaron features
        missing = [f for f in FEATURES if f not in features]
        if missing:
            return jsonify({"error": f"Faltan features: {missing[:5]}…"}), 400

        result = predict_single(features, model_name)
        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/predict-batch", methods=["POST"])
def api_predict_batch():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No se encontró el archivo CSV"}), 400

        file       = request.files["file"]
        model_name = request.form.get("model", "logistic_regression")

        df = pd.read_csv(file)

        # Detectar si hay columna target para calcular métricas
        has_target = "target" in df.columns
        y_true     = df["target"].astype(int).tolist() if has_target else None

        # Alinear columnas con las features esperadas
        df_feat = df[[c for c in FEATURES if c in df.columns]]
        missing_cols = [c for c in FEATURES if c not in df.columns]
        for mc in missing_cols:
            df_feat[mc] = 0.0
        df_feat = df_feat[FEATURES]

        X_sc    = scaler.transform(df_feat.values)
        model   = get_model(model_name)
        preds   = model.predict(X_sc).tolist()
        probas  = model.predict_proba(X_sc).tolist()

        rows = []
        for i, (pred, proba) in enumerate(zip(preds, probas)):
            rows.append({
                "index":                  i,
                "prediction":             pred,
                "label":                  LABEL_MAP[str(pred)],
                "probability_malignant":  round(proba[0], 4),
                "probability_benign":     round(proba[1], 4),
            })

        response = {"predictions": rows, "model": model_name}

        # Métricas si hay labels reales
        if has_target and len(y_true) == len(preds):
            cm = confusion_matrix(y_true, preds)

            # Generar imagen de CM en memoria
            fig, ax = plt.subplots(figsize=(4, 3.5))
            sns.heatmap(
                cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["Maligno", "Benigno"],
                yticklabels=["Maligno", "Benigno"],
                ax=ax, linewidths=0.5
            )
            ax.set_title("Matriz de Confusión (Lote)")
            ax.set_ylabel("Real"); ax.set_xlabel("Predicho")
            plt.tight_layout()
            cm_path = os.path.join(STATIC_DIR, "cm_batch.png")
            fig.savefig(cm_path, dpi=110)
            plt.close(fig)

            response["batch_metrics"] = {
                "accuracy":  round(float(accuracy_score(y_true, preds)),  4),
                "precision": round(float(precision_score(y_true, preds, zero_division=0)), 4),
                "recall":    round(float(recall_score(y_true, preds, zero_division=0)), 4),
                "f1":        round(float(f1_score(y_true, preds, zero_division=0)), 4),
                "confusion_matrix": cm.tolist(),
                "cm_image":  "/static/cm_batch.png",
            }

        return jsonify(response)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    print(f"\nServidor iniciado en el puerto {port}\n")
    app.run(host="0.0.0.0", port=port)