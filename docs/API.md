# AquaSentinel API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8000/api/v1` (Development)  
**Base URL (Production):** `https://api.aquasentinel.dev/api/v1`  

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Error Handling](#error-handling)
4. [Forecast Endpoints](#forecast-endpoints)
5. [Rainfall Endpoints](#rainfall-endpoints)
6. [Inundation Endpoints](#inundation-endpoints)
7. [Risk Endpoints](#risk-endpoints)
8. [Alert Endpoints](#alert-endpoints)
9. [Health & Status Endpoints](#health--status-endpoints)
10. [Rate Limiting](#rate-limiting)
11. [Code Examples](#code-examples)

---

## Authentication

Currently, the API is **open for public use** without authentication. 

**Future versions will include:**
- API Key authentication
- JWT token-based access
- Role-based access control (RBAC)

---

## Response Format

All responses are in **JSON format** with the following structure:

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  },
  "timestamp": "2026-08-27T12:00:00Z",
  "request_id": "req_abc123def456"
}
```

### Error Response
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_REGION",
    "message": "Region code not found",
    "details": "Region 'xyz' does not exist in the database"
  },
  "timestamp": "2026-08-27T12:00:00Z",
  "request_id": "req_abc123def456"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid parameters or malformed request |
| 401 | Unauthorized | Missing/invalid API key (future) |
| 404 | Not Found | Resource doesn't exist (region, alert, etc.) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Database or ML model unavailable |

### Common Error Codes

| Error Code | HTTP Status | Description |
|-----------|-----------|-------------|
| `INVALID_REGION` | 400 | Region code is invalid or not found |
| `INVALID_PARAMETER` | 400 | Query parameter is invalid |
| `MISSING_PARAMETER` | 400 | Required parameter is missing |
| `MODEL_NOT_READY` | 503 | ML model is loading or unavailable |
| `DATABASE_ERROR` | 500 | Database connection or query failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests in a short time |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Forecast Endpoints

### Get Rainfall Forecast

Returns rainfall predictions for a selected region.

**Endpoint:**
```
GET /forecast
```

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `region` | string | Yes | Region code | `pune`, `mumbai`, `bangalore` |
| `horizon` | integer | No | Forecast hours (1, 3, 6, 24) | `6` (default) |

**Response:**

```json
{
  "status": "success",
  "data": {
    "region": "pune",
    "forecast_time": "2026-08-27T12:00:00Z",
    "horizon_hours": 6,
    "predictions": [
      {
        "timestamp": "2026-08-27T12:00:00Z",
        "predicted_rainfall_mm": 12.5,
        "rainfall_intensity": "MODERATE",
        "confidence": 0.87
      },
      {
        "timestamp": "2026-08-27T13:00:00Z",
        "predicted_rainfall_mm": 18.3,
        "rainfall_intensity": "HEAVY",
        "confidence": 0.84
      }
    ],
    "model_version": "v1.0-xgboost",
    "model_confidence": 0.87
  },
  "timestamp": "2026-08-27T12:00:00Z"
}
```

**Status Codes:** 200, 400, 404, 503

**Example Requests:**

```bash
# 6-hour forecast (default)
curl -X GET "http://localhost:8000/api/v1/forecast?region=pune"

# 24-hour forecast
curl -X GET "http://localhost:8000/api/v1/forecast?region=mumbai&horizon=24"

# 1-hour forecast
curl -X GET "http://localhost:8000/api/v1/forecast?region=bangalore&horizon=1"
```

---

## Rainfall Endpoints

### Get Current & Historical Rainfall

Returns observed rainfall data and historical records.

**Endpoint:**
```
GET /rainfall
```

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `region` | string | Yes | Region code | `pune` |
| `limit` | integer | No | Number of records (1-100) | `20` (default) |
| `hours_back` | integer | No | Hours of historical data | `24` (default) |

**Response:**

```json
{
  "status": "success",
  "data": {
    "region": "pune",
    "current_rainfall_mm": 12.5,
    "cumulative_rainfall_6h": 45.2,
    "cumulative_rainfall_24h": 120.5,
    "rainfall_rate_mm_per_hour": 6.3,
    "last_updated": "2026-08-27T12:00:00Z",
    "observations": [
      {
        "timestamp": "2026-08-27T12:00:00Z",
        "rainfall_mm": 12.5,
        "source": "IMD",
        "station_code": "PUNE_001",
        "confidence": 0.95
      },
      {
        "timestamp": "2026-08-27T11:00:00Z",
        "rainfall_mm": 8.3,
        "source": "INSAT",
        "confidence": 0.88
      }
    ]
  },
  "timestamp": "2026-08-27T12:00:00Z"
}
```

**Status Codes:** 200, 400, 404

**Example Requests:**

```bash
# Get current rainfall
curl -X GET "http://localhost:8000/api/v1/rainfall?region=pune"

# Get last 48 hours
curl -X GET "http://localhost:8000/api/v1/rainfall?region=pune&hours_back=48&limit=50"
```

### Process Rainfall Data

Trigger data processing and cache refresh.

**Endpoint:**
```
POST /rainfall/process
```

**Request Body:**

```json
{
  "region": "pune",
  "force_refresh": true
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "task_id": "task_xyz789",
    "status": "processing",
    "region": "pune",
    "message": "Data processing started"
  }
}
```

**Status Codes:** 201, 400, 503

---

## Inundation Endpoints

### Get Inundation Risk

Returns flood/inundation risk assessment for a region.

**Endpoint:**
```
GET /inundation
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region` | string | Yes | Region code |
| `include_zones` | boolean | No | Include risk zones geojson |

**Response:**

```json
{
  "status": "success",
  "data": {
    "region": "pune",
    "prediction_time": "2026-08-27T12:00:00Z",
    "inundation_probability": 0.72,
    "severity_level": "HIGH",
    "affected_area_km2": 125.4,
    "affected_population_estimate": 45000,
    "high_risk_zones": 8,
    "moderate_risk_zones": 12,
    "vulnerable_areas": [
      {
        "name": "Kalyani Nagar",
        "risk_level": "HIGH",
        "probability": 0.85,
        "elevation_m": 560,
        "drainage_capacity": "LOW"
      },
      {
        "name": "Shivaji Nagar",
        "risk_level": "HIGH",
        "probability": 0.78,
        "elevation_m": 545,
        "drainage_capacity": "MEDIUM"
      }
    ],
    "model_version": "v1.0-xgboost",
    "confidence": 0.82
  }
}
```

**Status Codes:** 200, 400, 404

**Example Requests:**

```bash
# Get inundation risk
curl -X GET "http://localhost:8000/api/v1/inundation?region=pune"

# Include risk zones
curl -X GET "http://localhost:8000/api/v1/inundation?region=pune&include_zones=true"
```

### Get Inundation Risk Zones (GeoJSON)

Returns geospatial boundaries of inundation-prone areas.

**Endpoint:**
```
GET /inundation/zones
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region` | string | Yes | Region code |
| `risk_level` | string | No | Filter by risk level (LOW, MODERATE, HIGH, SEVERE) |

**Response:** GeoJSON FeatureCollection

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "zone_id": "zone_001",
        "name": "Kalyani Nagar Risk Zone",
        "risk_level": "HIGH",
        "inundation_probability": 0.85,
        "affected_area_km2": 15.2,
        "population": 12000
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[73.85, 18.55], [73.87, 18.55], [73.87, 18.53], [73.85, 18.53], [73.85, 18.55]]
        ]
      }
    }
  ]
}
```

**Status Codes:** 200, 400, 404

**Example Requests:**

```bash
# All zones
curl -X GET "http://localhost:8000/api/v1/inundation/zones?region=pune"

# Only high-risk zones
curl -X GET "http://localhost:8000/api/v1/inundation/zones?region=pune&risk_level=HIGH"
```

---

## Risk Endpoints

### Get Regional Risk Level

Returns aggregated risk assessment for a region.

**Endpoint:**
```
GET /risk
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region` | string | Yes | Region code |

**Response:**

```json
{
  "status": "success",
  "data": {
    "region": "pune",
    "classification_time": "2026-08-27T12:00:00Z",
    "overall_risk": "HIGH",
    "risk_score": 0.78,
    "rainfall_risk": 0.85,
    "rainfall_risk_level": "HIGH",
    "inundation_risk": 0.72,
    "inundation_risk_level": "HIGH",
    "confidence": 0.82,
    "risk_factors": [
      {
        "factor": "Heavy rainfall expected",
        "contribution": 0.4,
        "predicted_rainfall_mm": 145
      },
      {
        "factor": "High probability of waterlogging",
        "contribution": 0.35,
        "waterlogging_probability": 0.81
      },
      {
        "factor": "Poor drainage in low-lying areas",
        "contribution": 0.25
      }
    ],
    "recommendations": [
      "Monitor weather updates closely",
      "Prepare evacuation routes",
      "Alert residents in vulnerable areas",
      "Deploy rescue teams on standby"
    ]
  }
}
```

**Status Codes:** 200, 400, 404

**Example Requests:**

```bash
curl -X GET "http://localhost:8000/api/v1/risk?region=pune"
```

### Get Risk Classification

Classify risk based on rainfall and inundation parameters.

**Endpoint:**
```
GET /risk/classify
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rainfall_mm` | float | Yes | Predicted rainfall amount |
| `inundation_probability` | float | Yes | Inundation probability (0-1) |

**Response:**

```json
{
  "status": "success",
  "data": {
    "rainfall_mm": 145,
    "inundation_probability": 0.81,
    "risk_level": "SEVERE",
    "risk_score": 0.92,
    "description": "Extreme rainfall with high inundation probability",
    "recommended_actions": [
      "Immediate action recommended",
      "Activate emergency protocols",
      "Begin evacuation procedures",
      "Deploy all available resources"
    ]
  }
}
```

**Status Codes:** 200, 400

---

## Alert Endpoints

### Get Alerts

Returns active and historical warnings.

**Endpoint:**
```
GET /alerts
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region` | string | Yes | Region code |
| `status` | string | No | Filter by status (active, resolved, all) |
| `limit` | integer | No | Number of records |

**Response:**

```json
{
  "status": "success",
  "data": {
    "total_alerts": 3,
    "active_alerts": 1,
    "alerts": [
      {
        "alert_id": "alert_001",
        "region": "pune",
        "alert_type": "HEAVY_RAINFALL",
        "risk_level": "SEVERE",
        "status": "ACTIVE",
        "predicted_rainfall_mm": 145,
        "inundation_probability": 0.81,
        "warning_lead_time_minutes": 120,
        "high_risk_zones": 7,
        "issued_at": "2026-08-27T10:00:00Z",
        "expires_at": "2026-08-27T16:00:00Z",
        "confidence": 0.87,
        "recommended_actions": [
          "Monitor weather updates",
          "Prepare evacuation routes",
          "Alert residents in vulnerable areas"
        ]
      },
      {
        "alert_id": "alert_002",
        "region": "pune",
        "alert_type": "WATERLOGGING",
        "risk_level": "HIGH",
        "status": "RESOLVED",
        "predicted_rainfall_mm": 85,
        "inundation_probability": 0.65,
        "issued_at": "2026-08-26T14:00:00Z",
        "resolved_at": "2026-08-27T06:00:00Z"
      }
    ]
  }
}
```

**Status Codes:** 200, 400, 404

**Example Requests:**

```bash
# Get all alerts
curl -X GET "http://localhost:8000/api/v1/alerts?region=pune"

# Get only active alerts
curl -X GET "http://localhost:8000/api/v1/alerts?region=pune&status=active"

# Get last 50 alerts
curl -X GET "http://localhost:8000/api/v1/alerts?region=pune&limit=50&status=all"
```

### Acknowledge Alert

Mark an alert as acknowledged.

**Endpoint:**
```
POST /alerts/{alert_id}/acknowledge
```

**Request Body:**

```json
{
  "acknowledged_by": "officer_name",
  "notes": "Evacuation started"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "alert_id": "alert_001",
    "acknowledged_at": "2026-08-27T12:30:00Z",
    "acknowledged_by": "officer_name",
    "notes": "Evacuation started"
  }
}
```

**Status Codes:** 200, 400, 404

**Example Requests:**

```bash
curl -X POST "http://localhost:8000/api/v1/alerts/alert_001/acknowledge" \
  -H "Content-Type: application/json" \
  -d '{
    "acknowledged_by": "officer_001",
    "notes": "Team deployed to high-risk zones"
  }'
```

---

## Health & Status Endpoints

### Health Check

Get API and system health status.

**Endpoint:**
```
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "checks": {
    "api": "healthy",
    "database": "healthy",
    "models_loaded": true,
    "cache": "healthy"
  },
  "details": {
    "api_version": "v1.0",
    "deployment": "production",
    "uptime_hours": 48.5,
    "last_restart": "2026-08-25T12:00:00Z"
  },
  "timestamp": "2026-08-27T12:00:00Z"
}
```

**Status Codes:** 200, 503

**Example Requests:**

```bash
curl -X GET "http://localhost:8000/health"
```

### API Status

Get detailed API status information.

**Endpoint:**
```
GET /status
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "api_status": "operational",
    "version": "1.0.0",
    "deployment_time": "2026-08-25T12:00:00Z",
    "endpoints_available": 12,
    "supported_regions": 28,
    "models": {
      "rainfall": {
        "status": "ready",
        "version": "v1.0-xgboost",
        "last_trained": "2026-08-20T00:00:00Z"
      },
      "inundation": {
        "status": "ready",
        "version": "v1.0-xgboost",
        "last_trained": "2026-08-20T00:00:00Z"
      }
    }
  }
}
```

**Status Codes:** 200

---

## Rate Limiting

### Current Policy

- **Free Tier**: 100 requests per hour per IP
- **Authorized Users**: 1000 requests per hour
- **Enterprise**: Unlimited (custom)

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1598822400
```

### Response When Limited

```
HTTP/1.1 429 Too Many Requests

{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "reset_time": "2026-08-27T13:00:00Z"
  }
}
```

---

## Code Examples

### Python (Requests)

```python
import requests
import json

base_url = "http://localhost:8000/api/v1"

# Get rainfall forecast
response = requests.get(
    f"{base_url}/forecast",
    params={"region": "pune", "horizon": 6}
)
forecast = response.json()
print(json.dumps(forecast, indent=2))

# Get inundation risk
response = requests.get(
    f"{base_url}/inundation",
    params={"region": "pune"}
)
inundation = response.json()
print(inundation["data"]["inundation_probability"])

# Get alerts
response = requests.get(
    f"{base_url}/alerts",
    params={"region": "pune", "status": "active"}
)
alerts = response.json()
for alert in alerts["data"]["alerts"]:
    print(f"Alert: {alert['alert_id']} - {alert['risk_level']}")
```

### JavaScript (Fetch)

```javascript
const baseUrl = "http://localhost:8000/api/v1";

// Get rainfall forecast
async function getForecast(region, horizon = 6) {
  try {
    const response = await fetch(
      `${baseUrl}/forecast?region=${region}&horizon=${horizon}`
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get risk
async function getRisk(region) {
  try {
    const response = await fetch(`${baseUrl}/risk?region=${region}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Usage
getForecast("pune", 6).then(forecast => {
  console.log(forecast);
});
```

### cURL

```bash
# Forecast
curl -X GET "http://localhost:8000/api/v1/forecast?region=pune&horizon=6" \
  -H "Accept: application/json"

# Inundation
curl -X GET "http://localhost:8000/api/v1/inundation?region=pune" \
  -H "Accept: application/json"

# Risk
curl -X GET "http://localhost:8000/api/v1/risk?region=pune" \
  -H "Accept: application/json"

# Alerts
curl -X GET "http://localhost:8000/api/v1/alerts?region=pune&status=active" \
  -H "Accept: application/json"

# Health
curl -X GET "http://localhost:8000/health" \
  -H "Accept: application/json"
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

interface Forecast {
  region: string;
  horizon_hours: number;
  predicted_rainfall_mm: number;
  confidence: number;
}

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1'
});

async function getForecast(region: string, horizon: number = 6): Promise<Forecast> {
  try {
    const response = await api.get('/forecast', {
      params: { region, horizon }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

// Usage
getForecast('pune', 24).then(forecast => {
  console.log(`Rainfall prediction: ${forecast.predicted_rainfall_mm}mm`);
});
```

---

## Pagination

For endpoints that return lists (alerts, rainfall history), pagination is supported:

**Query Parameters:**
```
?page=1&per_page=20
```

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## Versioning

Current API Version: **v1**

Next versions planned:
- **v2** - GraphQL support, enhanced filtering, webhooks
- **v3** - Real-time WebSocket support, advanced analytics

---

## Support & Issues

- **API Status Page:** https://status.aquasentinel.dev
- **Bug Reports:** [GitHub Issues](https://github.com/aquasentinel/aquasentinel/issues)
- **Email:** support@aquasentinel.dev

---

**Last Updated:** August 27, 2026  
**API Version:** 1.0