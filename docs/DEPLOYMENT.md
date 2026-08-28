# AquaSentinel Deployment Guide

**Version:** 1.0  
**Last Updated:** August 27, 2026  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Docker Deployment](#docker-deployment)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Backend Deployment (Render/Railway)](#backend-deployment-renderrailway)
7. [Database Setup (Supabase/RDS)](#database-setup-supabserds)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Scaling & Performance](#scaling--performance)
10. [Monitoring & Logging](#monitoring--logging)
11. [Backup & Recovery](#backup--recovery)
12. [Troubleshooting](#troubleshooting)

---

## Overview

AquaSentinel is deployed across multiple cloud services for scalability and reliability:

- **Frontend**: Vercel (global CDN, auto-scaling)
- **Backend API**: Render or Railway (containerized)
- **Database**: Supabase (managed PostgreSQL + PostGIS) or AWS RDS
- **ML Models**: Stored in cloud storage (S3/GCS)
- **Cache**: Redis (optional, on Render/Railway)

```
┌─────────────────────────────────────┐
│    Frontend (Vercel CDN)            │
│    - React application              │
│    - Static assets cached           │
│    - Auto-scaling                   │
└──────────────┬──────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────┐
│    Backend API (Render/Railway)     │
│    - FastAPI application            │
│    - Uvicorn ASGI server            │
│    - Auto-restart on failure        │
└──────────────┬──────────────────────┘
               │ SSL/TLS
┌──────────────▼──────────────────────┐
│  Database (Supabase/RDS)            │
│  - PostgreSQL 13+                   │
│  - PostGIS extension                │
│  - Automated backups                │
│  - Connection pooling               │
└─────────────────────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Object Storage (S3/GCS)            │
│  - ML model weights                 │
│  - Data archives                    │
│  - Backup files                     │
└─────────────────────────────────────┘
```

---

## Prerequisites

### Required Accounts
- [ ] GitHub account (for code hosting)
- [ ] Vercel account (frontend)
- [ ] Render or Railway account (backend)
- [ ] Supabase or AWS RDS account (database)
- [ ] AWS S3 or Google Cloud Storage account (object storage)
- [ ] SendGrid or Twilio account (notifications, optional)

### Required Tools
- Docker & Docker Compose
- Git
- Python 3.9+
- Node.js 16+
- PostgreSQL client (psql) - for local testing

### Domain Requirements
- Domain name (optional but recommended)
- SSL certificate (auto-provisioned by platforms)

---

## Environment Setup

### 1. Create Environment Files

**Production `.env` file:**

```bash
# Backend Configuration
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secret-key-here-change-this

# Database
DATABASE_URL=postgresql://user:password@host:5432/aquasentinel_db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# API Configuration
API_V1_PREFIX=/api/v1
CORS_ORIGINS=["https://aquasentinel.dev", "https://www.aquasentinel.dev"]
ALLOWED_HOSTS=["aquasentinel.dev", "www.aquasentinel.dev", "api.aquasentinel.dev"]

# ML Models
ML_MODEL_PATH=/app/models
RAINFALL_MODEL=rainfall_xgboost.pkl
INUNDATION_MODEL=inundation_xgboost.pkl
MODEL_CACHE_TTL=3600

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/aquasentinel/app.log

# Data Sources (API Keys)
IMD_API_KEY=your-imd-key
INSAT_USERNAME=your-insat-user
INSAT_PASSWORD=your-insat-pass
ERA5_API_KEY=your-era5-key
NASA_API_KEY=your-nasa-key

# Notifications
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# AWS S3 / Google Cloud Storage
STORAGE_TYPE=s3  # or 'gcs'
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=aquasentinel-data
AWS_REGION=ap-south-1

# Frontend URL
FRONTEND_URL=https://aquasentinel.dev
BACKEND_URL=https://api.aquasentinel.dev
```

### 2. Secure Secrets

**Never commit `.env` to git!**

Use environment variables in deployment platforms:

**Vercel:**
```bash
vercel env add REACT_APP_API_URL https://api.aquasentinel.dev
```

**Render:**
```bash
# Set via Render Dashboard > Environment
```

---

## Docker Deployment

### 1. Build Images

**Backend Image:**

```bash
# Navigate to backend directory
cd backend

# Build image
docker build -t aquasentinel-backend:latest .

# Tag for registry (replace with your registry)
docker tag aquasentinel-backend:latest docker.io/username/aquasentinel-backend:latest

# Push to Docker Hub
docker push docker.io/username/aquasentinel-backend:latest
```

**Frontend Image (Optional):**

```bash
cd frontend

docker build -t aquasentinel-frontend:latest .
docker tag aquasentinel-frontend:latest docker.io/username/aquasentinel-frontend:latest
docker push docker.io/username/aquasentinel-frontend:latest
```

### 2. Production Docker Compose

**docker-compose.prod.yml:**

```yaml
version: '3.8'

services:
  backend:
    image: docker.io/username/aquasentinel-backend:latest
    container_name: aquasentinel_backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
      - DEBUG=false
    depends_on:
      - db
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - aquasentinel_network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgis/postgis:13-3.1
    container_name: aquasentinel_db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: aquasentinel_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - aquasentinel_network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  redis:
    image: redis:7-alpine
    container_name: aquasentinel_redis
    restart: always
    networks:
      - aquasentinel_network

volumes:
  postgres_data:
    driver: local

networks:
  aquasentinel_network:
    driver: bridge
```

### 3. Deploy with Docker Compose

```bash
# Pull latest images
docker-compose pull

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## Frontend Deployment (Vercel)

### 1. Connect GitHub Repository

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure build settings

### 2. Build Settings

**Framework Preset:** Next.js (or your framework)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

### 3. Environment Variables

In Vercel Dashboard:

```
REACT_APP_API_URL = https://api.aquasentinel.dev
REACT_APP_ENV = production
```

### 4. Deploy

```bash
# Using Vercel CLI
vercel deploy --prod

# Or: Push to GitHub main branch (auto-deploy)
git push origin main
```

### 5. Custom Domain

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records

```
CNAME aquasentinel.dev → cname.vercel-dns.com
```

---

## Backend Deployment (Render/Railway)

### Option A: Render

#### 1. Connect Repository

1. Go to [Render](https://render.com)
2. Click "New+" > "Web Service"
3. Select your GitHub repository
4. Configure:

**Name:** aquasentinel-backend  
**Environment:** Docker  
**Auto-deploy:** Yes  
**Branch:** main  

#### 2. Environment Variables

```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ENVIRONMENT=production
```

#### 3. Deploy

Click "Create Web Service" → Render auto-deploys on push to main

### Option B: Railway

#### 1. Connect Repository

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "GitHub Repo"
4. Configure build command

#### 2. Build Command

```bash
pip install -r requirements.txt
```

#### 3. Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### 4. Deploy

Railway auto-deploys on push to main branch

---

## Database Setup (Supabase/RDS)

### Option A: Supabase (Recommended)

#### 1. Create Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Configure:
   - **Name:** aquasentinel
   - **Database Password:** (strong password)
   - **Region:** ap-south-1 (India)

#### 2. Enable PostGIS

```sql
-- In SQL Editor
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

#### 3. Initialize Schema

Run migrations:

```bash
# Local connection to Supabase
psql "postgresql://postgres:password@host:6543/postgres" -f backend/db/init.sql
```

#### 4. Get Connection String

From Supabase Dashboard > Settings > Database

```
postgresql://postgres:password@host:5432/aquasentinel
```

### Option B: AWS RDS

#### 1. Create RDS Instance

AWS Console > RDS > Create Database

**Engine:** PostgreSQL 13.7  
**DB Instance Class:** db.t3.small (or larger)  
**Storage:** 20 GB (auto-scaling enabled)  
**Backup:** 30 days  
**Multi-AZ:** Yes (for production)  

#### 2. Enable PostGIS

```bash
# Connect to RDS instance
psql -h endpoint -U postgres -d postgres

# Run commands
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

#### 3. Create Database User

```sql
CREATE USER aquasentinel_user WITH PASSWORD 'strong_password';
CREATE DATABASE aquasentinel_db OWNER aquasentinel_user;

GRANT CONNECT ON DATABASE aquasentinel_db TO aquasentinel_user;
GRANT USAGE ON SCHEMA public TO aquasentinel_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO aquasentinel_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO aquasentinel_user;
```

#### 4. Run Migrations

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://aquasentinel_user:password@rds-endpoint:5432/aquasentinel_db"

# Run migrations
python -m alembic upgrade head
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy AquaSentinel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest tests/ --cov=app

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node
        uses: actions/setup-node@v2
        with:
          node-version: 16
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Run tests
        run: |
          cd frontend
          npm test

  build-backend:
    needs: test-backend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: |
          cd backend
          docker build -t aquasentinel-backend:${{ github.sha }} .
      - name: Push to Docker Hub
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
          docker tag aquasentinel-backend:${{ github.sha }} docker.io/username/aquasentinel-backend:latest
          docker push docker.io/username/aquasentinel-backend:latest

  deploy:
    needs: [build-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }} -X POST
```

---

## Scaling & Performance

### Horizontal Scaling

**Backend:**
```
Render/Railway auto-scales based on:
- CPU usage > 80%
- Memory usage > 85%
- Request latency > 1s
```

**Database:**
```
Supabase auto-scales:
- Connection pooling (PgBouncer)
- Read replicas for high traffic
```

### Caching Strategy

**Redis Configuration:**
```python
# app/config.py
REDIS_URL = "redis://localhost:6379/0"
CACHE_TTL = 3600  # 1 hour

# Cache layers:
# 1. Forecast data: 1 hour
# 2. Rainfall observations: 30 minutes
# 3. Risk classifications: 15 minutes
# 4. Static data: 24 hours
```

### Database Optimization

```sql
-- Create indices for common queries
CREATE INDEX idx_rainfall_region_time ON rainfall_observations(region_id, timestamp DESC);
CREATE INDEX idx_forecast_region_time ON rainfall_forecasts(region_id, forecast_time DESC);
CREATE INDEX idx_alerts_region_time ON alerts(region_id, issued_at DESC);

-- Spatial indices
CREATE INDEX idx_regions_geom ON regions USING GIST(geometry);
CREATE INDEX idx_inundation_zones ON inundation_predictions USING GIST(affected_area);
```

---

## Monitoring & Logging

### Application Monitoring

**Uptime Monitoring:**
```bash
# Using Better Uptime
curl https://betterstack.com/api/uptime/monitoring/checks \
  -X POST \
  -H "Authorization: Bearer your-api-key" \
  -d '{"url": "https://api.aquasentinel.dev/health"}'
```

**Error Tracking:**
- Sentry: https://sentry.io (recommended)
- Rollbar: https://rollbar.com
- Datadog: https://www.datadoghq.com

### Logging

**ELK Stack (Optional):**
```yaml
# docker-compose includes Elasticsearch, Logstash, Kibana
# Logs flow: Application → Logstash → Elasticsearch → Kibana
```

**CloudWatch (AWS):**
```python
# app/utils/logger.py
import logging
import boto3

client = boto3.client('logs')

handler = logging.handlers.CloudWatchLogHandler(
    log_group='/aquasentinel/production',
    stream_name='backend'
)
```

### Metrics Collection

**Prometheus:**
```python
# app/api/metrics.py
from prometheus_client import Counter, Histogram

request_count = Counter('http_requests_total', 'Total requests')
request_latency = Histogram('http_request_duration_seconds', 'Request latency')

@app.get("/forecast")
def get_forecast(...):
    with request_latency.time():
        request_count.inc()
        # ... endpoint logic
```

---

## Backup & Recovery

### Database Backups

**Supabase (Automated):**
- Daily backups (30-day retention)
- Accessible from Dashboard

**RDS (Automated):**
```bash
# Manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier aquasentinel-db \
  --db-snapshot-identifier aquasentinel-backup-$(date +%Y%m%d)
```

### Model Backups

**S3 Versioning:**
```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket aquasentinel-data \
  --versioning-configuration Status=Enabled

# List versions
aws s3api list-object-versions --bucket aquasentinel-data
```

### Recovery Procedures

**Database Recovery:**
```bash
# Restore from Supabase backup
# Via Supabase Dashboard > Backups > Restore

# Or manual restoration
pg_restore -h new-host -U postgres -d aquasentinel_db backup.dump
```

**Backend Recovery:**
```bash
# Render: Automatic rollback available
# Dashboard > Deployments > Select previous version > Deploy

# Railway: Same process
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Fails

**Symptoms:**
```
Error: could not connect to server
```

**Solutions:**
```bash
# Check database URL format
echo $DATABASE_URL

# Verify connectivity
psql $DATABASE_URL -c "SELECT version();"

# Check firewall rules
# - Render/Railway IPs must be whitelisted on RDS
```

#### 2. Model Loading Fails

**Symptoms:**
```
Error: Model file not found in /app/models
```

**Solutions:**
```bash
# Check S3 bucket
aws s3 ls s3://aquasentinel-data/models/

# Verify MODEL_PATH environment variable
echo $ML_MODEL_PATH

# Download models manually
aws s3 cp s3://aquasentinel-data/models/rainfall_xgboost.pkl ./models/
```

#### 3. High Latency

**Symptoms:**
- Response time > 500ms

**Debug:**
```bash
# Check database query performance
EXPLAIN ANALYZE SELECT * FROM rainfall_forecasts WHERE region_id = 1;

# Monitor cache hit rate
redis-cli INFO stats | grep hit_rate

# Check API logs for slow endpoints
docker logs aquasentinel_backend | grep "duration"
```

#### 4. Out of Memory

**Symptoms:**
```
MemoryError: Unable to allocate memory
```

**Solutions:**
```bash
# Increase container limits
# Render: Settings > Environment > Memory

# Optimize model inference
# Use quantized models or batch processing
```

### Getting Help

1. **Check logs:** `docker logs container_name`
2. **Run health check:** `curl https://api.aquasentinel.dev/health`
3. **Contact support:** support@aquasentinel.dev
4. **GitHub Issues:** https://github.com/aquasentinel/aquasentinel/issues

---

## Rollback Procedures

### Emergency Rollback

**Vercel:**
```bash
# Via CLI
vercel rollback

# Or use Dashboard: Deployments > Select previous > Promote
```

**Render/Railway:**
```bash
# Dashboard > Deployments > Click previous > Deploy
```

**Database:**
```bash
# Supabase: Backups > Restore
# RDS: Snapshots > Create Instance
```

---

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] SSL certificates configured
- [ ] Database backups enabled
- [ ] Monitoring/alerting configured
- [ ] CI/CD pipeline working
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Disaster recovery plan documented

---

**Last Updated:** August 27, 2026  
**Document Version:** 1.0