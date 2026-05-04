# ML Predictor — Clasificación de Cáncer de Mama 🧬

Aplicación web de Machine Learning para clasificar tumores como **Malignos** o **Benignos**
usando el dataset **Breast Cancer Wisconsin** (UCI) con Regresión Logística y Red Neuronal.

---
## 🧪 Cómo probar

### Predicción Individual
1. Ve a la sección **"Predicción Individual"**
2. Los campos ya tienen valores de ejemplo cargados
3. Selecciona el modelo (Regresión Logística o Red Neuronal)
4. Haz clic en **"Predecir"**
5. El resultado muestra la clase (Maligno/Benigno) y probabilidades

### Predicción por Lote
1. Ve a la sección **"Predicción por Lote"**
2. Descarga el CSV de ejemplo con el botón **"Descargar CSV de ejemplo"**
3. Sube el archivo (arrastra o clic)
4. Haz clic en **"Predecir Lote"**
5. Verás la tabla de resultados y métricas (si el CSV incluye columna `target`)

### Ver Métricas
- La sección **"Resultados"** muestra accuracy, precision, recall, F1 y matrices de confusión
- La sección **"Inicio"** muestra un resumen comparativo

---

## 📊 Dataset: Breast Cancer Wisconsin

| Característica | Detalle |
|---|---|
| **Fuente** | UCI Machine Learning Repository |
| **Muestras** | 569 |
| **Features** | 30 numéricas (radio, textura, perímetro…) |
| **Clases** | Maligno (0) / Benigno (1) |
| **Balance** | 37% Maligno / 63% Benigno |

**¿Por qué este dataset?**
- Limpio, sin valores faltantes
- Características clínicas reales y comprensibles
- Benchmark clásico ideal para comparar modelos
- Tamaño manejable (rápido de entrenar)

---

## 🤖 Modelos

### Regresión Logística
- `max_iter=1000`, `random_state=42`
- Accuracy típica: ~98%

### Red Neuronal (MLP)
- Capas: `[64, 32]`, activación `relu`
- Early stopping, `max_iter=500`
- Accuracy típica: ~95%

---
