import type {
  AlertItem,
  ForecastHorizonData,
  HourlyForecastItem,
  InundationZone,
  OverallRiskData,
  RegionInfo,
  RiverDrainageLine,
  WeatherObservation,
  WeatherStation,
} from '../types';

export const SUPPORTED_REGIONS: RegionInfo[] = [
  {
    id: 'pune',
    name: 'Pune Metropolitan Region',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.5204,
    lng: 73.8567,
    zoom: 12,
    dangerRainfallThreshold: 65,
  },
  {
    id: 'mumbai',
    name: 'Greater Mumbai Region',
    state: 'Maharashtra',
    country: 'India',
    lat: 19.076,
    lng: 72.8777,
    zoom: 11,
    dangerRainfallThreshold: 100,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Urban Area',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    zoom: 12,
    dangerRainfallThreshold: 55,
  },
];

export const INITIAL_WEATHER_OBSERVATION: WeatherObservation = {
  currentRainfallMm: 24.8,
  cumulative6hMm: 82.4,
  temperatureC: 26.2,
  humidityPercent: 89,
  pressureHpa: 1005,
  windSpeedKmh: 32,
  windDirection: 'WSW',
  intensityLabel: 'Heavy',
  lastUpdated: '2026-09-03 14:15 IST (IMD Radar Sync)',
};

export const MOCK_WEATHER_STATIONS: WeatherStation[] = [
  {
    id: 'stn-shivajinagar',
    name: 'Shivajinagar IMD Observatory',
    lat: 18.5314,
    lng: 73.8446,
    rainfallCurrent: 26.4,
    status: 'warning',
  },
  {
    id: 'stn-pashan',
    name: 'Pashan Meteorological AWS',
    lat: 18.5416,
    lng: 73.7925,
    rainfallCurrent: 18.2,
    status: 'active',
  },
  {
    id: 'stn-lohegaon',
    name: 'Lohegaon Airport Weather Station',
    lat: 18.5822,
    lng: 73.9197,
    rainfallCurrent: 14.5,
    status: 'active',
  },
  {
    id: 'stn-sinhagad',
    name: 'Sinhagad Foothills Radar Station',
    lat: 18.4412,
    lng: 73.7854,
    rainfallCurrent: 36.1,
    status: 'warning',
  },
  {
    id: 'stn-hadapsar',
    name: 'Hadapsar Sub-Station',
    lat: 18.5089,
    lng: 73.9259,
    rainfallCurrent: 21.0,
    status: 'active',
  },
];

export const HORIZON_FORECASTS: Record<number, ForecastHorizonData> = {
  1: {
    horizonHours: 1,
    label: '+1 Hour (Nowcast)',
    predictedRainfallMm: 28.5,
    confidence: 0.94,
    inundationProbability: 0.58,
    riskLevel: 'HIGH',
    forecastTime: '15:15 IST',
  },
  3: {
    horizonHours: 3,
    label: '+3 Hours (Short-term)',
    predictedRainfallMm: 62.0,
    confidence: 0.89,
    inundationProbability: 0.74,
    riskLevel: 'HIGH',
    forecastTime: '17:15 IST',
  },
  6: {
    horizonHours: 6,
    label: '+6 Hours (Peak Inundation Window)',
    predictedRainfallMm: 118.5,
    confidence: 0.86,
    inundationProbability: 0.84,
    riskLevel: 'SEVERE',
    forecastTime: '20:15 IST',
  },
  24: {
    horizonHours: 24,
    label: '+24 Hours (Event Total)',
    predictedRainfallMm: 165.2,
    confidence: 0.79,
    inundationProbability: 0.62,
    riskLevel: 'HIGH',
    forecastTime: 'Tomorrow 14:15 IST',
  },
};

export const MOCK_OVERALL_RISK: OverallRiskData = {
  overallRisk: 'SEVERE',
  riskScorePercent: 84,
  rainfallContribution: 88,
  inundationContribution: 81,
  modelConfidence: 86,
  leadTimeHours: 3.5,
};

export const MOCK_RIVERS: RiverDrainageLine[] = [
  {
    id: 'mutha-river',
    name: 'Mutha River (Primary Inundation Risk)',
    coordinates: [
      [18.4200, 73.7400],
      [18.4600, 73.7900],
      [18.4950, 73.8250],
      [18.5140, 73.8450],
      [18.5300, 73.8680],
      [18.5420, 73.9000],
      [18.5550, 73.9600],
    ],
  },
  {
    id: 'mula-river',
    name: 'Mula River Tributary',
    coordinates: [
      [18.5850, 73.7600],
      [18.5680, 73.8050],
      [18.5520, 73.8400],
      [18.5300, 73.8680],
    ],
  },
];

export const MOCK_INUNDATION_ZONES: InundationZone[] = [
  {
    id: 'zone-sinhagad-rd',
    wardName: 'Sinhagad Road / Vitthalwadi Basin',
    severity: 'SEVERE',
    waterDepthMeters: 1.45,
    probability: 0.92,
    elevationMsl: 552,
    coordinates: [
      [18.485, 73.820],
      [18.502, 73.834],
      [18.496, 73.848],
      [18.478, 73.832],
    ],
  },
  {
    id: 'zone-deccan',
    wardName: 'Deccan Gymkhana / Pulachi Wadi',
    severity: 'SEVERE',
    waterDepthMeters: 0.95,
    probability: 0.88,
    elevationMsl: 556,
    coordinates: [
      [18.510, 73.838],
      [18.522, 73.845],
      [18.518, 73.858],
      [18.505, 73.849],
    ],
  },
  {
    id: 'zone-patil-estate',
    wardName: 'Patil Estate / Sangam Bridge',
    severity: 'SEVERE',
    waterDepthMeters: 1.20,
    probability: 0.85,
    elevationMsl: 550,
    coordinates: [
      [18.528, 73.860],
      [18.540, 73.872],
      [18.535, 73.882],
      [18.522, 73.870],
    ],
  },
  {
    id: 'zone-yerawada',
    wardName: 'Yerawada / Shanti Nagar Lowlands',
    severity: 'HIGH',
    waterDepthMeters: 0.65,
    probability: 0.76,
    elevationMsl: 558,
    coordinates: [
      [18.545, 73.875],
      [18.560, 73.888],
      [18.552, 73.905],
      [18.538, 73.892],
    ],
  },
  {
    id: 'zone-kothrud',
    wardName: 'Kothrud / Ramnadi Outfall',
    severity: 'MODERATE',
    waterDepthMeters: 0.35,
    probability: 0.54,
    elevationMsl: 570,
    coordinates: [
      [18.498, 73.795],
      [18.512, 73.805],
      [18.508, 73.818],
      [18.490, 73.810],
    ],
  },
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'alert-pun-001',
    severity: 'SEVERE',
    title: 'CRITICAL INUNDATION WARNING: Mutha River Overflow Impending',
    affectedWards: ['Sinhagad Road', 'Vitthalwadi', 'Pulachi Wadi (Deccan)', 'Patil Estate'],
    issuedAt: '14:00 IST',
    validUntil: '22:00 IST',
    impact: 'Water depth expected to exceed 1.2m across riverside societies. Khadakwasla Dam release anticipated at 25,000 cusecs.',
    recommendations: [
      'Immediate evacuation of ground floor residences in riverside societies.',
      'Barricade subway underpasses at Alka Talkies and Bhide Bridge.',
      'Shift all vehicles from basements to designated elevated PMC grounds.',
      'Keep emergency helpline 1077 on standby.',
    ],
    status: 'active',
  },
  {
    id: 'alert-pun-002',
    severity: 'HIGH',
    title: 'Severe Urban Flash Waterlogging: Arterial Traffic Blockage',
    affectedWards: ['Kothrud (Karve Rd)', 'Shivajinagar', 'Yerawada', 'Swargate'],
    issuedAt: '13:30 IST',
    validUntil: '18:00 IST',
    impact: 'Flash stormwater exceeding storm drain capacity by 140%. Traffic speed reduced below 5 km/h.',
    recommendations: [
      'Avoid non-essential vehicular movement on Karve Road & J.M. Road.',
      'PMC Pumping Units 04 and 09 dispatched to clear underpasses.',
    ],
    status: 'active',
  },
  {
    id: 'alert-pun-003',
    severity: 'MODERATE',
    title: 'Precautionary Heavy Downpour Alert (Rainfall > 30mm/hr)',
    affectedWards: ['Hadapsar', 'Viman Nagar', 'Baner', 'Aundh'],
    issuedAt: '12:00 IST',
    validUntil: '20:00 IST',
    impact: 'Localized gutter overflows and slow-moving traffic in low-elevation junctions.',
    recommendations: [
      'Unclog local runoff grates.',
      'Exercise caution near storm drains and electric poles.',
    ],
    status: 'active',
  },
];

export const MOCK_HOURLY_FORECAST: HourlyForecastItem[] = [
  { hour: '14:00', predictedMm: 12.0, riskProb: 45, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '15:00', predictedMm: 24.5, riskProb: 65, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '16:00', predictedMm: 38.2, riskProb: 78, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '17:00', predictedMm: 56.4, riskProb: 91, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '18:00', predictedMm: 48.0, riskProb: 88, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '19:00', predictedMm: 35.1, riskProb: 79, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '20:00', predictedMm: 22.4, riskProb: 62, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '21:00', predictedMm: 15.0, riskProb: 50, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '22:00', predictedMm: 9.5, riskProb: 38, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '23:00', predictedMm: 6.2, riskProb: 25, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '00:00', predictedMm: 4.8, riskProb: 20, thresholdWarn: 30, thresholdDanger: 50 },
  { hour: '01:00', predictedMm: 3.5, riskProb: 15, thresholdWarn: 30, thresholdDanger: 50 },
];
