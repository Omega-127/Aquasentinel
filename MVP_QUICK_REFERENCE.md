# 🚀 AquaSentinel MVP - Quick Reference

**For SIH 2026 Hackathon**

---

## What's in the MVP?

### ✅ Must Have Features
1. **Rainfall Forecasting** - Predict rainfall for next 1/3/6/24 hours
2. **Inundation Risk** - Estimate flood probability for vulnerable areas
3. **Risk Classification** - Categorize risk into LOW/MODERATE/HIGH/SEVERE
4. **Interactive Map** - Display predictions on Leaflet map
5. **Alert System** - Generate automated alerts when risk is HIGH+
6. **Web Dashboard** - Show all data in one place

### ❌ Not in MVP (Do Later)
- SMS/Email notifications
- Multiple cities (just 1 city for MVP)
- Mobile app
- Real-time satellite processing
- Advanced ensemble models

---

## Technology Stack

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | React + TypeScript + Tailwind + Leaflet | Fast, easy, no API key needed |
| **Backend** | FastAPI + Python | Very fast, auto-docs, ML-friendly |
| **Database** | PostgreSQL + PostGIS | Reliable, spatial queries |
| **ML** | XGBoost only | Fast, accurate, production-ready |
| **Deploy** | Vercel (frontend) + Render (backend) + Supabase (DB) | Free tiers, easy setup |

---

## Development Timeline

```
Week 1-2: Setup
├── FastAPI + React projects
├── Local development environment
└── docker-compose working

Week 2-3: Data & Models  
├── Download historical rainfall (5 years)
├── Train XGBoost models
└── Export models to pickle

Week 3-4: Backend API
├── Create 5 database tables
├── Build 5 API endpoints
└── Integrate ML models

Week 4-5: Frontend Dashboard
├── Build Leaflet map
├── Create metric cards
├── Connect to backend API

Week 5-6: Testing & Docker
├── Unit tests
├── Integration tests
├── Docker setup

Week 6-8: Polish & Deploy
├── Deploy to Vercel + Render + Supabase
├── Final testing
└── Documentation
```

---

## API Endpoints (MVP = 5 endpoints)

```
1. GET /forecast?region=pune&horizon=6
   → Predicts rainfall for next 6 hours

2. GET /inundation?region=pune
   → Estimates flood probability

3. GET /risk?region=pune
   → Overall risk classification

4. GET /alerts?region=pune&status=active
   → Shows current warnings

5. GET /rainfall?region=pune
   → Current weather observations

That's it! No POST, no authentication.
```

---

## Database (MVP = 5 tables only)

```sql
1. regions (city data)
2. rainfall_observations (historical data)
3. rainfall_forecasts (predictions)
4. inundation_predictions (flood risk)
5. alerts (warnings)
```

---

## Frontend Components (6 components)

```
1. MapContainer
   - Leaflet map
   - Rainfall heatmap
   - Risk zones overlay

2. MetricsDisplay
   - Current rainfall
   - Temperature, humidity
   - Wind speed

3. RiskGauge
   - Circular progress
   - Risk level (LOW/MODERATE/HIGH/SEVERE)

4. AlertsPanel
   - Active warnings list
   - Risk level badges

5. ForecastChart
   - Line chart (next 24 hours)
   - Rainfall predictions

6. RegionSelector
   - Dropdown menu
   - 3-5 cities
```

---

## ML Models (2 models)

### Model 1: Rainfall Prediction (XGBoost)
- Input: Historical rainfall + weather variables
- Output: Predicted rainfall (mm)
- Target: MAE < 15mm, R² > 0.75

### Model 2: Inundation Classification (XGBoost)
- Input: Rainfall + terrain + drainage
- Output: Flood probability (0-1)
- Target: Precision > 80%, Recall > 70%

### Model 3: Risk Classification (Rule-based)
```python
if rainfall > 100 and inundation_prob > 0.7:
    risk = "SEVERE"
elif rainfall > 50 or inundation_prob > 0.6:
    risk = "HIGH"
# ... etc
```

---

## Data Requirements

### Training Data
- Historical rainfall: 5 years (2019-2024)
- Weather variables: temp, humidity, pressure, wind
- Sources: IMD, ERA5 (free datasets)
- Volume: ~45,000 hourly records

### Real-time Data
- Rainfall: Hourly from IMD
- Weather forecasts: Every 6 hours
- DEM/Drainage: Static (load once)

---

## Success Metrics

### Technical
- API response time: < 200ms ✅
- Rainfall accuracy: MAE < 15mm ✅
- Inundation precision: > 80% ✅
- Model training: < 1 hour ✅

### User-Facing
- Dashboard load: < 2 seconds ✅
- Map responsiveness: Instant ✅
- Alert accuracy: < 10% false alarms ✅

---

## File Structure (Minimal)

```
aquasentinel/
├── frontend/
│   ├── src/
│   │   ├── components/     (6 components)
│   │   ├── services/       (API client)
│   │   └── types/          (TypeScript)
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/v1/         (5 endpoints)
│   │   ├── services/       (Business logic)
│   │   ├── models/         (DB models)
│   │   └── ml/             (Model loading)
│   ├── tests/
│   └── requirements.txt
│
├── ml/
│   ├── data/               (Data pipeline)
│   ├── models/             (Model training)
│   └── scripts/            (train_models.py)
│
└── docker-compose.yml
```

---

## Deployment (All Free Tiers)

```
Frontend: Vercel
  ├── Deploy React SPA
  ├── Auto-deploy from GitHub
  └── Free tier: 5 deployments/day

Backend: Render
  ├── Run FastAPI in Docker
  ├── Auto-restart on crash
  └── Free tier: 1 instance

Database: Supabase
  ├── PostgreSQL + PostGIS
  ├── Automated backups
  └── Free tier: 500 MB
```

---

## Critical Success Factors

1. **Start with 1 city only** (don't try multi-region)
2. **Use proven tech** (not bleeding-edge frameworks)
3. **Deploy early** (Week 4-5, not Week 8)
4. **Test thoroughly** (catch bugs before demo)
5. **Document everything** (README + API docs)

---

## Common Pitfalls to Avoid

❌ Don't add SMS/email notifications (Phase 2)  
❌ Don't try multiple cities (Phase 2)  
❌ Don't use LSTM/Transformers (XGBoost is enough)  
❌ Don't add user authentication (Phase 2)  
❌ Don't wait till Week 8 to deploy  
❌ Don't over-engineer the database  

---

## Quick Commands

```bash
# Backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
npm install
npm start

# Database (Local)
docker-compose up db

# All Services
docker-compose up

# Tests
pytest backend/tests/
npm test frontend/
```

---

## Files to Create First

**Priority Order:**

```
Week 1:
1. .env.example
2. .gitignore
3. frontend/package.json
4. backend/requirements.txt
5. docker-compose.yml

Week 2:
6. ML data loaders
7. XGBoost training scripts

Week 3:
8. FastAPI app (main.py)
9. Database models
10. API endpoints

Week 4:
11. React components
12. API services
13. Leaflet map

Week 5+:
14. Tests
15. Docker files
16. Documentation
```

---

## Team Assignment Example

```
Developer 1 (Backend):
  - API endpoints
  - Database models
  - Model loading/inference

Developer 2 (Frontend):
  - Map component
  - Dashboard cards
  - API integration

Developer 3 (ML):
  - Data pipeline
  - Model training
  - Model evaluation

DevOps (0.5 person):
  - Docker setup
  - Deployment
  - CI/CD
```

---

## Testing Checklist

Frontend:
- [ ] Map loads correctly
- [ ] API data displays
- [ ] Alerts panel works
- [ ] Responsive on mobile

Backend:
- [ ] All 5 endpoints return 200
- [ ] Invalid region returns 404
- [ ] Models load successfully
- [ ] Response time < 200ms

Database:
- [ ] Can connect locally
- [ ] Queries return data
- [ ] Indices created

ML:
- [ ] Models train successfully
- [ ] Predictions reasonable
- [ ] Accuracy targets met

---

## Demo Preparation

```
1. Prepare sample data
   - Real rainfall data for city
   - Pre-generated alerts
   - Historical trends

2. Create demo script
   - Show map
   - Trigger alert
   - Explain predictions

3. Practice walkthrough
   - 5 minutes total
   - Focus on key features
   - Be ready for questions

4. Have backups
   - Screenshots
   - Recorded demo
   - Offline data
```

---

## Resources

- **Code**: GitHub (aquasentinel/aquasentinel)
- **Data**: IMD, Copernicus, NASA (free)
- **Hosting**: Vercel, Render, Supabase (free)
- **Docs**: See /docs folder (API.md, DEPLOYMENT.md, etc.)

---

**You've got this! 🎉**

Build fast, test often, deploy early.

**Start coding today! 🚀💧**

