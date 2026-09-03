import type {
  AlertItem,
  ForecastHorizonData,
  HourlyForecastItem,
  InundationZone,
  OverallRiskData,
  WeatherObservation,
  WeatherStation,
} from '../types';
import {
  HORIZON_FORECASTS,
  INITIAL_WEATHER_OBSERVATION,
  MOCK_ALERTS,
  MOCK_HOURLY_FORECAST,
  MOCK_INUNDATION_ZONES,
  MOCK_OVERALL_RISK,
  MOCK_WEATHER_STATIONS,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Service to retrieve weather and inundation risk data.
 * Gracefully falls back to real mock data if backend server is not reachable.
 */
export const weatherApi = {
  async getWeatherObservations(regionId: string): Promise<{ observation: WeatherObservation; stations: WeatherStation[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/rainfall?region=${regionId}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        observation: {
          currentRainfallMm: data.current_rainfall_mm ?? INITIAL_WEATHER_OBSERVATION.currentRainfallMm,
          cumulative6hMm: data.cumulative_6h ?? INITIAL_WEATHER_OBSERVATION.cumulative6hMm,
          temperatureC: data.temperature ?? INITIAL_WEATHER_OBSERVATION.temperatureC,
          humidityPercent: data.humidity ?? INITIAL_WEATHER_OBSERVATION.humidityPercent,
          pressureHpa: data.pressure ?? INITIAL_WEATHER_OBSERVATION.pressureHpa,
          windSpeedKmh: data.wind_speed ?? INITIAL_WEATHER_OBSERVATION.windSpeedKmh,
          windDirection: data.wind_direction ?? INITIAL_WEATHER_OBSERVATION.windDirection,
          intensityLabel: data.current_rainfall_mm > 50 ? 'Extremely Heavy' : data.current_rainfall_mm > 20 ? 'Heavy' : 'Moderate',
          lastUpdated: new Date().toLocaleTimeString() + ' (Live API)',
        },
        stations: MOCK_WEATHER_STATIONS,
      };
    } catch {
      // Mock Fallback
      return {
        observation: INITIAL_WEATHER_OBSERVATION,
        stations: MOCK_WEATHER_STATIONS,
      };
    }
  },

  async getHorizonForecast(regionId: string, horizonHours: number): Promise<ForecastHorizonData> {
    try {
      const res = await fetch(`${API_BASE_URL}/forecast?region=${regionId}&horizon=${horizonHours}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        horizonHours,
        label: `+${horizonHours} Hours Horizon`,
        predictedRainfallMm: data.predicted_rainfall_mm,
        confidence: data.confidence,
        inundationProbability: data.inundation_prob ?? 0.75,
        riskLevel: data.predicted_rainfall_mm > 100 ? 'SEVERE' : data.predicted_rainfall_mm > 50 ? 'HIGH' : 'MODERATE',
        forecastTime: data.forecast_time || new Date().toISOString(),
      };
    } catch {
      return HORIZON_FORECASTS[horizonHours] || HORIZON_FORECASTS[6];
    }
  },

  async getOverallRisk(regionId: string): Promise<OverallRiskData> {
    try {
      const res = await fetch(`${API_BASE_URL}/risk?region=${regionId}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        overallRisk: data.overall_risk,
        riskScorePercent: Math.round((data.rainfall_risk * 0.5 + data.inundation_risk * 0.5) * 100),
        rainfallContribution: Math.round(data.rainfall_risk * 100),
        inundationContribution: Math.round(data.inundation_risk * 100),
        modelConfidence: Math.round(data.confidence * 100),
        leadTimeHours: 3.5,
      };
    } catch {
      return MOCK_OVERALL_RISK;
    }
  },

  async getInundationZones(_regionId: string): Promise<InundationZone[]> {
    return MOCK_INUNDATION_ZONES;
  },

  async getActiveAlerts(regionId: string): Promise<AlertItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts?region=${regionId}&status=active`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data.alerts) && data.alerts.length > 0) {
        return data.alerts.map((a: any) => ({
          id: a.alert_id,
          severity: a.risk_level,
          title: `Alert ${a.alert_id}: Heavy rainfall (${a.rainfall_mm}mm)`,
          affectedWards: ['Pune Center', 'Mutha Basin'],
          issuedAt: a.issued_at,
          validUntil: 'Pending review',
          impact: `Predicted rainfall ${a.rainfall_mm}mm`,
          recommendations: ['Check local drainage', 'Follow civil defense guidelines'],
          status: 'active',
        }));
      }
      return MOCK_ALERTS;
    } catch {
      return MOCK_ALERTS;
    }
  },

  getHourlyForecast(): HourlyForecastItem[] {
    return MOCK_HOURLY_FORECAST;
  },
};
