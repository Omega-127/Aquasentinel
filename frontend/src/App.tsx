import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { SeverityBanner } from './components/Dashboard/SeverityBanner';
import { MetricsDisplay } from './components/Dashboard/MetricsDisplay';
import { RiskGauge } from './components/Dashboard/RiskGauge';
import { MapContainer } from './components/Map/MapContainer';
import { TimelineSlider } from './components/Controls/TimelineSlider';
import { AlertCenter } from './components/Alerts/AlertCenter';
import { ForecastChart } from './components/Charts/ForecastChart';
import { weatherApi } from './services/api';
import { SUPPORTED_REGIONS, INITIAL_WEATHER_OBSERVATION, MOCK_OVERALL_RISK, HORIZON_FORECASTS } from './services/mockData';
import type {
  AlertItem,
  ForecastHorizonData,
  HourlyForecastItem,
  InundationZone,
  OverallRiskData,
  RegionInfo,
  WeatherObservation,
  WeatherStation,
} from './types';

export const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo>(SUPPORTED_REGIONS[0]);
  const [observation, setObservation] = useState<WeatherObservation>(INITIAL_WEATHER_OBSERVATION);
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [riskData, setRiskData] = useState<OverallRiskData>(MOCK_OVERALL_RISK);
  const [currentHorizon, setCurrentHorizon] = useState<number>(6);
  const [horizonData, setHorizonData] = useState<ForecastHorizonData>(HORIZON_FORECASTS[6]);
  const [inundationZones, setInundationZones] = useState<InundationZone[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState<boolean>(false);

  // Load telemetry data for the selected region
  const loadRegionData = useCallback(async (reg: RegionInfo) => {
    setIsRefreshing(true);
    try {
      const [obsRes, riskRes, zonesRes, alertsRes, forecastRes] = await Promise.all([
        weatherApi.getWeatherObservations(reg.id),
        weatherApi.getOverallRisk(reg.id),
        weatherApi.getInundationZones(reg.id),
        weatherApi.getActiveAlerts(reg.id),
        weatherApi.getHorizonForecast(reg.id, currentHorizon),
      ]);

      setObservation(obsRes.observation);
      setStations(obsRes.stations);
      setRiskData(riskRes);
      setInundationZones(zonesRes);
      setAlerts(alertsRes);
      setHorizonData(forecastRes);
      setHourlyForecast(weatherApi.getHourlyForecast());
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [currentHorizon]);

  // Handle Horizon Change
  const handleHorizonChange = async (h: number) => {
    setCurrentHorizon(h);
    const updatedForecast = await weatherApi.getHorizonForecast(selectedRegion.id, h);
    setHorizonData(updatedForecast);
  };

  useEffect(() => {
    loadRegionData(selectedRegion);
  }, [selectedRegion, loadRegionData]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Sticky Header */}
      <Header
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => {
          setSelectedRegion(reg);
          loadRegionData(reg);
        }}
        onRefresh={() => loadRegionData(selectedRegion)}
        isRefreshing={isRefreshing}
        activeAlertCount={alerts.filter((a) => a.severity === 'SEVERE' || a.severity === 'HIGH').length}
      />

      {/* Emergency Severity Banner (appears on Severe/High threat) */}
      <SeverityBanner riskData={riskData} regionName={selectedRegion.name} />

      {/* Main 3-Column Command Center Workspace */}
      <main style={{
        flex: 1,
        padding: '16px 24px 24px 24px',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 320px) minmax(460px, 1fr) minmax(340px, 380px)',
        gap: '16px',
        alignItems: 'start',
      }}>
        {/* Left Column: Environmental Telemetry & Risk Assessment Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MetricsDisplay observation={observation} />
          <RiskGauge riskData={riskData} />
        </div>

        {/* Center Column: GIS Leaflet Map Canvas & Horizon Scrubber */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <MapContainer
            region={selectedRegion}
            zones={inundationZones}
            stations={stations}
            horizonHours={currentHorizon}
          />
          <TimelineSlider
            currentHorizon={currentHorizon}
            onHorizonChange={handleHorizonChange}
            horizonData={horizonData}
            isPlaying={isPlayingSimulation}
            onTogglePlay={() => setIsPlayingSimulation((prev) => !prev)}
          />
        </div>

        {/* Right Column: Active Warning Broadcasts & 24h Trend Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AlertCenter alerts={alerts} />
          <ForecastChart data={hourlyForecast} />
        </div>
      </main>

      {/* Modern Operations Footer */}
      <footer style={{
        padding: '12px 24px',
        background: 'rgba(11, 17, 32, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#64748b',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>AquaSentinel Early Warning System v1.0 (MVP)</span>
          <span>•</span>
          <span>Inference Model: <b style={{ color: '#94a3b8' }}>XGBoost + PostGIS Spatial Engine</b></span>
          <span>•</span>
          <span>Data Ingestion: <b style={{ color: '#38bdf8' }}>IMD AWS + INSAT-3D Radar Fused</b></span>
        </div>
        <div>
          <span>Smart India Hackathon 2026 • Municipal Flood Control Platform</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
