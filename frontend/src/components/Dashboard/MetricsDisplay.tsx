import React from 'react';
import { CloudRain, Droplets, Thermometer, Gauge, Wind, CloudLightning } from 'lucide-react';
import type { WeatherObservation } from '../../types';

interface MetricsDisplayProps {
  observation: WeatherObservation;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ observation }) => {
  return (
    <div className="glass-panel" style={{ padding: '18px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CloudLightning size={18} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Current Observations
          </h2>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
          {observation.lastUpdated}
        </span>
      </div>

      {/* Grid of Weather Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {/* Metric 1: Instant Rainfall */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
            <span>Rainfall Rate</span>
            <CloudRain size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {observation.currentRainfallMm.toFixed(1)}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>mm/h</span>
          </div>
          <div style={{ marginTop: '6px' }}>
            <span className="badge badge-high" style={{ fontSize: '10px', padding: '2px 6px' }}>
              {observation.intensityLabel}
            </span>
          </div>
        </div>

        {/* Metric 2: 6h Cumulative */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
            <span>6h Cumulative</span>
            <Droplets size={16} color="#60a5fa" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {observation.cumulative6hMm.toFixed(1)}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>mm</span>
          </div>
          <div style={{ marginTop: '6px', fontSize: '11px', color: '#f87171', fontWeight: 600 }}>
            High Saturation (+34%)
          </div>
        </div>

        {/* Metric 3: Temperature */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px' }}>
            <span>Temperature</span>
            <Thermometer size={16} color="#fb923c" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {observation.temperatureC.toFixed(1)}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>°C</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: '#94a3b8' }}>
            Feels like {(observation.temperatureC + 2.5).toFixed(1)}°C
          </div>
        </div>

        {/* Metric 4: Humidity */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px' }}>
            <span>Rel. Humidity</span>
            <Droplets size={16} color="#38bdf8" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {observation.humidityPercent}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>%</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: '#38bdf8' }}>
            Near Dew Point
          </div>
        </div>

        {/* Metric 5: Pressure */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px' }}>
            <span>Pressure</span>
            <Gauge size={16} color="#a78bfa" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {observation.pressureHpa}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>hPa</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: '#f87171' }}>
            Low Depression Trend
          </div>
        </div>

        {/* Metric 6: Wind */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px' }}>
            <span>Wind Velocity</span>
            <Wind size={16} color="#34d399" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {observation.windSpeedKmh}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>km/h</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: '#94a3b8' }}>
            Heading {observation.windDirection}
          </div>
        </div>
      </div>
    </div>
  );
};
