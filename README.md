# 💧 AquaSentinel

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python 3.9+](https://img.shields.io/badge/python-3.9%2B-blue)](https://www.python.org/downloads/)
[![Node.js 16+](https://img.shields.io/badge/node-16%2B-green)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.95%2B-009485.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/react-18%2B-61dafb.svg)](https://react.dev/)
[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://www.sih.gov.in/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

**AquaSentinel** is an AI/ML-powered early warning and inundation prediction platform that combines satellite imagery, weather radar data, numerical weather prediction, and geospatial information to predict heavy rainfall events and identify flood-prone areas with location-specific accuracy.

**Submitted to:** Smart India Hackathon (SIH) 2026

> **Transform broad weather forecasts into actionable location-specific disaster intelligence.**

---

## 🎯 Problem Statement

Heavy rainfall can cause flash floods and urban inundation within hours. Conventional regional weather forecasts often lack:
- **Location-specific information** about where severe rainfall will occur
- **Granular inundation prediction** for vulnerable neighborhoods
- **Sufficient warning time** for evacuation and resource deployment
- **Interactive visualization** of spatial risk distribution

**AquaSentinel solves this** by fusing multiple environmental data sources into an integrated platform that delivers location-specific risk levels and early warnings.

---

## ✨ Key Features

### 🔮 Rainfall Prediction
- **Multi-source data fusion**: Satellite, radar, weather stations, NWP data
- **Accurate forecasting**: XGBoost/LightGBM models with MAE, RMSE, R² metrics
- **Multiple horizons**: 1-hour, 3-hour, 6-hour, and 24-hour forecasts
- **Event detection**: Identifies heavy rainfall events (>50mm/6hr)

### 🚨 Inundation Prediction
- **Spatial flood risk**: Estimates water accumulation in vulnerable zones
- **Terrain-aware**: Incorporates elevation, slope, drainage proximity
- **Land-use integration**: Considers imperviousness and urban infrastructure
- **Probability quantification**: ROC-AUC based risk scoring

### 📍 Interactive Risk Mapping
- **Multi-layer visualization**: Rainfall intensity, inundation probability, warning zones
- **Real-time updates**: Live map refresh with latest predictions
- **Geospatial overlays**: Rivers, drainage, administrative boundaries, weather stations
- **Responsive design**: Works seamlessly on desktop and mobile

### ⚠️ Early Warning System
- **Automated alerts**: Threshold-based warnings at LOW, MODERATE, HIGH, SEVERE levels
- **Location-specific**: Identifies exact areas at risk
- **Actionable guidance**: Recommended actions for each alert level
- **Warning lead time**: Estimated hours before rainfall onset

### 📊 Comprehensive Dashboard
- **Current conditions**: Real-time temperature, humidity, pressure, wind
- **Forecast panels**: Visual rainfall predictions (1h, 3h, 6h, 24h)
- **Risk indicators**: Gauge-style risk level display
- **Alert history**: Past warnings and system performance tracking
- **Model confidence**: Transparency in prediction accuracy

---

## 🏗️ Architecture Overview

```
Data Sources (IMD, INSAT, ERA5, DEM) 
        ↓
Data Ingestion & Preprocessing
        ↓
Feature Engineering & Fusion
        ↓
ML Models (XGBoost + LightGBM)
        ↓
Risk Engine & Alert Generation
        ↓
FastAPI Backend
        ↓
React Dashboard & Leaflet Maps
        ↓
📱 End User
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical architecture.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | Latest | Type safety |
| Tailwind CSS | 3+ | Styling |
| Leaflet | 1.9+ | Interactive maps |
| React-Leaflet | 4+ | React map integration |
| Recharts | 2+ | Data visualization |
| Axios | Latest | HTTP client |
| Vite | Latest | Build tool |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.95+ | REST API |
| Python | 3.9+ | Core language |
| Uvicorn | 0.20+ | ASGI server |
| SQLAlchemy | 2+ | ORM |
| Pydantic | 2+ | Validation |
| Pytest | 7+ | Testing |
| APScheduler | 3.10+ | Task scheduling |

### Machine Learning
| Technology | Purpose |
|-----------|---------|
| XGBoost | Primary rainfall model |
| LightGBM | Alternative/backup model |
| Scikit-learn | Data preprocessing |
| PyTorch | Optional LSTM models |
| Pandas + NumPy | Data manipulation |
| MLflow | Experiment tracking |

### Geospatial
| Technology | Purpose |
|-----------|---------|
| PostgreSQL 13+ | Database |
| PostGIS 3+ | Spatial queries |
| GeoPandas | GIS operations |
| Rasterio | Raster data |
| Shapely | Geometry operations |
| PyProj | Coordinate transforms |

### Deployment
| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Local orchestration |
| Vercel | Frontend hosting |
| Render / Railway | Backend hosting |
| Supabase | Database hosting |
| GitHub Actions | CI/CD |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Docker & Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/aquasentinel/aquasentinel.git
cd aquasentinel
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see .env.example)
cp .env.example .env

# Start database (PostgreSQL + PostGIS)
cd ..
docker-compose up -d db

# Run migrations (if any)
cd backend
python -m alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`  
API Documentation: `http://localhost:8000/docs` (Swagger UI)

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Set API URL (for local development)
# In .env: REACT_APP_API_URL=http://localhost:8000

# Start development server
npm start
```

Frontend will be available at `http://localhost:3000`

### 4. Database Setup

```bash
# Start PostgreSQL + PostGIS with Docker
docker-compose up -d db

# Access database
psql -h localhost -U aquasentinel_user -d aquasentinel_db

# Run initialization SQL (if needed)
psql -h localhost -U aquasentinel_user -d aquasentinel_db < backend/db/init.sql
```

### 5. Start All Services (One Command)

```bash
docker-compose up
```

This starts:
- PostgreSQL + PostGIS database
- Redis cache (optional)
- FastAPI backend
- React frontend

---

## 📖 Usage Guide

### For End Users

1. **Access the Dashboard**
   - Open `http://localhost:3000` (or deployed URL)

2. **Select a Region**
   - Use the region selector dropdown to choose your area of interest
   - Map will automatically center on selected region

3. **View Current Conditions**
   - Check metrics panel for current rainfall, temperature, humidity
   - Observe current weather station observations

4. **Check Forecasts**
   - View rainfall predictions for 1h, 3h, 6h, 24h horizons
   - Each forecast shows predicted rainfall amount and confidence

5. **Monitor Inundation Risk**
   - See inundation probability layer on map
   - High-risk zones are highlighted
   - Hover over zones for detailed information

6. **View Active Alerts**
   - Check alert center for current warnings
   - Click alerts for recommended actions
   - Review alert history

### For Developers

#### Running Tests

**Backend Tests:**
```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=app --cov-report=html
```

**Frontend Tests:**
```bash
cd frontend
npm test
npm test -- --coverage
```

#### Running Linting & Formatting

**Backend (Python):**
```bash
cd backend

# Format code with black
black app/

# Lint with pylint
pylint app/

# Type checking with mypy
mypy app/
```

**Frontend (JavaScript):**
```bash
cd frontend

# Format with prettier
npm run format

# Lint with eslint
npm run lint
```

#### Training ML Models

```bash
cd ml

# Download data
python scripts/download_data.py --region ALL

# Preprocess data
python scripts/preprocess_data.py

# Train models
python scripts/train_models.py --model xgboost --config config/xgboost.yaml

# Evaluate models
python scripts/evaluate_models.py --model trained_models/rainfall_xgboost.pkl

# Export models for production
python scripts/export_models.py
```

#### Making API Requests

**Get Rainfall Forecast:**
```bash
curl -X GET "http://localhost:8000/forecast?region=pune&horizon=6" \
  -H "Content-Type: application/json"
```

**Get Risk Classification:**
```bash
curl -X GET "http://localhost:8000/risk?region=pune" \
  -H "Content-Type: application/json"
```

**Get Active Alerts:**
```bash
curl -X GET "http://localhost:8000/alerts?region=pune&status=active" \
  -H "Content-Type: application/json"
```

See [API Documentation](#api-documentation) for complete endpoint reference.

---

## 📁 Project Structure

```
aquasentinel/
├── README.md                      # This file
├── ARCHITECTURE.md                # Detailed architecture documentation
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # MIT License
├── docker-compose.yml             # Local development compose
├── .github/
│   ├── workflows/
│   │   ├── backend-tests.yml     # Backend CI/CD
│   │   ├── frontend-tests.yml    # Frontend CI/CD
│   │   └── deploy.yml            # Deployment workflow
│   └── ISSUE_TEMPLATE/           # Issue templates
│
├── frontend/                      # React application
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Map/
│   │   │   ├── Dashboard/
│   │   │   ├── Controls/
│   │   │   └── Charts/
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── context/              # React context
│   │   ├── hooks/                # Custom hooks
│   │   ├── types/                # TypeScript types
│   │   ├── styles/               # CSS & Tailwind
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                       # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── models/              # Database models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── database/            # DB configuration
│   │   ├── ml/                  # ML inference
│   │   ├── tasks/               # Background jobs
│   │   ├── utils/               # Utilities
│   │   ├── middleware/          # Custom middleware
│   │   ├── main.py              # App entry point
│   │   └── config.py            # Configuration
│   ├── tests/
│   │   ├── test_api.py
│   │   ├── test_services.py
│   │   └── test_models.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── pytest.ini
│
├── ml/                            # Machine Learning pipeline
│   ├── data/
│   │   ├── loaders.py           # Data loading
│   │   ├── preprocessors.py     # Data cleaning
│   │   └── feature_engineers.py # Feature creation
│   ├── models/
│   │   ├── rainfall_model.py
│   │   ├── inundation_model.py
│   │   └── model_loader.py
│   ├── training/
│   │   ├── trainer.py           # Training orchestrator
│   │   ├── evaluation.py        # Metrics
│   │   └── callbacks.py         # Callbacks
│   ├── inference/
│   │   └── predictor.py         # Batch inference
│   ├── experiments/             # Model experiments
│   ├── notebooks/               # Jupyter notebooks
│   ├── scripts/
│   │   ├── download_data.py
│   │   ├── train_models.py
│   │   ├── evaluate_models.py
│   │   └── export_models.py
│   ├── models_trained/          # Trained model files
│   └── requirements.txt
│
├── config/                        # Configuration files
│   ├── logging.yaml             # Logging config
│   ├── models.yaml              # Model configs
│   └── data_sources.yaml        # Data source configs
│
└── docs/                          # Documentation
    ├── API.md                   # API reference
    ├── DEPLOYMENT.md            # Deployment guide
    ├── DATA_SOURCES.md          # Data source details
    └── TROUBLESHOOTING.md       # Common issues
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
Currently, the API is open. Future versions will include API key authentication.

### Forecast Endpoints

**Get Rainfall Forecast**
```
GET /forecast?region={region_code}&horizon={hours}

Query Parameters:
  - region (required): Region code (e.g., 'pune', 'mumbai')
  - horizon (optional): Forecast hours (1, 3, 6, 24) - default: 6

Response:
{
  "region": "pune",
  "forecast_time": "2026-08-26T12:00:00Z",
  "horizon_hours": 6,
  "predicted_rainfall_mm": 45.2,
  "confidence": 0.87,
  "model_version": "v1.0-xgboost"
}
```

### Rainfall Endpoints

**Get Current & Historical Rainfall**
```
GET /rainfall?region={region}&limit={records}

Response:
{
  "region": "pune",
  "current_rainfall_mm": 12.5,
  "observations": [
    {
      "timestamp": "2026-08-26T11:00:00Z",
      "rainfall_mm": 5.2,
      "source": "IMD"
    }
  ]
}
```

### Inundation Endpoints

**Get Inundation Risk**
```
GET /inundation?region={region}

Response:
{
  "region": "pune",
  "inundation_probability": 0.72,
  "severity_level": "HIGH",
  "affected_area_km2": 125.4,
  "high_risk_zones": 8
}
```

**Get Inundation Zones (GeoJSON)**
```
GET /inundation/zones?region={region}

Response: GeoJSON FeatureCollection with polygon geometries
```

### Risk Endpoints

**Get Regional Risk Level**
```
GET /risk?region={region}

Response:
{
  "region": "pune",
  "overall_risk": "HIGH",
  "rainfall_risk": 0.85,
  "inundation_risk": 0.72,
  "last_updated": "2026-08-26T12:00:00Z"
}
```

### Alert Endpoints

**Get Active & Historical Alerts**
```
GET /alerts?region={region}&status={active|all}

Response:
{
  "active_alerts": [
    {
      "alert_id": "alert_001",
      "region": "pune",
      "risk_level": "HIGH",
      "predicted_rainfall_mm": 145,
      "inundation_probability": 0.81,
      "warning_lead_time_minutes": 120,
      "issued_at": "2026-08-26T10:00:00Z"
    }
  ],
  "total_count": 5
}
```

### Health Check

**API Health Status**
```
GET /health

Response:
{
  "status": "healthy",
  "database": "connected",
  "models_loaded": true,
  "timestamp": "2026-08-26T12:00:00Z"
}
```

For complete API documentation, visit: `http://localhost:8000/docs`

---

## 🔍 Data Sources

AquaSentinel integrates data from multiple authoritative sources:

| Source | Data Type | Frequency | Coverage |
|--------|-----------|-----------|----------|
| **IMD** | Weather obs, rainfall | Hourly | All-India |
| **INSAT** | Satellite imagery, TIR | 30 min | Regional |
| **Sentinel** | Satellite imagery | Daily | Global |
| **ERA5** | Reanalysis, NWP | Hourly | Global |
| **NASA GPM** | Precipitation | Hourly | Tropical |
| **SRTM DEM** | Elevation | Static | Global |

**Data Access Requirements:**
- IMD: Public API (registration required)
- INSAT: ISRO MOSDAC credentials
- Sentinel: Copernicus API (free)
- ERA5: Copernicus Climate Data Store
- NASA: Earth Data portal

See [docs/DATA_SOURCES.md](./docs/DATA_SOURCES.md) for detailed setup.

---

## 📊 Model Performance

### Rainfall Prediction Model
- **Type**: XGBoost Regressor
- **Training Data**: 5+ years of historical rainfall
- **MAE**: ~8.5 mm
- **RMSE**: ~12.3 mm
- **R² Score**: 0.82
- **Event Detection F1**: 0.88

### Inundation Prediction Model
- **Type**: XGBoost Classifier
- **Training Data**: Historical flood records + terrain analysis
- **Precision**: 0.85
- **Recall**: 0.79
- **F1-Score**: 0.82
- **ROC-AUC**: 0.89

*Note: Performance metrics vary by region and season. See [ARCHITECTURE.md](./ARCHITECTURE.md#performance-requirements) for details.*

---

## 🚢 Deployment

### Local Deployment (Development)

```bash
docker-compose up
```

### Production Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for comprehensive deployment instructions.

**Quick Production Deploy:**

1. **Frontend (Vercel)**
   ```bash
   vercel deploy --prod
   ```

2. **Backend (Render/Railway)**
   ```bash
   # Push to GitHub, Render auto-deploys on push to main
   git push origin main
   ```

3. **Database (Supabase/Railway PostgreSQL)**
   ```bash
   # Run migrations:
   python -m alembic upgrade head
   ```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for environment configuration and scaling details.

---

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm test -- --coverage
```

### Test Coverage Goals
- Backend: >80% coverage
- Frontend: >75% coverage

### Running Specific Tests

```bash
# Test specific module
pytest tests/test_models.py -v

# Test with specific marker
pytest -m "not slow" -v

# Test with keyword
pytest -k "rainfall" -v
```

---

## 📝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/aquasentinel.git
   cd aquasentinel
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

4. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Standards
- Follow PEP 8 (Python) and Prettier (JavaScript)
- Write tests for new features
- Update documentation
- Sign commits (optional but recommended)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: Could not connect to PostgreSQL
Solution: Ensure Docker container is running
docker-compose up -d db
```

**API Not Responding**
```
Error: Connection refused on localhost:8000
Solution: Start backend server
cd backend && uvicorn app.main:app --reload
```

**Models Not Loading**
```
Error: Model files not found
Solution: Download/train models
cd ml && python scripts/train_models.py
```

**Frontend API Calls Failing**
```
Error: CORS error in browser console
Solution: Check REACT_APP_API_URL in .env
Ensure backend is running on expected port
```

See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for more solutions.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design & tech stack details |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |
| [docs/API.md](./docs/API.md) | Complete API reference |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deployment guide |
| [docs/DATA_SOURCES.md](./docs/DATA_SOURCES.md) | Data source setup |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common issues & solutions |

---

## 🎯 Roadmap

### Phase 1 (Current - MVP)
- ✅ Multi-source data ingestion
- ✅ Rainfall prediction (XGBoost/LightGBM)
- ✅ Inundation risk estimation
- ✅ Interactive map visualization
- ✅ Alert generation system
- ✅ Dashboard with forecasts

### Phase 2 (Q4 2026)
- 🔄 Advanced LSTM/ConvLSTM models
- 🔄 Real-time satellite processing
- 🔄 Prediction confidence intervals
- 🔄 SMS/Email notifications
- 🔄 Mobile app (React Native)

### Phase 3 (2027)
- 📋 Physics-informed neural networks
- 📋 IoT rain-gauge integration
- 📋 Traffic/road accessibility layer
- 📋 Evacuation route recommendations
- 📋 Integration with emergency systems
- 📋 Multi-language support

### Future Enhancements
- Ensemble methods (Stacking, Boosting)
- Transformer-based nowcasting
- Population vulnerability mapping
- Climate change trend analysis
- AI-powered decision support for authorities

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## 🤝 Support & Community

### Get Help
- **Issues**: [GitHub Issues](https://github.com/aquasentinel/aquasentinel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aquasentinel/aquasentinel/discussions)
- **Email**: support@aquasentinel.dev

### Report Bugs
Please use the [Bug Report Template](https://github.com/aquasentinel/aquasentinel/issues/new?template=bug_report.md)

### Request Features
Please use the [Feature Request Template](https://github.com/aquasentinel/aquasentinel/issues/new?template=feature_request.md)

---

## 🙏 Acknowledgments

- **India Meteorological Department (IMD)** for weather data
- **ISRO** for satellite imagery access
- **Copernicus Climate Data Store** for ERA5 data
- **NASA** for precipitation data
- **Open-source community** for amazing libraries and frameworks
- **Smart India Hackathon (SIH) 2026** for the opportunity

---

## 🔐 Security

If you discover a security vulnerability, please email **srhaldikar711@gmail.com** instead of using the issue tracker.

---

**[⬆ back to top](#aquasentinel)**

---

**Made with ❤️ for Smart India Hackathon 2026**

*Transforming weather forecasts into early warnings, protecting lives and communities.*
