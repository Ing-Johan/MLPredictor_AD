const API = "http://localhost:5000/api";

// ── Estado global ────────────────────────────────────────────────────────────
let featureNames    = [];
let selectedModel   = "logistic_regression";
let selectedModelBatch = "logistic_regression";
let metricsData     = {};

// Ejemplos predefinidos: 6 benignos y 6 malignos
const predefinedExamples = [
  // Benignos
  {
    label: "Benigno",
    features: {
      mean_radius: 13.54, mean_texture: 14.36, mean_perimeter: 87.46, mean_area: 566.3,
      mean_smoothness: 0.09779, mean_compactness: 0.08129, mean_concavity: 0.06664,
      mean_concave_points: 0.04781, mean_symmetry: 0.1885, mean_fractal_dimension: 0.05766,
      radius_error: 0.2699, texture_error: 0.7886, perimeter_error: 2.058,
      area_error: 23.56, smoothness_error: 0.008462, compactness_error: 0.0146,
      concavity_error: 0.02387, concave_points_error: 0.01315,
      symmetry_error: 0.0198, fractal_dimension_error: 0.0023,
      worst_radius: 15.11, worst_texture: 19.26, worst_perimeter: 99.7,
      worst_area: 711.2, worst_smoothness: 0.144, worst_compactness: 0.1773,
      worst_concavity: 0.239, worst_concave_points: 0.1288,
      worst_symmetry: 0.2977, worst_fractal_dimension: 0.07259,
    }
  },
  {
    label: "Benigno",
    features: {
      mean_radius: 13.08, mean_texture: 15.71, mean_perimeter: 85.63, mean_area: 520.0,
      mean_smoothness: 0.1075, mean_compactness: 0.127, mean_concavity: 0.04568,
      mean_concave_points: 0.0311, mean_symmetry: 0.1967, mean_fractal_dimension: 0.06811,
      radius_error: 0.1852, texture_error: 0.7477, perimeter_error: 1.383,
      area_error: 14.67, smoothness_error: 0.004097, compactness_error: 0.01898,
      concavity_error: 0.01698, concave_points_error: 0.00649,
      symmetry_error: 0.01678, fractal_dimension_error: 0.002425,
      worst_radius: 14.5, worst_texture: 20.49, worst_perimeter: 96.09,
      worst_area: 630.5, worst_smoothness: 0.1312, worst_compactness: 0.2776,
      worst_concavity: 0.189, worst_concave_points: 0.07283,
      worst_symmetry: 0.3184, worst_fractal_dimension: 0.08183,
    }
  },
  {
    label: "Benigno",
    features: {
      mean_radius: 9.504, mean_texture: 12.44, mean_perimeter: 60.34, mean_area: 273.9,
      mean_smoothness: 0.1024, mean_compactness: 0.06492, mean_concavity: 0.02956,
      mean_concave_points: 0.02076, mean_symmetry: 0.1815, mean_fractal_dimension: 0.06905,
      radius_error: 0.2773, texture_error: 0.9768, perimeter_error: 1.909,
      area_error: 15.7, smoothness_error: 0.009606, compactness_error: 0.01432,
      concavity_error: 0.01985, concave_points_error: 0.01421,
      symmetry_error: 0.02027, fractal_dimension_error: 0.002968,
      worst_radius: 10.23, worst_texture: 15.66, worst_perimeter: 65.13,
      worst_area: 314.9, worst_smoothness: 0.1324, worst_compactness: 0.1148,
      worst_concavity: 0.08867, worst_concave_points: 0.06227,
      worst_symmetry: 0.245, worst_fractal_dimension: 0.07773,
    }
  },
  {
    label: "Benigno",
    features: {
      mean_radius: 13.03, mean_texture: 18.42, mean_perimeter: 82.61, mean_area: 523.8,
      mean_smoothness: 0.08983, mean_compactness: 0.03766, mean_concavity: 0.02562,
      mean_concave_points: 0.02923, mean_symmetry: 0.1467, mean_fractal_dimension: 0.05863,
      radius_error: 0.1839, texture_error: 2.342, perimeter_error: 1.17,
      area_error: 14.16, smoothness_error: 0.004352, compactness_error: 0.004899,
      concavity_error: 0.01343, concave_points_error: 0.01164,
      symmetry_error: 0.02671, fractal_dimension_error: 0.001777,
      worst_radius: 13.3, worst_texture: 22.81, worst_perimeter: 84.46,
      worst_area: 545.9, worst_smoothness: 0.09701, worst_compactness: 0.04619,
      worst_concavity: 0.04833, worst_concave_points: 0.05013,
      worst_symmetry: 0.1987, worst_fractal_dimension: 0.06169,
    }
  },
  {
    label: "Benigno",
    features: {
      mean_radius: 8.196, mean_texture: 16.84, mean_perimeter: 51.71, mean_area: 201.9,
      mean_smoothness: 0.086, mean_compactness: 0.05943, mean_concavity: 0.01588,
      mean_concave_points: 0.005917, mean_symmetry: 0.1769, mean_fractal_dimension: 0.06503,
      radius_error: 0.1563, texture_error: 0.9567, perimeter_error: 1.094,
      area_error: 8.205, smoothness_error: 0.008968, compactness_error: 0.01646,
      concavity_error: 0.01588, concave_points_error: 0.005917,
      symmetry_error: 0.02574, fractal_dimension_error: 0.002582,
      worst_radius: 8.964, worst_texture: 21.96, worst_perimeter: 57.26,
      worst_area: 242.2, worst_smoothness: 0.1297, worst_compactness: 0.1357,
      worst_concavity: 0.0688, worst_concave_points: 0.02564,
      worst_symmetry: 0.3105, worst_fractal_dimension: 0.07409,
    }
  },
  {
    label: "Benigno",
    features: {
      mean_radius: 12.05, mean_texture: 14.63, mean_perimeter: 78.04, mean_area: 449.3,
      mean_smoothness: 0.1031, mean_compactness: 0.09092, mean_concavity: 0.06592,
      mean_concave_points: 0.02749, mean_symmetry: 0.1675, mean_fractal_dimension: 0.06043,
      radius_error: 0.2636, texture_error: 0.7294, perimeter_error: 1.848,
      area_error: 19.87, smoothness_error: 0.005488, compactness_error: 0.01427,
      concavity_error: 0.02322, concave_points_error: 0.00566,
      symmetry_error: 0.01428, fractal_dimension_error: 0.002422,
      worst_radius: 13.76, worst_texture: 20.7, worst_perimeter: 89.88,
      worst_area: 582.6, worst_smoothness: 0.1494, worst_compactness: 0.2156,
      worst_concavity: 0.305, worst_concave_points: 0.06548,
      worst_symmetry: 0.2747, worst_fractal_dimension: 0.08301,
    }
  },
  // Malignos
  {
    label: "Maligno",
    features: {
      mean_radius: 17.99, mean_texture: 10.38, mean_perimeter: 122.8, mean_area: 1001.0,
      mean_smoothness: 0.1184, mean_compactness: 0.2776, mean_concavity: 0.3001,
      mean_concave_points: 0.1471, mean_symmetry: 0.2419, mean_fractal_dimension: 0.07871,
      radius_error: 1.095, texture_error: 0.9053, perimeter_error: 8.589,
      area_error: 153.4, smoothness_error: 0.006399, compactness_error: 0.04904,
      concavity_error: 0.05373, concave_points_error: 0.01587,
      symmetry_error: 0.03003, fractal_dimension_error: 0.006193,
      worst_radius: 25.38, worst_texture: 17.33, worst_perimeter: 184.6,
      worst_area: 2019.0, worst_smoothness: 0.1622, worst_compactness: 0.6656,
      worst_concavity: 0.7119, worst_concave_points: 0.2654,
      worst_symmetry: 0.4601, worst_fractal_dimension: 0.1189,
    }
  },
  {
    label: "Maligno",
    features: {
      mean_radius: 20.57, mean_texture: 17.77, mean_perimeter: 132.9, mean_area: 1326.0,
      mean_smoothness: 0.08474, mean_compactness: 0.07864, mean_concavity: 0.0869,
      mean_concave_points: 0.07017, mean_symmetry: 0.1812, mean_fractal_dimension: 0.05667,
      radius_error: 0.5435, texture_error: 0.7339, perimeter_error: 3.398,
      area_error: 74.08, smoothness_error: 0.005225, compactness_error: 0.01308,
      concavity_error: 0.0186, concave_points_error: 0.0134,
      symmetry_error: 0.01389, fractal_dimension_error: 0.003532,
      worst_radius: 24.99, worst_texture: 23.41, worst_perimeter: 158.8,
      worst_area: 1956.0, worst_smoothness: 0.1238, worst_compactness: 0.1866,
      worst_concavity: 0.2416, worst_concave_points: 0.186,
      worst_symmetry: 0.275, worst_fractal_dimension: 0.08902,
    }
  },
  {
    label: "Maligno",
    features: {
      mean_radius: 19.69, mean_texture: 21.25, mean_perimeter: 130.0, mean_area: 1203.0,
      mean_smoothness: 0.1096, mean_compactness: 0.1599, mean_concavity: 0.1974,
      mean_concave_points: 0.1279, mean_symmetry: 0.2069, mean_fractal_dimension: 0.05999,
      radius_error: 0.7456, texture_error: 0.7869, perimeter_error: 4.585,
      area_error: 94.03, smoothness_error: 0.00615, compactness_error: 0.04006,
      concavity_error: 0.03832, concave_points_error: 0.02058,
      symmetry_error: 0.0225, fractal_dimension_error: 0.004571,
      worst_radius: 23.57, worst_texture: 25.53, worst_perimeter: 152.5,
      worst_area: 1709.0, worst_smoothness: 0.1444, worst_compactness: 0.4245,
      worst_concavity: 0.4504, worst_concave_points: 0.243,
      worst_symmetry: 0.3613, worst_fractal_dimension: 0.08758,
    }
  },
  {
    label: "Maligno",
    features: {
      mean_radius: 15.34, mean_texture: 14.26, mean_perimeter: 102.5, mean_area: 704.4,
      mean_smoothness: 0.1073, mean_compactness: 0.2135, mean_concavity: 0.2077,
      mean_concave_points: 0.09756, mean_symmetry: 0.2521, mean_fractal_dimension: 0.07032,
      radius_error: 0.4388, texture_error: 0.7096, perimeter_error: 3.384,
      area_error: 44.91, smoothness_error: 0.006789, compactness_error: 0.05328,
      concavity_error: 0.06446, concave_points_error: 0.02252,
      symmetry_error: 0.03672, fractal_dimension_error: 0.004394,
      worst_radius: 18.07, worst_texture: 19.08, worst_perimeter: 125.1,
      worst_area: 980.9, worst_smoothness: 0.139, worst_compactness: 0.5954,
      worst_concavity: 0.6305, worst_concave_points: 0.2393,
      worst_symmetry: 0.4667, worst_fractal_dimension: 0.09946,
    }
  },
  {
    label: "Maligno",
    features: {
      mean_radius: 21.16, mean_texture: 23.04, mean_perimeter: 137.2, mean_area: 1404.0,
      mean_smoothness: 0.09428, mean_compactness: 0.1022, mean_concavity: 0.1097,
      mean_concave_points: 0.08632, mean_symmetry: 0.1769, mean_fractal_dimension: 0.05278,
      radius_error: 0.6917, texture_error: 1.127, perimeter_error: 4.303,
      area_error: 93.99, smoothness_error: 0.004728, compactness_error: 0.01259,
      concavity_error: 0.01715, concave_points_error: 0.01038,
      symmetry_error: 0.01083, fractal_dimension_error: 0.001987,
      worst_radius: 29.17, worst_texture: 35.59, worst_perimeter: 188.0,
      worst_area: 2615.0, worst_smoothness: 0.1401, worst_compactness: 0.26,
      worst_concavity: 0.3155, worst_concave_points: 0.2009,
      worst_symmetry: 0.2822, worst_fractal_dimension: 0.07526,
    }
  },
  {
    label: "Maligno",
    features: {
      mean_radius: 16.65, mean_texture: 21.38, mean_perimeter: 110.0, mean_area: 904.6,
      mean_smoothness: 0.1121, mean_compactness: 0.1457, mean_concavity: 0.1525,
      mean_concave_points: 0.0917, mean_symmetry: 0.1995, mean_fractal_dimension: 0.0633,
      radius_error: 0.8068, texture_error: 0.9017, perimeter_error: 5.455,
      area_error: 102.6, smoothness_error: 0.006048, compactness_error: 0.01882,
      concavity_error: 0.02741, concave_points_error: 0.0113,
      symmetry_error: 0.01468, fractal_dimension_error: 0.002801,
      worst_radius: 26.46, worst_texture: 31.56, worst_perimeter: 177.0,
      worst_area: 2215.0, worst_smoothness: 0.1805, worst_compactness: 0.3578,
      worst_concavity: 0.4695, worst_concave_points: 0.2095,
      worst_symmetry: 0.3613, worst_fractal_dimension: 0.09564,
    }
  },
  // Intermedios (Zona gris: ~50-50)
  {
    label: "Intermedio",
    features: {
      mean_radius: 14.5, mean_texture: 17.5, mean_perimeter: 95.0, mean_area: 650.0,
      mean_smoothness: 0.1005, mean_compactness: 0.1165, mean_concavity: 0.1075,
      mean_concave_points: 0.0595, mean_symmetry: 0.1852, mean_fractal_dimension: 0.0606,
      radius_error: 0.55, texture_error: 0.85, perimeter_error: 3.5,
      area_error: 65.0, smoothness_error: 0.007, compactness_error: 0.023,
      concavity_error: 0.031, concave_points_error: 0.011,
      symmetry_error: 0.02, fractal_dimension_error: 0.003,
      worst_radius: 20.0, worst_texture: 24.0, worst_perimeter: 130.0,
      worst_area: 1200.0, worst_smoothness: 0.1365, worst_compactness: 0.33,
      worst_concavity: 0.38, worst_concave_points: 0.16,
      worst_symmetry: 0.32, worst_fractal_dimension: 0.085,
    }
  },
  {
    label: "Intermedio",
    features: {
      mean_radius: 15.2, mean_texture: 18.8, mean_perimeter: 98.5, mean_area: 710.0,
      mean_smoothness: 0.0985, mean_compactness: 0.1285, mean_concavity: 0.1195,
      mean_concave_points: 0.0685, mean_symmetry: 0.1965, mean_fractal_dimension: 0.0584,
      radius_error: 0.6, texture_error: 0.88, perimeter_error: 4.0,
      area_error: 78.0, smoothness_error: 0.0065, compactness_error: 0.026,
      concavity_error: 0.035, concave_points_error: 0.0125,
      symmetry_error: 0.019, fractal_dimension_error: 0.0035,
      worst_radius: 21.5, worst_texture: 25.5, worst_perimeter: 138.0,
      worst_area: 1350.0, worst_smoothness: 0.142, worst_compactness: 0.36,
      worst_concavity: 0.42, worst_concave_points: 0.18,
      worst_symmetry: 0.35, worst_fractal_dimension: 0.088,
    }
  },
];

function randomizeIndividualFeatures() {
  const randomIndex = Math.floor(Math.random() * predefinedExamples.length);
  const example = predefinedExamples[randomIndex];
  featureNames.forEach(f => {
    const input = document.getElementById(`field-${f}`);
    if (!input) return;
    input.value = example.features[f] || 0;
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  initNav();
  await Promise.all([loadInfo(), loadMetrics()]);
  initToggleGroups();
  initForm();
  initBatch();
});

// ══════════════════════════════════════════════════════════════════════════════
// NAVEGACIÓN
// ══════════════════════════════════════════════════════════════════════════════
function initNav() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.dataset.section;
      showSection(target);
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add("active");
}

// ══════════════════════════════════════════════════════════════════════════════
// CARGA DE METADATA E INFO
// ══════════════════════════════════════════════════════════════════════════════
async function loadInfo() {
  try {
    const res = await fetch(`${API}/info`);
    const data = await res.json();
    featureNames = data.features;
  } catch {
    console.warn("No se pudo conectar con el backend. Usando features de respaldo.");
    // Features de respaldo (Breast Cancer)
    featureNames = [
      "mean_radius","mean_texture","mean_perimeter","mean_area","mean_smoothness",
      "mean_compactness","mean_concavity","mean_concave_points","mean_symmetry",
      "mean_fractal_dimension","radius_error","texture_error","perimeter_error",
      "area_error","smoothness_error","compactness_error","concavity_error",
      "concave_points_error","symmetry_error","fractal_dimension_error",
      "worst_radius","worst_texture","worst_perimeter","worst_area",
      "worst_smoothness","worst_compactness","worst_concavity",
      "worst_concave_points","worst_symmetry","worst_fractal_dimension"
    ];
  }
}

async function loadMetrics() {
  try {
    const res = await fetch(`${API}/metrics?t=${Date.now()}`);
    metricsData = await res.json();

    console.log("Métricas actualizadas:", metricsData);

    renderMetricsBars(metricsData);
    renderResultsPage(metricsData);
  } catch (err) {
    console.error("Error cargando métricas:", err);
    document.getElementById("metrics-bars").innerHTML =
      '<p class="loading-text">Conecta el backend para ver métricas.</p>';
  }
}

// ── Barras de métricas (Inicio) ───────────────────────────────────────────────
function renderMetricsBars(data) {
  const container = document.getElementById("metrics-bars");
  const models = [
    { key: "logistic_regression", label: "Regresión Logística", color: "" },
    { key: "neural_network",      label: "Red Neuronal (MLP)",  color: "green" },
  ];
  const metricKeys = ["accuracy","precision","recall","f1"];

  const getMetricValue = (metrics, key) => {
    if (!metrics) return 0;
    return metrics[key] ?? metrics[`${key}_score`] ?? 0;
  };

  let html = "";
  models.forEach(m => {
    if (!data[m.key]) return;
    metricKeys.forEach(k => {
      const val = getMetricValue(data[m.key], k);
      const pct = (val * 100).toFixed(1);
      html += `
        <div class="metric-bar-row">
          <div class="metric-bar-label">${m.label} · ${k}</div>
          <div class="metric-bar-track">
            <div class="metric-bar-fill ${m.color}" style="width:${pct}%"></div>
          </div>
          <div class="metric-bar-value">${pct}%</div>
        </div>`;
    });
  });
  container.innerHTML = html;
}

// ── Chips de métricas (Resultados) ───────────────────────────────────────────
function renderResultsPage(data) {
  renderChips("lr-metrics", data.logistic_regression);
  renderChips("nn-metrics", data.neural_network);
}

function renderChips(containerId, metrics) {
  if (!metrics) return;
  const el = document.getElementById(containerId);
  if (!el) return;
  const keys = [
    { k:"accuracy",  label:"Accuracy"  },
    { k:"precision", label:"Precision" },
    { k:"recall",    label:"Recall"    },
    { k:"f1",        label:"F1-Score"  },
  ];
  const getMetricValue = (metrics, key) => {
    if (!metrics) return 0;
    return metrics[key] ?? metrics[`${key}_score`] ?? 0;
  };

  el.innerHTML = keys.map(({ k, label }) => `
    <div class="m-chip">
      <span class="m-chip-val">${(getMetricValue(metrics, k) * 100).toFixed(1)}%</span>
      <span class="m-chip-name">${label}</span>
    </div>
  `).join("");
}

// ══════════════════════════════════════════════════════════════════════════════
// TOGGLE DE MODELO
// ══════════════════════════════════════════════════════════════════════════════
function initToggleGroups() {
  // Individual
  document.querySelectorAll("#model-toggle .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#model-toggle .toggle-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedModel = btn.dataset.model;
    });
  });
  // Batch
  document.querySelectorAll("#model-toggle-batch .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#model-toggle-batch .toggle-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedModelBatch = btn.dataset.model;
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// PREDICCIÓN INDIVIDUAL
// ══════════════════════════════════════════════════════════════════════════════
function initForm() {
  const wrapper = document.getElementById("form-fields");
  if (!featureNames.length) {
    wrapper.innerHTML = '<p class="loading-text">Sin features cargadas.</p>';
    return;
  }

  // Valores ejemplo de una muestra benigna del dataset
  const exampleValues = {
    mean_radius:13.54, mean_texture:14.36, mean_perimeter:87.46, mean_area:566.3,
    mean_smoothness:0.09779, mean_compactness:0.08129, mean_concavity:0.06664,
    mean_concave_points:0.04781, mean_symmetry:0.1885, mean_fractal_dimension:0.05766,
    radius_error:0.2699, texture_error:0.7886, perimeter_error:2.058,
    area_error:23.56, smoothness_error:0.008462, compactness_error:0.0146,
    concavity_error:0.02387, concave_points_error:0.01315,
    symmetry_error:0.0198, fractal_dimension_error:0.0023,
    worst_radius:15.11, worst_texture:19.26, worst_perimeter:99.7,
    worst_area:711.2, worst_smoothness:0.144, worst_compactness:0.1773,
    worst_concavity:0.239, worst_concave_points:0.1288,
    worst_symmetry:0.2977, worst_fractal_dimension:0.07259,
  };

  wrapper.innerHTML = featureNames.map(f => `
    <div class="field-group">
      <label for="field-${f}">${f.replace(/_/g, " ")}</label>
      <input type="number" id="field-${f}" name="${f}"
             step="any" placeholder="0.000"
             value="${exampleValues[f] ?? ""}">
    </div>
  `).join("");

  document.getElementById("predict-form").addEventListener("submit", onPredictSingle);
  const randomBtn = document.getElementById("btn-randomize");
  if (randomBtn) randomBtn.addEventListener("click", randomizeIndividualFeatures);
}

async function onPredictSingle(e) {
  e.preventDefault();
  const resultBox = document.getElementById("result-individual");
  resultBox.classList.add("hidden");

  const features = {};
  featureNames.forEach(f => {
    const el = document.getElementById(`field-${f}`);
    features[f] = el ? parseFloat(el.value) || 0 : 0;
  });

  const btn = document.getElementById("btn-predict");
  btn.disabled = true;
  btn.textContent = "Prediciendo…";

  try {
    const res  = await fetch(`${API}/predict`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ model: selectedModel, features }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderIndividualResult(data, resultBox);
  } catch (err) {
    resultBox.className = "result-box";
    resultBox.innerHTML = `<div class="error-msg">❌ Error: ${err.message}<br><small>Asegúrate de que el backend esté corriendo en http://localhost:5000</small></div>`;
    resultBox.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">⚡</span> Predecir';
  }
}

function renderIndividualResult(data, box) {
  const isBenign = data.prediction === 1;
  const emoji    = isBenign ? "🟢" : "🔴";
  const cls      = isBenign ? "benign" : "malign";
  const label    = data.label;
  const pMaligno = (data.probability_malignant * 100).toFixed(1);
  const pBenigno = (data.probability_benign    * 100).toFixed(1);
  const modelLabel = data.model === "neural_network" ? "Red Neuronal" : "Regresión Logística";

  box.className = `result-box ${cls}`;
  box.innerHTML = `
    <div class="result-emoji">${emoji}</div>
    <div class="result-label ${cls}">${label}</div>
    <div class="result-sub">Modelo: <strong>${modelLabel}</strong></div>
    <div class="proba-bars">
      <div class="proba-row">
        <span class="proba-name">Maligno</span>
        <div class="proba-track">
          <div class="proba-fill fill-red" style="width:${pMaligno}%"></div>
        </div>
        <span class="proba-pct">${pMaligno}%</span>
      </div>
      <div class="proba-row">
        <span class="proba-name">Benigno</span>
        <div class="proba-track">
          <div class="proba-fill fill-green" style="width:${pBenigno}%"></div>
        </div>
        <span class="proba-pct">${pBenigno}%</span>
      </div>
    </div>
  `;
  box.classList.remove("hidden");
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ══════════════════════════════════════════════════════════════════════════════
// PREDICCIÓN POR LOTE
// ══════════════════════════════════════════════════════════════════════════════
function initBatch() {
  const zone   = document.getElementById("upload-zone");
  const input  = document.getElementById("csv-file");
  const btnPred= document.getElementById("btn-batch-predict");
  const btnDL  = document.getElementById("btn-download-sample");

  // Drag & drop
  zone.addEventListener("dragover",  e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", ()  => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    if (e.dataTransfer.files[0]) {
      input.files = e.dataTransfer.files;
      showFilename(e.dataTransfer.files[0].name);
    }
  });

  input.addEventListener("change", () => {
    if (input.files[0]) showFilename(input.files[0].name);
  });

  btnPred.addEventListener("click", onBatchPredict);
  btnDL.addEventListener("click", downloadSampleCSV);
}

function showFilename(name) {
  const zone = document.getElementById("upload-zone");
  let fn = zone.querySelector(".upload-filename");
  if (!fn) {
    fn = document.createElement("p");
    fn.className = "upload-filename";
    zone.appendChild(fn);
  }
  fn.textContent = `📄 ${name}`;
}

async function onBatchPredict() {
  const input = document.getElementById("csv-file");
  if (!input.files[0]) {
    alert("Por favor selecciona un archivo CSV primero.");
    return;
  }

  const btn = document.getElementById("btn-batch-predict");
  btn.disabled = true;
  btn.textContent = "Procesando…";

  const formData = new FormData();
  formData.append("file",  input.files[0]);
  formData.append("model", selectedModelBatch);

  try {
    const res  = await fetch(`${API}/predict-batch`, { method: "POST", body: formData });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderBatchResults(data);
  } catch (err) {
    document.getElementById("result-batch").innerHTML =
      `<div class="error-msg">❌ Error: ${err.message}</div>`;
    document.getElementById("result-batch").classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">⚡</span> Predecir Lote';
  }
}

function renderBatchResults(data) {
  const resultDiv    = document.getElementById("result-batch");
  const metricsBox   = document.getElementById("batch-metrics-box");
  const tableWrap    = document.getElementById("batch-table-wrap");

  resultDiv.classList.remove("hidden");

  // Métricas globales (si hay target en el CSV)
  if (data.batch_metrics) {
    const m = data.batch_metrics;
    metricsBox.classList.remove("hidden");
    metricsBox.innerHTML = `
      <h3>Métricas del Lote</h3>
      <div class="chip-row">
        <div class="chip chip-blue">
          <span class="chip-label">Accuracy</span>
          <span>${(m.accuracy  * 100).toFixed(2)}%</span>
        </div>
        <div class="chip chip-green">
          <span class="chip-label">Precision</span>
          <span>${(m.precision * 100).toFixed(2)}%</span>
        </div>
        <div class="chip chip-purple">
          <span class="chip-label">Recall</span>
          <span>${(m.recall    * 100).toFixed(2)}%</span>
        </div>
        <div class="chip chip-blue">
          <span class="chip-label">F1-Score</span>
          <span>${(m.f1        * 100).toFixed(2)}%</span>
        </div>
      </div>
      ${m.cm_image
        ? `<div class="cm-wrap"><img src="${m.cm_image}?t=${Date.now()}" class="cm-img" alt="Matriz de confusión (lote)"><p class="cm-label">Matriz de Confusión — Lote</p></div>`
        : ""}
    `;
  } else {
    metricsBox.classList.add("hidden");
  }

  // Tabla de predicciones (máx 200 filas para performance)
  const rows  = data.predictions.slice(0, 200);
  const model = data.model === "neural_network" ? "Red Neuronal" : "Regresión Logística";
  const total = data.predictions.length;
  const benignCount  = data.predictions.filter(r => r.prediction === 1).length;
  const malignCount  = total - benignCount;

  tableWrap.innerHTML = `
    <div style="padding:12px 16px;background:var(--surface-2);border-bottom:1px solid var(--border);font-size:13px;display:flex;gap:20px;align-items:center;">
      <span>Modelo: <strong>${model}</strong></span>
      <span>Total: <strong>${total}</strong></span>
      <span style="color:var(--green)">Benignos: <strong>${benignCount}</strong></span>
      <span style="color:var(--red)">Malignos: <strong>${malignCount}</strong></span>
      ${total > 200 ? `<span style="color:var(--text-light);font-size:12px;">(Mostrando primeras 200 filas)</span>` : ""}
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Resultado</th>
          <th>P(Maligno)</th>
          <th>P(Benigno)</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${r.index + 1}</td>
            <td><span class="badge ${r.prediction === 1 ? 'badge-benigno' : 'badge-maligno'}">${r.label}</span></td>
            <td>${(r.probability_malignant * 100).toFixed(1)}%</td>
            <td>${(r.probability_benign    * 100).toFixed(1)}%</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ── Descargar CSV de ejemplo ──────────────────────────────────────────────────
function downloadSampleCSV() {
  const headers = featureNames.join(",");
  // 5 filas de ejemplo con valores típicos del dataset
  const rows = [
    "17.99,10.38,122.8,1001,0.1184,0.2776,0.3001,0.1471,0.2419,0.07871,1.095,0.9053,8.589,153.4,0.006399,0.04904,0.05373,0.01587,0.03003,0.006193,25.38,17.33,184.6,2019,0.1622,0.6656,0.7119,0.2654,0.4601,0.1189",
    "20.57,17.77,132.9,1326,0.08474,0.07864,0.0869,0.07017,0.1812,0.05667,0.5435,0.7339,3.398,74.08,0.005225,0.01308,0.0186,0.0134,0.01389,0.003532,24.99,23.41,158.8,1956,0.1238,0.1866,0.2416,0.186,0.275,0.08902",
    "19.69,21.25,130,1203,0.1096,0.1599,0.1974,0.1279,0.2069,0.05999,0.7456,0.7869,4.585,94.03,0.00615,0.04006,0.03832,0.02058,0.0225,0.004571,23.57,25.53,152.5,1709,0.1444,0.4245,0.4504,0.243,0.3613,0.08758",
    "11.42,20.38,77.58,386.1,0.1425,0.2839,0.2414,0.1052,0.2597,0.09744,0.4956,1.156,3.445,27.23,0.00911,0.07458,0.05661,0.01867,0.05963,0.009208,14.91,26.5,98.87,567.7,0.2098,0.8663,0.6869,0.2575,0.6638,0.173",
    "12.45,15.7,82.57,477.1,0.1278,0.17,0.1578,0.08089,0.2087,0.07613,0.3345,0.8902,2.217,27.19,0.00751,0.03345,0.03672,0.01137,0.02165,0.005082,15.47,23.75,103.4,741.6,0.1791,0.5249,0.5355,0.1741,0.3985,0.1244",
  ];
  // Añadir columna target (para que se calculen métricas)
  const csvContent = "target," + headers + "\n" +
    rows.map((r, i) => `${i % 2},${r}`).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = "muestra_breast_cancer.csv";
  a.click();
}
