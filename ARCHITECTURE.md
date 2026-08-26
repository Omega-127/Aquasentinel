# AquaSentinel - System Architecture Document

**Submitted to:** Smart India Hackathon (SIH) 2026

## 1. System Overview

AquaSentinel is an AI/ML-powered early warning and inundation prediction platform that integrates multi-source environmental data to predict heavy rainfall events and identify flood-prone areas. The system follows a modular, layered architecture with clear separation of concerns.

```
DATA SOURCES
    ↓
DATA INGESTION & PREPROCESSING
    ↓
FEATURE ENGINEERING & DATA FUSION
    ↓
ML/AI MODELS (Rainfall + Inundation)
    ↓
RISK ENGINE & ALERT ENGINE
    ↓
BACKEND API
    ↓
FRONTEND DASHBOARD & VISUALIZATION
```

---

## 2. Frontend Architecture

### 2.1 Overview
Interactive web-based dashboard for visualizing rainfall forecasts, inundation risks, and early warnings with geospatial visualization capabilities.

### 2.2 Technology Stack

| Component | Technology | Version/Details |
|-----------|-----------|-----------------|
| **Framework** | React | Latest (TypeScript) |
| **Language** | TypeScript | For type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Mapping** | Leaflet / React-Leaflet | Interactive GIS visualization |
| **Charts & Graphs** | Recharts | Time-series and statistical viz |
| **HTTP Client** | Axios / Fetch API | API communication |
| **State Management** | React Context / Redux (optional) | Global state management |
| **Build Tool** | Vite / Create React App | Module bundling |
| **Testing** | Jest / React Testing Library | Unit and integration tests |

### 2.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │   React Router   │  │   Context API    │              │
│  │   (Navigation)   │  │  (State Mgmt)    │              │
│  └──────────────────┘  └──────────────────┘              │
│           ↓                    ↓                          │
│  ┌────────────────────────────────────────┐              │
│  │       COMPONENT HIERARCHY              │              │
│  ├────────────────────────────────────────┤              │
│  │ • Dashboard (Main Container)           │              │
│  │ • RegionSelector (Region Input)        │              │
│  │ • MapContainer (Leaflet Integration)   │              │
│  │ • ForecastPanel (6hr, 24hr forecasts)  │              │
│  │ • AlertCenter (Active Warnings)        │              │
│  │ • RiskGauge (Risk Level Indicator)     │              │
│  │ • MetricsDisplay (Current conditions)  │              │
│  └────────────────────────────────────────┘              │
│           ↓                                               │
│  ┌────────────────────────────────────────┐              │
│  │      VISUALIZATION COMPONENTS          │              │
│  ├────────────────────────────────────────┤              │
│  │ • RainfallLayer (Predicted rainfall)   │              │
│  │ • InundationLayer (Flood risk areas)   │              │
│  │ • CurrentWeatherLayer (Observations)   │              │
│  │ • DrainageLayer (Rivers & drainage)    │              │
│  │ • AdminBoundaries (Region boundaries)  │              │
│  │ • WarningZones (High-risk zones)       │              │
│  └────────────────────────────────────────┘              │
│           ↓                                               │
│  ┌────────────────────────────────────────┐              │
│  │     CHARTING & TIME-SERIES DISPLAY     │              │
│  ├────────────────────────────────────────┤              │
│  │ • RainfallTimeSeries (Recharts)        │              │
│  │ • RiskTrendChart (Risk evolution)      │              │
│  │ • TemperatureHumidityChart             │              │
│  │ • AlertHistory (Past warnings)         │              │
│  └────────────────────────────────────────┘              │
│           ↓                                               │
│  ┌────────────────────────────────────────┐              │
│  │      API SERVICE LAYER (Axios)         │              │
│  ├────────────────────────────────────────┤              │
│  │ • forecastService.ts                   │              │
│  │ • rainfallService.ts                   │              │
│  │ • inundationService.ts                 │              │
│  │ • alertService.ts                      │              │
│  │ • riskService.ts                       │              │
│  └────────────────────────────────────────┘              │
│           ↓                                               │
└─────────────────────────────────────────────────────────────┘
              BACKEND API (FastAPI)
```

### 2.4 Key Features

- **Interactive Map**: Multi-layer Leaflet map with rainfall intensity, inundation probability, and warning zones
- **Dashboard Panels**: Current conditions, forecasts (1h, 3h, 6h, 24h), risk levels
- **Real-time Updates**: WebSocket or polling for live alerts
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Data Visualization**: Recharts for time-series and statistical analysis

### 2.5 Directory Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx
│   │   │   ├── RainfallLayer.tsx
│   │   │   ├── InundationLayer.tsx
│   │   │   └── WarningZones.tsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MetricsDisplay.tsx
│   │   │   ├── ForecastPanel.tsx
│   │   │   └── AlertCenter.tsx
│   │   ├── Controls/
│   │   │   ├── RegionSelector.tsx
│   │   │   └── LayerToggle.tsx
│   │   └── Charts/
│   │       ├── RainfallChart.tsx
│   │       ├── RiskTrendChart.tsx
│   │       └── AlertHistory.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── forecastService.ts
│   │   ├── rainfallService.ts
│   │   ├── inundationService.ts
│   │   └── alertService.ts
│   ├── context/
│   │   ├── MapContext.tsx
│   │   ├── ForecastContext.tsx
│   │   └── AlertContext.tsx
│   ├── hooks/
│   │   ├── useForecast.ts
│   │   ├── useAlerts.ts
│   │   └── useRegion.ts
│   ├── styles/
│   │   ├── tailwind.config.js
│   │   └── global.css
│   ├── types/
│   │   ├── forecast.ts
│   │   ├── inundation.ts
│   │   ├── alert.ts
│   │   └── common.ts
│   └── App.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Backend Architecture

### 3.1 Overview
RESTful API server built with FastAPI that orchestrates data ingestion, model inference, risk calculation, and alert generation.

### 3.2 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | FastAPI | Async REST API server |
| **Runtime** | Python 3.9+ | Core language |
| **ASGI Server** | Uvicorn | Production ASGI server |
| **Database ORM** | SQLAlchemy | Database abstraction layer |
| **Validation** | Pydantic | Request/response validation |
| **Async Support** | AsyncIO / httpx | Non-blocking operations |
| **Logging** | Python logging + ELK | Centralized logging |
| **API Documentation** | Swagger/OpenAPI | Auto-generated docs |
| **Testing** | Pytest | Unit and integration testing |
| **Task Queue** | Celery / APScheduler | Background job scheduling |

### 3.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │           FASTAPI APPLICATION CORE                  │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │                                                      │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │        ROUTE HANDLERS / ENDPOINTS              │ │ │
│  │  ├────────────────────────────────────────────────┤ │ │
│  │  │ GET /forecast         → Forecast Controller   │ │ │
│  │  │ GET /rainfall         → Rainfall Controller   │ │ │
│  │  │ GET /inundation       → Inundation Controller │ │ │
│  │  │ GET /risk             → Risk Controller       │ │ │
│  │  │ GET /alerts           → Alert Controller      │ │ │
│  │  │ POST /predict         → Prediction Endpoint   │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                    ↓                                 │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │          SERVICE LAYER                         │ │ │
│  │  ├────────────────────────────────────────────────┤ │ │
│  │  │ • ForecastService                              │ │ │
│  │  │ • RainfallService                              │ │ │
│  │  │ • InundationService                            │ │ │
│  │  │ • RiskService                                  │ │ │
│  │  │ • AlertService                                 │ │ │
│  │  │ • DataFusionService                            │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                    ↓                                 │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │      BUSINESS LOGIC / ORCHESTRATION            │ │ │
│  │  ├────────────────────────────────────────────────┤ │ │
│  │  │ • PredictionPipeline                           │ │ │
│  │  │ • RiskClassification                           │ │ │
│  │  │ • AlertGeneration                              │ │ │
│  │  │ • DataValidation                               │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                    ↓                                 │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │     DATA ACCESS LAYER (SQLALCHEMY)             │ │ │
│  │  ├────────────────────────────────────────────────┤ │ │
│  │  │ • Models (SQLAlchemy ORM)                      │ │ │
│  │  │ • Repositories (CRUD operations)               │ │ │
│  │  │ • Database Session Management                  │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                    ↓                                     │
│  ┌─────────────────┬─────────────────┬─────────────────┐ │
│  │   PostgreSQL    │  Redis Cache    │  File Storage   │ │
│  │   + PostGIS     │  (Optional)     │  (Model weights)│ │
│  └─────────────────┴─────────────────┴─────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 API Endpoints

```python
# Forecast Endpoints
GET /forecast?region={region_code}&horizon={hours}
    → Returns rainfall forecasts for selected region

# Rainfall Endpoints
GET /rainfall?region={region_code}&limit={records}
    → Returns current and historical rainfall data
POST /rainfall/process
    → Trigger rainfall data processing

# Inundation Endpoints
GET /inundation?region={region_code}
    → Returns inundation probability and spatial risk zones
GET /inundation/zones
    → Returns high-risk zone geometries (GeoJSON)

# Risk Endpoints
GET /risk?region={region_code}
    → Returns aggregated regional risk levels
GET /risk/classification?rainfall={mm}&inundation={prob}
    → Returns risk level based on parameters

# Alert Endpoints
GET /alerts?region={region_code}&status={active|all}
    → Returns active and historical warnings
POST /alerts/acknowledge/{alert_id}
    → Mark alert as acknowledged

# Model Endpoints
GET /model/performance
    → Returns model metrics and confidence scores
POST /model/retrain
    → Trigger model retraining (admin only)
```

### 3.5 Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app initialization
│   ├── config.py                  # Configuration management
│   ├── dependencies.py            # Dependency injection
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── forecast.py        # Forecast routes
│   │   │   ├── rainfall.py        # Rainfall routes
│   │   │   ├── inundation.py      # Inundation routes
│   │   │   ├── risk.py            # Risk routes
│   │   │   └── alerts.py          # Alert routes
│   ├── services/
│   │   ├── __init__.py
│   │   ├── forecast_service.py
│   │   ├── rainfall_service.py
│   │   ├── inundation_service.py
│   │   ├── risk_service.py
│   │   ├── alert_service.py
│   │   └── data_fusion_service.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── forecast.py            # DB models
│   │   ├── rainfall.py
│   │   ├── inundation.py
│   │   ├── alert.py
│   │   └── region.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── forecast.py            # Pydantic schemas
│   │   ├── rainfall.py
│   │   ├── inundation.py
│   │   ├── alert.py
│   │   └── common.py
│   ├── database/
│   │   ├── __init__.py
│   │   ├── session.py             # DB session management
│   │   ├── base.py                # Base model class
│   │   └── connection.py          # Connection pooling
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── rainfall_predictor.py
│   │   ├── inundation_predictor.py
│   │   └── model_loader.py
│   ├── tasks/
│   │   ├── __init__.py
│   │   ├── data_ingestion.py      # Background jobs
│   │   ├── model_inference.py
│   │   └── alert_generation.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py
│   │   ├── validators.py
│   │   └── helpers.py
│   └── middleware/
│       ├── __init__.py
│       ├── error_handler.py
│       └── logging_middleware.py
├── tests/
│   ├── __init__.py
│   ├── test_forecast.py
│   ├── test_rainfall.py
│   └── test_models.py
├── requirements.txt
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 4. ML/AI Pipeline Architecture

### 4.1 Overview
Machine learning pipeline for rainfall and inundation prediction using tree-based and deep learning models.

### 4.2 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **ML Framework** | Scikit-learn | Data preprocessing and utilities |
| **Tree-based Models** | XGBoost + LightGBM | Primary rainfall/inundation models |
| **Deep Learning** | PyTorch | Optional LSTM/ConvLSTM models |
| **Data Processing** | Pandas + NumPy | Tabular data manipulation |
| **Model Persistence** | Pickle / ONNX | Model serialization |
| **Experiment Tracking** | MLflow | Model versioning & tracking |
| **Hyperparameter Tuning** | Optuna / Scikit-optimize | AutoML tuning |
| **Evaluation Metrics** | Scikit-learn | Performance measurement |

### 4.3 ML Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              ML/AI PIPELINE ARCHITECTURE                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: DATA COLLECTION & INGESTION                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • IMD Weather Observations                             │ │
│  │ • INSAT/Sentinel Satellite Imagery                     │ │
│  │ • Weather Radar Data                                   │ │
│  │ • Automatic Weather Stations                           │ │
│  │ • NWP Forecast Data (ERA5, GFS)                        │ │
│  │ • SRTM DEM Elevation Data                              │ │
│  │ • Historical Rainfall Records                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 2: DATA PREPROCESSING                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Missing Value Imputation                             │ │
│  │ • Outlier Detection & Handling                         │ │
│  │ • Duplicate Removal                                    │ │
│  │ • Temporal Alignment (Same time grid)                  │ │
│  │ • Spatial Interpolation (For sparse stations)          │ │
│  │ • Data Quality Checks                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 3: FEATURE ENGINEERING                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ RAINFALL FEATURES:                                      │ │
│  │  • Cumulative rainfall (1h, 3h, 6h, 24h)               │ │
│  │  • Rainfall rate (change rate)                         │ │
│  │  • Lagged rainfall (t-1, t-2, t-3 hours)               │ │
│  │  • Atmospheric features (temp, humidity, pressure)    │ │
│  │  • Wind components (u, v)                              │ │
│  │  • Wind speed & direction                              │ │
│  │                                                        │ │
│  │ INUNDATION FEATURES:                                    │ │
│  │  • Predicted rainfall                                  │ │
│  │  • Cumulative rainfall                                 │ │
│  │  • Elevation (DEM)                                     │ │
│  │  • Slope & aspect                                      │ │
│  │  • Distance to rivers/drainage                         │ │
│  │  • Land-use / imperviousness index                     │ │
│  │  • Historical flood/inundation records                 │ │
│  │  • Drainage network density                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 4: DATA FUSION & NORMALIZATION                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Standardization (StandardScaler)                     │ │
│  │ • Spatial grid alignment (Rasterio)                    │ │
│  │ • Multi-source data merging                            │ │
│  │ • Train-validation-test split                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 5: MODEL TRAINING                                    │
│  ┌──────────────────────┬──────────────────────────────────┐ │
│  │  RAINFALL MODEL      │  INUNDATION MODEL                │ │
│  ├──────────────────────┼──────────────────────────────────┤ │
│  │ Primary: XGBoost     │ Primary: XGBoost                 │ │
│  │ Backup: LightGBM     │ Backup: LightGBM                │ │
│  │ Optional: LSTM       │ Features: Rainfall + Terrain     │ │
│  │                      │                                  │ │
│  │ Hyperparameters:     │ Hyperparameters:                 │ │
│  │ • max_depth          │ • max_depth                      │ │
│  │ • learning_rate      │ • learning_rate                  │ │
│  │ • n_estimators       │ • subsample                      │ │
│  │ • subsample          │ • colsample_bytree               │ │
│  │ • colsample_bytree   │                                  │ │
│  └──────────────────────┴──────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 6: MODEL EVALUATION                                  │
│  ┌──────────────────────┬──────────────────────────────────┐ │
│  │  RAINFALL METRICS    │  INUNDATION METRICS              │ │
│  ├──────────────────────┼──────────────────────────────────┤ │
│  │ • MAE (Mean Abs Err) │ • Precision & Recall             │ │
│  │ • RMSE               │ • F1-Score                       │ │
│  │ • R² Score           │ • ROC-AUC                        │ │
│  │ • MAPE               │ • Spatial IoU                    │ │
│  │ • Event Detection    │ • Confusion Matrix               │ │
│  │   Metrics            │ • False Alarm Rate               │ │
│  │                      │ • Missed Event Rate              │ │
│  └──────────────────────┴──────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 7: MODEL OPTIMIZATION & HYPERTUNING                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Optuna / Hyperopt for hyperparameter search          │ │
│  │ • Cross-validation (K-fold)                            │ │
│  │ • Feature importance analysis                          │ │
│  │ • Ensemble methods (Stacking, Blending)                │ │
│  └────────────────────────────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 8: MODEL SERIALIZATION & VERSIONING                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Save as .pkl / ONNX format                           │ │
│  │ • MLflow model registry                                │ │
│  │ • Version tracking & metadata                          │ │
│  │ • Production model deployment                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 9: INFERENCE & PREDICTION                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Real-time rainfall forecasting                       │ │
│  │ • Inundation probability calculation                   │ │
│  │ • Confidence/uncertainty quantification                │ │
│  │ • Batch processing for large regions                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                        ↓                                     │
│  STEP 10: RISK CLASSIFICATION & ALERTS                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Risk Thresholds:                                       │ │
│  │ • Low: Minimal rainfall/inundation                     │ │
│  │ • Moderate: Increasing rainfall/localized risk        │ │
│  │ • High: Heavy rainfall/significant inundation          │ │
│  │ • Severe: Extreme rainfall/high inundation prob        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.4 Directory Structure

```
ml/
├── __init__.py
├── config.py                      # ML config & constants
├── data/
│   ├── __init__.py
│   ├── loaders.py                # Data loading functions
│   ├── preprocessors.py          # Data cleaning & preprocessing
│   ├── feature_engineers.py      # Feature creation
│   └── data_fusion.py            # Multi-source data fusion
├── models/
│   ├── __init__.py
│   ├── rainfall_model.py         # Rainfall predictor class
│   ├── inundation_model.py       # Inundation predictor class
│   ├── ensemble.py               # Ensemble methods
│   └── model_loader.py           # Load trained models
├── training/
│   ├── __init__.py
│   ├── trainer.py                # Training orchestrator
│   ├── hyperparameters.py        # Hyperparameter configs
│   ├── evaluation.py             # Metrics & evaluation
│   └── callbacks.py              # Training callbacks
├── inference/
│   ├── __init__.py
│   ├── predictor.py              # Batch inference
│   ├── postprocessor.py          # Output processing
│   └── confidence.py             # Uncertainty quantification
├── validation/
│   ├── __init__.py
│   ├── validators.py             # Input validation
│   └── sanitizers.py             # Data sanitization
├── experiments/
│   ├── baseline.py               # Baseline model
│   ├── xgboost_tuning.py         # XGBoost experiments
│   ├── lightgbm_tuning.py        # LightGBM experiments
│   └── lstm_model.py             # Optional LSTM
├── notebooks/
│   ├── 01_eda.ipynb              # Exploratory data analysis
│   ├── 02_feature_engineering.ipynb
│   ├── 03_model_training.ipynb
│   └── 04_evaluation.ipynb
├── scripts/
│   ├── download_data.py
│   ├── train_models.py
│   ├── evaluate_models.py
│   └── export_models.py
├── models_trained/               # Trained model files
│   ├── rainfall_xgboost.pkl
│   ├── inundation_xgboost.pkl
│   └── model_metadata.json
└── tests/
    ├── test_preprocessing.py
    ├── test_feature_engineering.py
    └── test_inference.py
```

### 4.5 Model Configuration Example

```yaml
# ml/config.py - Model hyperparameters

RAINFALL_MODEL_CONFIG:
  model_type: "xgboost"
  hyperparameters:
    max_depth: 8
    learning_rate: 0.1
    n_estimators: 200
    subsample: 0.8
    colsample_bytree: 0.8
    gamma: 1
  objective: "reg:squarederror"
  eval_metric: ["mae", "rmse"]

INUNDATION_MODEL_CONFIG:
  model_type: "xgboost"
  hyperparameters:
    max_depth: 7
    learning_rate: 0.05
    n_estimators: 300
    subsample: 0.75
  objective: "binary:logistic"
  eval_metric: ["auc", "logloss"]

LSTM_CONFIG:
  input_shape: (24, 50)  # 24 timesteps, 50 features
  lstm_units: 128
  dropout: 0.2
  dense_units: 64
  output_dim: 1
```

---

## 5. Data Pipeline Architecture

### 5.1 Overview
Automated data ingestion, preprocessing, and feature engineering from multiple sources.

### 5.2 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Data Processing** | Pandas + NumPy | Tabular data manipulation |
| **Geospatial** | GeoPandas + Rasterio | GIS operations |
| **Spatial Transform** | PyProj | Coordinate transformations |
| **Data Validation** | Pandera + Great Expectations | Data quality checks |
| **Scheduling** | APScheduler / Airflow (future) | Workflow orchestration |
| **Caching** | Redis (optional) | Data caching for performance |

### 5.3 Data Flow

```
DATA SOURCES
├── IMD Weather Observations
├── INSAT Satellite (via ISRO/MOSDAC)
├── Sentinel Satellite (via Copernicus)
├── NASA GPM Precipitation
├── ERA5 Reanalysis
├── Weather Radar (MAUSAM)
└── SRTM DEM

         ↓
    ┌────────────────────┐
    │ INGESTION LAYER    │
    ├────────────────────┤
    │ • API Clients      │
    │ • File Readers     │
    │ • Stream Handlers  │
    └────────────────────┘
         ↓
    ┌────────────────────┐
    │ STORAGE LAYER      │
    ├────────────────────┤
    │ PostgreSQL + Files │
    │ (Raw Data Archive) │
    └────────────────────┘
         ↓
    ┌────────────────────┐
    │ PREPROCESSING      │
    ├────────────────────┤
    │ • Cleaning         │
    │ • Outlier Removal  │
    │ • Interpolation    │
    │ • Alignment        │
    └────────────────────┘
         ↓
    ┌────────────────────┐
    │ FEATURE ENG.       │
    ├────────────────────┤
    │ • Derived Features │
    │ • Aggregations     │
    │ • Normalization    │
    └────────────────────┘
         ↓
    ┌────────────────────┐
    │ ML PIPELINE        │
    ├────────────────────┤
    │ • Model Inference  │
    │ • Predictions      │
    └────────────────────┘
         ↓
    ┌────────────────────┐
    │ OUTPUT STORAGE     │
    ├────────────────────┤
    │ PostgreSQL + Cache │
    │ (Results Archive)  │
    └────────────────────┘
```

### 5.4 Data Sources Configuration

```python
# Data source specifications
DATA_SOURCES = {
    "IMD": {
        "type": "API/FTP",
        "frequency": "hourly",
        "variables": ["rainfall", "temp", "humidity", "pressure", "wind"],
        "regions": ["all_india"],
    },
    "INSAT": {
        "type": "Satellite",
        "frequency": "30min",
        "resolution": "4km",
        "products": ["TIR", "VIS", "rainfall_estimate"],
    },
    "ERA5": {
        "type": "Reanalysis",
        "frequency": "hourly",
        "resolution": "0.25°",
        "variables": ["precip", "wind", "temp", "humidity"],
    },
    "SRTM_DEM": {
        "type": "Static Raster",
        "resolution": "30m",
        "format": "GeoTIFF",
    },
}
```

---

## 6. Database Architecture

### 6.1 Overview
PostgreSQL database with PostGIS extension for spatial data management.

### 6.2 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Primary DB** | PostgreSQL 13+ | Relational data storage |
| **Spatial Extension** | PostGIS 3+ | Geospatial operations |
| **ORM** | SQLAlchemy | Database abstraction |
| **Connection Pool** | pgBouncer (optional) | Connection pooling |
| **Backup** | pg_dump / Automated backups | Data persistence |

### 6.3 Database Schema

```sql
-- Core Tables

-- Regions
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    geometry GEOMETRY(POLYGON, 4326),
    center GEOMETRY(POINT, 4326),
    metadata JSONB
);

-- Rainfall Data
CREATE TABLE rainfall_observations (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    timestamp TIMESTAMP NOT NULL,
    rainfall_mm DECIMAL(10, 2),
    source VARCHAR(100),
    confidence DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_region_timestamp (region_id, timestamp)
);

-- Rainfall Forecasts
CREATE TABLE rainfall_forecasts (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    forecast_time TIMESTAMP NOT NULL,
    forecast_horizon_hours INTEGER,
    predicted_rainfall_mm DECIMAL(10, 2),
    confidence DECIMAL(3, 2),
    model_version VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inundation Predictions
CREATE TABLE inundation_predictions (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    prediction_time TIMESTAMP NOT NULL,
    inundation_probability DECIMAL(3, 2),
    affected_area GEOMETRY(POLYGON, 4326),
    severity_level VARCHAR(50),
    model_version VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Classification
CREATE TABLE risk_classifications (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    classification_time TIMESTAMP NOT NULL,
    risk_level VARCHAR(50) CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'SEVERE')),
    rainfall_risk DECIMAL(3, 2),
    inundation_risk DECIMAL(3, 2),
    confidence DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    alert_type VARCHAR(100),
    risk_level VARCHAR(50),
    predicted_rainfall_mm DECIMAL(10, 2),
    inundation_probability DECIMAL(3, 2),
    warning_lead_time_minutes INTEGER,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    issued_at TIMESTAMP NOT NULL,
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather Stations
CREATE TABLE weather_stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    code VARCHAR(50),
    location GEOMETRY(POINT, 4326),
    region_id INTEGER REFERENCES regions(id),
    active BOOLEAN DEFAULT TRUE
);

-- Model Metadata
CREATE TABLE model_metadata (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100),
    model_type VARCHAR(50),
    version VARCHAR(100),
    train_date TIMESTAMP,
    metrics JSONB,
    hyperparameters JSONB,
    feature_list JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices
CREATE INDEX idx_rainfall_obs_time ON rainfall_observations(timestamp);
CREATE INDEX idx_rainfall_forecast_time ON rainfall_forecasts(forecast_time);
CREATE INDEX idx_inundation_pred_time ON inundation_predictions(prediction_time);
CREATE INDEX idx_alerts_issued ON alerts(issued_at);
CREATE SPATIAL INDEX idx_regions_geom ON regions USING GIST(geometry);
```

---

## 7. Geospatial Processing Architecture

### 7.1 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Vector Processing** | GeoPandas | Shapefile, GeoJSON handling |
| **Raster Processing** | Rasterio | GIS raster operations |
| **Coordinate Systems** | PyProj | CRS transformations |
| **Spatial Analysis** | Shapely | Geometry operations |
| **QGIS Support** | QGIS Python API | GIS workflow integration |

### 7.2 Spatial Data Processing Pipeline

```
VECTOR DATA (Boundaries, Rivers)
        ↓
GeoPandas (Read Shapefiles/GeoJSON)
        ↓
    Spatial Joins & Operations
        ↓
PostGIS Storage (Geometry columns)

RASTER DATA (DEM, Satellite)
        ↓
Rasterio (Read GeoTIFF)
        ↓
    Resampling, Reprojection, Masking
        ↓
NumPy Array Operations
        ↓
PostGIS Raster Storage (Optional)

COORDINATE SYSTEMS
        ↓
PyProj (Transform between EPSG codes)
    (EPSG:4326 ↔ EPSG:32643 [UTM43N])
        ↓
Consistent spatial reference across system
```

---

## 8. Deployment Architecture

### 8.1 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Application packaging |
| **Container Orchestration** | Docker Compose (dev) / Kubernetes (prod) | Container management |
| **Frontend Hosting** | Vercel | React app deployment |
| **Backend Hosting** | Render / Railway / AWS | FastAPI deployment |
| **Database Hosting** | Supabase / AWS RDS | PostgreSQL hosting |
| **Storage** | AWS S3 / GCS | Model weights, archives |
| **CI/CD** | GitHub Actions | Automated testing & deployment |

### 8.2 Deployment Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         VERSION CONTROL & CI/CD                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ GitHub Repository                                    │  │
│  │   ├── GitHub Actions (Automated Tests)               │  │
│  │   ├── Pre-deployment Checks                          │  │
│  │   └── Auto-deploy on Push to main                    │  │
│  └──────────────────────────────────────────────────────┘  │
│           ↓                                                 │
│  ┌──────────────┬─────────────┬──────────────────────────┐ │
│  │  FRONTEND    │  BACKEND    │  DATABASE               │ │
│  ├──────────────┼─────────────┼──────────────────────────┤ │
│  │              │             │                          │ │
│  │ Vercel       │ Render/     │ Supabase/               │ │
│  │ ┌──────────┐ │ Railway     │ AWS RDS                │ │
│  │ │React App │ │ ┌─────────┐ │ ┌──────────────────┐   │ │
│  │ │built from│ │ │FastAPI  │ │ │PostgreSQL + GIS │   │ │
│  │ │source    │ │ │+ Uvicorn│ │ │(PostGIS)         │   │ │
│  │ │via npm   │ │ │Docker   │ │ │Automated Backups │   │ │
│  │ │build     │ │ │Container│ │ └──────────────────┘   │ │
│  │ └──────────┘ │ └─────────┘ │                          │ │
│  │              │             │                          │ │
│  │ CDN for      │ API Key     │ Connection pooling      │ │
│  │ static assets│ authentication                         │ │
│  └──────────────┴─────────────┴──────────────────────────┘ │
│           ↓                    ↓                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         ADDITIONAL SERVICES                        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ • Redis Cache (Optional, for performance)          │   │
│  │ • AWS S3 / GCS (Model weights, data archives)      │   │
│  │ • SendGrid / Twilio (Alert notifications)          │   │
│  │ • CloudFlare (DNS, DDoS protection)                │   │
│  │ • ELK Stack (Logging & monitoring, optional)       │   │
│  └─────────────────────────────────────────────────────┘   │
│           ↓                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        ENVIRONMENT CONFIGURATION                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Development: Docker Compose (local)                 │  │
│  │ Staging: Render Preview Deploys                     │  │
│  │ Production: Vercel (Frontend) + Render (Backend)    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Docker Configuration

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 8.4 Docker Compose (Development)

```yaml
version: '3.8'

services:
  db:
    image: postgis/postgis:13-3.1
    environment:
      POSTGRES_USER: raincast_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: raincast_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://raincast_user:${DB_PASSWORD}@db:5432/raincast_db
      DEBUG: true
    depends_on:
      - db
    volumes:
      - ./backend:/app

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8000
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 9. Integration & Data Flow

### 9.1 End-to-End Data Flow

```
USER ACCESS (Browser)
        ↓
    Frontend (React + Leaflet)
        ↓
    HTTP Requests (Axios)
        ↓
    FastAPI Backend (Endpoints)
        ↓
    ┌─────────────────────────────────────────────┐
    │         Service Layer Orchestration         │
    │  ┌─────────────────────────────────────────┐│
    │  │ 1. Data Validation (Pydantic)           ││
    │  │ 2. Service Selection (ForecastService)  ││
    │  │ 3. ML Model Inference                   ││
    │  │ 4. Risk Classification                  ││
    │  │ 5. Alert Generation                     ││
    │  └─────────────────────────────────────────┘│
    └─────────────────────────────────────────────┘
        ↓
    Database Query (SQLAlchemy)
        ↓
    PostgreSQL + PostGIS
        ↓
    Response Formation (Pydantic Schema)
        ↓
    JSON Response (HTTP)
        ↓
    Frontend (React Component Update)
        ↓
    Leaflet Map Refresh + Chart Update
        ↓
    USER SEES FORECAST & ALERTS
```

### 9.2 Real-time Alert Flow

```
BACKGROUND JOB (APScheduler)
        ↓
    Periodic Prediction Task
        ↓
    Fetch Latest Data from DB
        ↓
    Run ML Inference
        ↓
    Compare Against Thresholds
        ↓
    Risk Level > MODERATE?
        ├─ YES → Alert Generation
        │        └─ Store in DB
        │           └─ Send Notification
        │              (Email, SMS, WebSocket)
        └─ NO → Continue Monitoring
```

---

## 10. Security Architecture

### 10.1 Security Layers

```
┌──────────────────────────────────────────────────────┐
│            SECURITY ARCHITECTURE                     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. FRONTEND SECURITY                               │
│     • HTTPS only                                    │
│     • CORS policies (restrict origins)              │
│     • XSS protection (CSP headers)                  │
│     • Input validation (client-side)                │
│                                                      │
│  2. BACKEND SECURITY                                │
│     • API Key authentication (optional)             │
│     • JWT tokens (for future user system)          │
│     • Input validation (Pydantic)                   │
│     • Rate limiting (SlowAPI)                       │
│     • SQL injection prevention (ORM)                │
│     • Secure headers (HSTS, X-Frame-Options)       │
│                                                      │
│  3. DATABASE SECURITY                               │
│     • Connection encryption (SSL/TLS)               │
│     • Parameterized queries (SQLAlchemy ORM)        │
│     • Row-level security (PostGIS)                  │
│     • Backup encryption                             │
│     • Access controls (roles & permissions)         │
│                                                      │
│  4. DATA SECURITY                                   │
│     • Data in transit: HTTPS/TLS                   │
│     • Data at rest: Encrypted backups              │
│     • Sensitive data handling                       │
│     • GDPR compliance (if applicable)               │
│                                                      │
│  5. DEPLOYMENT SECURITY                             │
│     • Environment variables (.env)                  │
│     • Secrets management                            │
│     • Regular dependency updates                    │
│     • Container image scanning                      │
│     • Minimal Docker images (Alpine base)           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 11. Monitoring & Observability

### 11.1 Monitoring Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Logging** | Python logging + ELK | Centralized log collection |
| **Metrics** | Prometheus (optional) | Performance monitoring |
| **Tracing** | Jaeger (optional) | Distributed tracing |
| **Alerts** | Alertmanager | Alert notifications |
| **Dashboards** | Grafana | Visualization |

### 11.2 Key Metrics to Monitor

```
APPLICATION METRICS:
- API response time (p50, p95, p99)
- Request error rate
- Database query latency
- Model inference time
- False alarm rate (alerts)
- Missed event rate (forecasts)

DATA METRICS:
- Data ingestion lag
- Missing data rate
- Data quality scores

ML METRICS:
- Model accuracy (MAE, RMSE, R²)
- Model drift detection
- Prediction confidence distribution

INFRASTRUCTURE:
- CPU, memory, disk usage
- Database connection pool
- Cache hit rate
- Deployment health status
```

---

## 12. Technology Summary Table

| Layer | Primary Tech | Backup/Optional | Purpose |
|-------|-------------|-----------------|---------|
| Frontend | React + TypeScript | Vue.js | Web interface |
| Mapping | Leaflet + React-Leaflet | Mapbox | GIS visualization |
| Charting | Recharts | Chart.js, Plotly | Data visualization |
| Backend | FastAPI | Django, Flask | REST API |
| Database | PostgreSQL + PostGIS | PostGIS | Spatial data |
| ML Models | XGBoost + LightGBM | PyTorch (LSTM) | Predictions |
| Data Processing | Pandas + NumPy | Dask | Tabular & array |
| Geospatial | GeoPandas + Rasterio | GDAL, PyProj | GIS operations |
| Deployment | Docker + Vercel/Render | Kubernetes | Containerization |
| ML Tracking | MLflow | Weights & Biases | Experiment tracking |
| Async Tasks | APScheduler | Celery | Background jobs |

---

## 13. Development Workflow

### 13.1 Local Development Setup

```bash
# Clone repository
git clone https://github.com/raincast/raincast.git
cd raincast

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
python -m pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Start dev servers
# Terminal 1: Backend
cd backend && python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: Database (Docker)
docker-compose up db redis
```

### 13.2 Git Workflow

```
main (production)
  ↑
  └─ staging (pre-release)
      ↑
      └─ develop (integration branch)
          ↑
          └─ feature/rainfall-model (feature branches)
          └─ bugfix/alert-threshold (bugfix branches)
          └─ ml/lstm-implementation (ML experiments)
```

---

## 14. Future Architecture Enhancements

1. **Microservices Migration**: Break monolithic backend into independent microservices
2. **Real-time Processing**: Kafka + Apache Flink for stream processing
3. **Advanced ML Models**: ConvLSTM, Transformers for spatio-temporal forecasting
4. **Mobile App**: React Native for iOS/Android
5. **IoT Integration**: Real-time rain-gauge and sensor data
6. **Physics-informed ML**: Hybrid physics + data-driven models
7. **Kubernetes Deployment**: Auto-scaling and high availability
8. **GraphQL API**: Alternative to REST for frontend
9. **Advanced Analytics**: Duckdb or ClickHouse for OLAP queries

---

## 15. Key Contact Points & Dependencies

- **Data Sources**: IMD, ISRO/MOSDAC, Copernicus, NASA
- **Cloud Providers**: Render (backend), Vercel (frontend), Supabase (database)
- **Libraries**: XGBoost, LightGBM, PyTorch, FastAPI, React, Leaflet
- **Infrastructure**: Docker, GitHub, PostgreSQL

---

**Document Version**: 1.0  
**Last Updated**: 2026-08-26  
**Project**: AquaSentinel (SIH 2026)
