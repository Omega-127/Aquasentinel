# AquaSentinel - MVP Specification

**Document Type:** Product Requirements - MVP Phase  
**Project:** AquaSentinel (SIH 2026)  
**Date:** August 27, 2026  
**Target Timeline:** 6-8 weeks  

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [MVP Scope](#mvp-scope)
3. [Must-Have Features](#must-have-features)
4. [Tech Stack Simplified](#tech-stack-simplified)
5. [Data Requirements](#data-requirements)
6. [ML Models (MVP)](#ml-models-mvp)
7. [Database Schema (MVP)](#database-schema-mvp)
8. [API Endpoints (MVP)](#api-endpoints-mvp)
9. [Frontend Components (MVP)](#frontend-components-mvp)
10. [Development Phases](#development-phases)
11. [Testing Strategy](#testing-strategy)
12. [Success Metrics](#success-metrics)
13. [Known Limitations](#known-limitations)

---

## Executive Summary

**AquaSentinel MVP** is a **lightweight, focused early warning system** for rainfall and flood prediction that combines multiple data sources with AI/ML models to provide location-specific risk alerts.

### MVP Vision
> "Deliver a functional, deployable early warning platform that predicts heavy rainfall and identifies flood-prone areas for a single region, with a simple web dashboard and automated alert system."

### MVP Goals
1. ✅ Predict rainfall intensity (1-24 hours ahead)
2. ✅ Estimate flood inundation probability
3. ✅ Classify risk levels (LOW, MODERATE, HIGH, SEVERE)
4. ✅ Display on interactive map
5. ✅ Generate automated alerts
6. ✅ Provide working dashboard for demo

### MVP Non-Goals (Phase 2+)
- ❌ Multi-region support (start with 1 city)
- ❌ Real-time satellite processing
- ❌ Advanced ensemble models
- ❌ SMS/WhatsApp notifications
- ❌ Mobile app
- ❌ Physics-informed models
- ❌ IoT sensor integration

---

## MVP Scope

### What's Included (Must-Have)

#### 1. Data Pipeline
- ✅ Ingest historical rainfall data (5+ years)
- ✅ Connect to 1-2 weather data sources (IMD, ERA5)
- ✅ Load DEM/elevation data
- ✅ Store in PostgreSQL

#### 2. ML Models
- ✅ Rainfall prediction model (XGBoost)
- ✅ Inundation risk model (XGBoost)
- ✅ Risk classification logic
- ✅ Trained and exported for inference

#### 3. Backend API
- ✅ REST API (FastAPI)
- ✅ 6 core endpoints (forecast, rainfall, inundation, risk, alerts, health)
- ✅ Database integration (PostgreSQL + PostGIS)
- ✅ Alert generation engine

#### 4. Frontend Dashboard
- ✅ Interactive map (Leaflet)
- ✅ Rainfall prediction display
- ✅ Risk level indicator
- ✅ Active alerts panel
- ✅ Current weather metrics

#### 5. Deployment
- ✅ Docker containerization
- ✅ Local docker-compose setup
- ✅ Cloud deployment guide

---

## Must-Have Features

### Feature 1: Rainfall Forecasting
**Description:** Predict rainfall for next 1, 3, 6, and 24 hours

**Scope:**
- Input: Historical rainfall + weather variables
- Output: Predicted rainfall (mm), confidence score
- Coverage: Single city (Pune recommended)
- Accuracy: MAE < 15mm, R² > 0.75

**User Story:**
```
As a disaster manager
I want to see rainfall forecasts for the next 24 hours
So that I can prepare evacuation routes
```

### Feature 2: Inundation Risk Assessment
**Description:** Estimate probability of flooding/waterlogging

**Scope:**
- Input: Predicted rainfall + terrain + drainage
- Output: Inundation probability (0-100%), risk zones
- Resolution: Administrative boundary level
- Accuracy: Precision > 80%, Recall > 70%

**User Story:**
```
As a municipal officer
I want to see which areas will be flooded
So that I can deploy rescue teams in advance
```

### Feature 3: Risk Classification
**Description:** Classify overall risk into 4 levels

**Scope:**
- Risk Levels:
  - LOW: Minimal impact
  - MODERATE: Some localized issues
  - HIGH: Major flooding likely
  - SEVERE: Catastrophic flooding
- Based on: Rainfall + inundation probability
- Update frequency: Every hour

### Feature 4: Interactive Map Visualization
**Description:** Display predictions on interactive map

**Scope:**
- Base map with roads and boundaries
- Rainfall intensity layer (heatmap)
- Inundation risk zones (color-coded)
- Weather station markers
- Risk level legend
- Responsive design

**Technologies:**
- Leaflet.js (free, open-source)
- OpenStreetMap (base tiles)
- GeoJSON for zones

### Feature 5: Alert Generation & Management
**Description:** Automatically generate and display alerts

**Scope:**
- Trigger: Risk level >= MODERATE
- Alert contains:
  - Risk level
  - Location
  - Predicted rainfall
  - Inundation probability
  - Recommended actions
  - Lead time (hours until onset)
- Manual acknowledge capability

**User Story:**
```
As a disaster management authority
I want to receive automated alerts when risk is HIGH or SEVERE
So that I can activate emergency protocols immediately
```

### Feature 6: Current Weather Display
**Description:** Show real-time weather observations

**Scope:**
- Metrics displayed:
  - Current rainfall
  - Temperature
  - Humidity
  - Wind speed/direction
  - Pressure
- Data source: IMD or INSAT
- Update frequency: Every hour

---

## Tech Stack Simplified

### Frontend (Minimal)

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| React | 18 | UI framework | Easy to learn, large community |
| TypeScript | Latest | Type safety | Catch bugs early |
| Tailwind CSS | 3 | Styling | Fast, utility-first |
| Leaflet | 1.9 | Maps | Lightweight, no API key needed |
| Recharts | 2 | Charts | Simple time-series viz |
| Axios | Latest | HTTP requests | Easy API calls |

**Why minimal:**
- React + Tailwind is fast to develop
- Leaflet doesn't require API keys
- No complex state management needed (Context API sufficient)

### Backend (Minimal)

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| FastAPI | 0.95+ | REST API | Very fast, auto-docs |
| Python | 3.9 | Language | ML libraries support |
| PostgreSQL | 13 | Database | Reliable, free |
| PostGIS | 3 | Spatial queries | Perfect for geospatial |
| SQLAlchemy | 2 | ORM | No raw SQL needed |
| Pydantic | 2 | Validation | Auto request validation |

**Why minimal:**
- FastAPI is production-ready
- PostgreSQL + PostGIS handles all data needs
- No need for microservices (single instance)

### ML (Minimal)

| Technology | Purpose | Rationale |
|-----------|---------|-----------|
| XGBoost | Rainfall model | Fast, accurate, production-ready |
| Scikit-learn | Data preprocessing | Simple, sufficient |
| Pandas + NumPy | Data manipulation | Industry standard |
| Jupyter | Experimentation | Quick model iteration |
| ❌ PyTorch | Not needed yet | Use in Phase 2 |
| ❌ LightGBM | Not needed yet | Use in Phase 2 |

**Why minimal:**
- XGBoost alone is sufficient
- Don't add complexity (LSTM, Transformers) without proof of need
- Scikit-learn is easy to learn

### Deployment (Minimal)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Vercel | Frontend | ✅ Yes (5 deployments/day) |
| Render | Backend | ✅ Yes (free instance) |
| Supabase | Database | ✅ Yes (500 MB) |
| GitHub | Code hosting | ✅ Yes |

**Why minimal:**
- All services have free tiers
- No credit card needed for hackathon
- Can scale later

---

## Data Requirements

### Training Data

**For Rainfall Model:**
- Historical rainfall: 5 years (2019-2024)
- Weather variables: Temperature, humidity, pressure, wind
- Sources:
  - IMD (India Meteorological Department)
  - ERA5 reanalysis
- Volume: ~45,000 hourly records per region
- Format: CSV or NetCDF

**For Inundation Model:**
- Rainfall data: Same as above
- Flood records: Historical inundation incidents (500+ samples)
- Terrain data: SRTM DEM (30m resolution)
- Drainage data: River networks, drainage maps
- Land-use data: Urban/rural classification

### Real-time Data

**During Production:**
- Rainfall observations: Hourly from IMD
- Weather forecasts: Every 6 hours from NWP
- DEM: Static (load once)
- Drainage: Static (load once)

### Data Processing

```python
# Minimal data pipeline
1. Load historical CSV
2. Clean missing values (forward fill)
3. Feature engineering (cumulative rainfall, lags)
4. Train/test split (80/20)
5. Standardize (StandardScaler)
6. Train XGBoost
7. Save model (pickle)
```

---

## ML Models (MVP)

### Model 1: Rainfall Prediction

**Type:** XGBoost Regressor

**Input Features:**
```python
features = [
    'rainfall_1h_ago',
    'rainfall_3h_ago',
    'rainfall_6h_ago',
    'rainfall_24h_ago',
    'temperature',
    'humidity',
    'pressure',
    'wind_speed',
    'wind_direction',
    'hour_of_day',
    'day_of_month',
    'month'
]
```

**Output:** Predicted rainfall (mm) for next 1/3/6/24 hours

**Performance Target:**
- MAE < 15 mm
- RMSE < 20 mm
- R² > 0.75

**Training:**
```python
from xgboost import XGBRegressor

model = XGBRegressor(
    n_estimators=100,
    max_depth=7,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

model.fit(X_train, y_train)
model.save_model('rainfall_model.pkl')
```

### Model 2: Inundation Risk Classification

**Type:** XGBoost Classifier (Binary: Flood/No-Flood)

**Input Features:**
```python
features = [
    'predicted_rainfall_mm',
    'cumulative_rainfall_6h',
    'cumulative_rainfall_24h',
    'elevation_m',
    'slope_degree',
    'distance_to_river_km',
    'drainage_index',
    'imperviousness_pct',
    'urban_density'
]
```

**Output:** Inundation probability (0-1)

**Performance Target:**
- Precision > 80%
- Recall > 70%
- F1-Score > 0.75
- ROC-AUC > 0.85

**Training:**
```python
from xgboost import XGBClassifier

model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    scale_pos_weight=5,  # Handle class imbalance
    random_state=42
)

model.fit(X_train, y_train)
model.save_model('inundation_model.pkl')
```

### Model 3: Risk Classification (Rule-based)

**No ML needed!** Use simple thresholds:

```python
def classify_risk(rainfall_mm, inundation_prob):
    """Classify risk into 4 levels"""
    
    if rainfall_mm > 100 and inundation_prob > 0.7:
        return "SEVERE"
    elif rainfall_mm > 50 or inundation_prob > 0.6:
        return "HIGH"
    elif rainfall_mm > 20 or inundation_prob > 0.4:
        return "MODERATE"
    else:
        return "LOW"
```

---

## Database Schema (MVP)

### Minimal Tables (5 tables only)

```sql
-- 1. Regions
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    code VARCHAR(50),
    geometry GEOMETRY(POLYGON, 4326),
    center GEOMETRY(POINT, 4326)
);

-- 2. Rainfall Observations
CREATE TABLE rainfall_observations (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    timestamp TIMESTAMP NOT NULL,
    rainfall_mm DECIMAL(10, 2),
    source VARCHAR(50),
    INDEX idx_region_time (region_id, timestamp)
);

-- 3. Rainfall Forecasts
CREATE TABLE rainfall_forecasts (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    forecast_time TIMESTAMP,
    horizon_hours INTEGER,
    predicted_rainfall_mm DECIMAL(10, 2),
    confidence DECIMAL(3, 2)
);

-- 4. Inundation Predictions
CREATE TABLE inundation_predictions (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    prediction_time TIMESTAMP,
    inundation_probability DECIMAL(3, 2),
    severity_level VARCHAR(50),
    affected_area_km2 DECIMAL(10, 2)
);

-- 5. Alerts
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    risk_level VARCHAR(50),
    rainfall_mm DECIMAL(10, 2),
    inundation_prob DECIMAL(3, 2),
    status VARCHAR(50),
    issued_at TIMESTAMP,
    acknowledged_at TIMESTAMP
);
```

**Why 5 tables:**
- Simple, easy to query
- No complex relationships
- Sufficient for MVP
- Can add more tables later

---

## API Endpoints (MVP)

### Minimal Endpoints (5 endpoints)

**Production-ready API that covers all core features:**

#### 1. GET /forecast
```bash
curl "http://localhost:8000/api/v1/forecast?region=pune&horizon=6"

Response:
{
  "region": "pune",
  "predicted_rainfall_mm": 45.2,
  "confidence": 0.87,
  "forecast_time": "2026-08-27T12:00:00Z"
}
```

#### 2. GET /inundation
```bash
curl "http://localhost:8000/api/v1/inundation?region=pune"

Response:
{
  "inundation_probability": 0.72,
  "severity_level": "HIGH",
  "affected_area_km2": 125.4,
  "high_risk_zones": 8
}
```

#### 3. GET /risk
```bash
curl "http://localhost:8000/api/v1/risk?region=pune"

Response:
{
  "overall_risk": "HIGH",
  "rainfall_risk": 0.85,
  "inundation_risk": 0.72,
  "confidence": 0.82
}
```

#### 4. GET /alerts
```bash
curl "http://localhost:8000/api/v1/alerts?region=pune&status=active"

Response:
{
  "alerts": [
    {
      "alert_id": "alert_001",
      "risk_level": "SEVERE",
      "rainfall_mm": 145,
      "issued_at": "2026-08-27T10:00:00Z"
    }
  ]
}
```

#### 5. GET /rainfall
```bash
curl "http://localhost:8000/api/v1/rainfall?region=pune"

Response:
{
  "current_rainfall_mm": 12.5,
  "cumulative_6h": 45.2,
  "observations": [...]
}
```

**That's it!** No need for:
- ❌ POST endpoints
- ❌ Authentication
- ❌ Pagination (yet)
- ❌ Advanced filtering

---

## Frontend Components (MVP)

### Minimal Components (6 components)

```
App.tsx
├── Layout.tsx
│   ├── Header.tsx
│   │   └── RegionSelector.tsx
│   └── Main Content
│       ├── MapContainer.tsx
│       │   ├── Leaflet Map
│       │   ├── Rainfall Layer
│       │   └── Risk Zones Layer
│       ├── DashboardPanel.tsx
│       │   ├── MetricsDisplay.tsx
│       │   │   ├── Current Rainfall
│       │   │   ├── Temperature
│       │   │   └── Humidity
│       │   ├── RiskGauge.tsx
│       │   └── AlertsPanel.tsx
│       └── ForecastChart.tsx
└── Services/
    └── api.ts
```

### Component Breakdown

**1. MapContainer**
- Leaflet map centered on region
- Rainfall heatmap layer
- Risk zones layer (colored polygons)
- Weather station markers
- Simple zoom + pan

**2. MetricsDisplay**
- Show current weather metrics
- Card-based layout
- Color-coded risk level

**3. RiskGauge**
- Circular progress indicator
- Shows overall risk score
- Color changes by risk level

**4. AlertsPanel**
- List of active alerts
- Risk level badge
- Simple timeline

**5. ForecastChart**
- Line chart of rainfall (next 24h)
- Recharts component
- Interactive (hover for values)

**6. RegionSelector**
- Dropdown menu
- 3-5 cities only (Pune, Mumbai, Bangalore, etc.)

### Simple Styling

```css
/* Tailwind only, no custom CSS */

/* Colors */
LOW: bg-green-500
MODERATE: bg-yellow-500
HIGH: bg-orange-500
SEVERE: bg-red-500

/* Layout */
- Full-width responsive
- Mobile-first design
- Single column on mobile, 2-column on desktop
```

---

## Development Phases

### Phase 1: Setup & Infrastructure (Week 1-2)

**Backend Setup:**
- [ ] FastAPI project structure
- [ ] PostgreSQL + PostGIS local setup
- [ ] Basic API with health check
- [ ] Environment configuration

**Frontend Setup:**
- [ ] React project structure
- [ ] Tailwind CSS configured
- [ ] Basic components (Header, Layout)
- [ ] Development server working

**Tasks:**
```
Backend:
- app/main.py (FastAPI app)
- app/config.py (settings)
- app/database/ (connection)
- docker-compose.yml

Frontend:
- package.json with dependencies
- src/App.tsx
- src/components/Layout.tsx
- vite.config.ts
```

**Deliverable:** Running frontend + backend locally

---

### Phase 2: Data & Models (Week 2-3)

**Data Collection:**
- [ ] Download 5 years historical rainfall
- [ ] Download DEM data
- [ ] Download weather data

**Model Development:**
- [ ] Rainfall prediction model (XGBoost)
- [ ] Inundation classification model (XGBoost)
- [ ] Model evaluation & tuning
- [ ] Export models to pickle files

**Tasks:**
```
ML:
- ml/data/loaders.py (load CSVs)
- ml/data/preprocessors.py (clean data)
- ml/data/feature_engineers.py (create features)
- ml/models/rainfall_model.py (train & save)
- ml/models/inundation_model.py (train & save)
```

**Deliverable:** Trained models (.pkl files)

---

### Phase 3: Backend API (Week 3-4)

**Database Setup:**
- [ ] Create 5 tables
- [ ] Insert sample data
- [ ] Test queries

**API Development:**
- [ ] Forecast endpoint
- [ ] Inundation endpoint
- [ ] Risk endpoint
- [ ] Alerts endpoint
- [ ] Rainfall endpoint
- [ ] Model loading & inference

**Tasks:**
```
Backend:
- app/api/v1/forecast.py
- app/api/v1/inundation.py
- app/api/v1/risk.py
- app/api/v1/alerts.py
- app/api/v1/rainfall.py
- app/services/forecast_service.py
- app/services/inundation_service.py
- app/services/risk_service.py
- app/ml/model_loader.py
```

**Deliverable:** Working API (test with curl)

---

### Phase 4: Frontend Dashboard (Week 4-5)

**Map Component:**
- [ ] Leaflet map integration
- [ ] Rainfall heatmap
- [ ] Risk zones overlay

**Dashboard Panels:**
- [ ] Metrics display
- [ ] Risk gauge
- [ ] Alerts list
- [ ] Forecast chart

**Integration:**
- [ ] Connect to backend API
- [ ] Fetch and display data
- [ ] Error handling

**Tasks:**
```
Frontend:
- src/components/MapContainer.tsx
- src/components/MetricsDisplay.tsx
- src/components/RiskGauge.tsx
- src/components/AlertsPanel.tsx
- src/components/ForecastChart.tsx
- src/services/api.ts (API client)
```

**Deliverable:** Working dashboard

---

### Phase 5: Testing & Deployment (Week 5-6)

**Testing:**
- [ ] Backend unit tests
- [ ] Frontend component tests
- [ ] API integration tests
- [ ] Manual E2E testing

**Docker:**
- [ ] Backend Dockerfile
- [ ] Frontend Dockerfile
- [ ] docker-compose.yml

**Deployment:**
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Deploy database to Supabase
- [ ] Configure DNS

**Tasks:**
```
- backend/Dockerfile
- frontend/Dockerfile
- docker-compose.yml
- backend/tests/ (test files)
- frontend/src/__tests__/ (test files)
- docs/DEPLOYMENT.md
```

**Deliverable:** Live application

---

### Phase 6: Polish & Documentation (Week 6-8)

**Documentation:**
- [ ] API documentation
- [ ] Deployment guide
- [ ] README
- [ ] User guide

**Demo Preparation:**
- [ ] Create demo data
- [ ] Prepare presentation
- [ ] Practice walkthrough

**Bug Fixes:**
- [ ] Fix any issues found
- [ ] Performance optimization
- [ ] UX improvements

**Deliverable:** Production-ready system for hackathon demo

---

## Testing Strategy

### Backend Testing

**Unit Tests (Pytest):**

```python
# tests/test_api.py
def test_get_forecast():
    client = TestClient(app)
    response = client.get("/api/v1/forecast?region=pune&horizon=6")
    assert response.status_code == 200
    assert "predicted_rainfall_mm" in response.json()["data"]

def test_invalid_region():
    client = TestClient(app)
    response = client.get("/api/v1/forecast?region=invalid")
    assert response.status_code == 404

def test_risk_classification():
    from app.services.risk_service import classify_risk
    risk = classify_risk(rainfall_mm=150, inundation_prob=0.8)
    assert risk == "SEVERE"
```

**Coverage Target:** > 70%

### Frontend Testing

**Component Tests (Vitest/Jest):**

```javascript
// src/__tests__/components/MetricsDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import MetricsDisplay from '@/components/MetricsDisplay';

test('displays rainfall metric', () => {
  render(<MetricsDisplay rainfall={12.5} />);
  expect(screen.getByText(/12.5/)).toBeInTheDocument();
});

test('shows correct risk color', () => {
  const { container } = render(<MetricsDisplay riskLevel="HIGH" />);
  expect(container.querySelector('.bg-orange-500')).toBeInTheDocument();
});
```

**Coverage Target:** > 60%

### Integration Tests

```bash
# Manual testing
1. Start backend: uvicorn app.main:app --reload
2. Start frontend: npm start
3. Open browser: localhost:3000
4. Select region
5. Verify map loads
6. Verify API data displays
7. Check alerts panel
```

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8000/api/v1/forecast?region=pune

# Target: < 200ms response time under 10 concurrent requests
```

---

## Success Metrics

### Technical Metrics

| Metric | Target | Priority |
|--------|--------|----------|
| API Response Time | < 200ms | 🔴 Critical |
| Model Accuracy (Rainfall) | MAE < 15mm | 🔴 Critical |
| Model Precision (Inundation) | > 80% | 🔴 Critical |
| Uptime | > 99% | 🟡 Important |
| Test Coverage | > 70% | 🟡 Important |
| Page Load Time | < 2s | 🟡 Important |

### User-Facing Metrics

| Metric | Target |
|--------|--------|
| Forecast accuracy | Within ±10mm |
| Alert generation time | < 5 minutes from prediction |
| Map responsiveness | Instant zoom/pan |
| Alert acknowledgment rate | > 90% |

### Business Metrics

| Metric | Target |
|--------|--------|
| System uptime during disaster | 100% |
| False alarm rate | < 10% |
| Missed event rate | < 5% |
| Dashboard load time | < 1s |

---

## Known Limitations

### MVP Doesn't Include

#### 1. Single Region Only
- MVP covers only 1 city (e.g., Pune)
- Multi-region support = Phase 2
- **Reason:** Reduced complexity, faster development

#### 2. Hourly Updates Only
- Real-time updates every 1-6 hours
- Live streaming = Phase 2
- **Reason:** Simpler deployment

#### 3. Basic Models
- XGBoost only (no LSTM/Transformers)
- No ensemble methods
- Advanced models = Phase 2
- **Reason:** Fast training, sufficient accuracy

#### 4. No User Authentication
- Open API (no API keys)
- Authentication = Phase 2
- **Reason:** Faster development

#### 5. No Mobile App
- Web-only (responsive design)
- Mobile app = Phase 3
- **Reason:** More development work

#### 6. Limited Data Sources
- IMD + ERA5 only
- Satellite integration = Phase 2
- **Reason:** Simpler data pipeline

#### 7. No Notifications
- Alerts visible in dashboard only
- SMS/Email = Phase 2
- **Reason:** Requires third-party services

#### 8. No Historical Analysis
- Current forecasts only
- Historical trends = Phase 2
- **Reason:** Extra storage + queries needed

---

## Phase 2 Features (Post-Hackathon)

After winning/submitting MVP, add:

```
PHASE 2 (Months 3-6):
├── Multi-region support (5-10 cities)
├── Real-time satellite processing
├── SMS/Email notifications
├── Advanced ensemble models (LSTM, Transformers)
├── Prediction confidence intervals
├── Historical trend analysis
├── IoT rain gauge integration
└── Performance dashboards

PHASE 3 (Months 6-12):
├── Mobile app (React Native)
├── Physics-informed neural networks
├── Population vulnerability mapping
├── Evacuation route recommendations
├── Emergency service integration
└── Multi-language support
```

---

## Deployment Architecture (MVP)

```
┌─────────────────────────────────┐
│  Frontend (Vercel)              │
│  - React SPA                    │
│  - Auto-deploy from GitHub      │
│  - CDN for static assets        │
└──────────────┬──────────────────┘
               │ HTTPS
┌──────────────▼──────────────────┐
│  Backend (Render)               │
│  - FastAPI app                  │
│  - Docker container             │
│  - Auto-restart on crash        │
└──────────────┬──────────────────┘
               │ SSL/TLS
┌──────────────▼──────────────────┐
│  Database (Supabase)            │
│  - PostgreSQL 13                │
│  - PostGIS 3                    │
│  - Automatic backups            │
└─────────────────────────────────┘
```

**All services have free tiers** ✅

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Model accuracy low | Medium | High | Use multiple data sources, tune hyperparameters |
| Data unavailable | Low | High | Download historical data early, cache locally |
| Database performance | Low | High | Create indices, use connection pooling |
| API latency | Low | Medium | Implement caching, optimize queries |

### Project Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Team member unavailable | Medium | High | Document everything, pair programming |
| Scope creep | High | High | Strictly enforce MVP scope |
| Deployment issues | Low | High | Test docker locally, deploy early |

---

## Resource Requirements

### Team (Ideal: 4 people)

```
├── Backend Developer (1)
│   └── API, Database, Model integration
├── Frontend Developer (1)
│   └── Dashboard, Map, Components
├── ML Engineer (1)
│   └── Models, Data pipeline, Feature engineering
└── DevOps/Deployment (0.5)
    └── Docker, Deployment, CI/CD
```

### Time Estimate

| Component | Hours | Notes |
|-----------|-------|-------|
| Backend | 80-100 | API + DB + ML integration |
| Frontend | 60-80 | Dashboard + Map |
| ML Pipeline | 40-60 | Data + Models + Training |
| Testing | 20-30 | Unit + Integration tests |
| Deployment | 10-20 | Docker + Cloud setup |
| Documentation | 10-15 | README + Guides |
| **Total** | **230-305** | 6-8 weeks for 1 person team |

---

## Conclusion

**AquaSentinel MVP is ambitious but achievable in 6-8 weeks.**

Key to success:
1. ✅ Start with 1 region only
2. ✅ Use proven technologies (XGBoost, React, FastAPI)
3. ✅ Automate everything (CI/CD, deployments)
4. ✅ Test early and often
5. ✅ Deploy early (Week 4-5)
6. ✅ Polish in Week 6-8

**Ready to build? Let's go! 🚀💧**

---

**Document Version:** 1.0  
**Created:** August 27, 2026  
**For:** Smart India Hackathon 2026
