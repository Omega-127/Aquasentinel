export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export interface WeatherObservation {
  currentRainfallMm: number;
  cumulative6hMm: number;
  temperatureC: number;
  humidityPercent: number;
  pressureHpa: number;
  windSpeedKmh: number;
  windDirection: string;
  intensityLabel: 'Light' | 'Moderate' | 'Heavy' | 'Extremely Heavy';
  lastUpdated: string;
}

export interface WeatherStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rainfallCurrent: number;
  status: 'active' | 'warning' | 'offline';
}

export interface ForecastHorizonData {
  horizonHours: number; // 1, 3, 6, 24
  label: string;
  predictedRainfallMm: number;
  confidence: number; // 0.0 - 1.0
  inundationProbability: number;
  riskLevel: RiskLevel;
  forecastTime: string;
}

export interface HourlyForecastItem {
  hour: string;
  predictedMm: number;
  riskProb: number;
  thresholdWarn: number;
  thresholdDanger: number;
}

export interface InundationZone {
  id: string;
  wardName: string;
  severity: RiskLevel;
  waterDepthMeters: number;
  probability: number;
  elevationMsl: number;
  coordinates: [number, number][]; // Polygon lat-lngs
}

export interface RiverDrainageLine {
  id: string;
  name: string;
  coordinates: [number, number][];
}

export interface AlertItem {
  id: string;
  severity: RiskLevel;
  title: string;
  affectedWards: string[];
  issuedAt: string;
  validUntil: string;
  impact: string;
  recommendations: string[];
  status: 'active' | 'resolved';
}

export interface OverallRiskData {
  overallRisk: RiskLevel;
  riskScorePercent: number; // 0-100
  rainfallContribution: number;
  inundationContribution: number;
  modelConfidence: number;
  leadTimeHours: number;
}

export interface RegionInfo {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  dangerRainfallThreshold: number; // mm in 6hr
}
