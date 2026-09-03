import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { BarChart3, AlertTriangle } from 'lucide-react';
import type { HourlyForecastItem } from '../../types';

interface ForecastChartProps {
  data: HourlyForecastItem[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Rainfall Horizon & Flood Risk Forecast
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#0284c7', borderRadius: '2px' }}></span>
            Precipitation (mm)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '2px', background: '#f87171' }}></span>
            Flood Probability (%)
          </span>
        </div>
      </div>

      {/* Threshold Indicators bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '6px 12px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-md)',
        fontSize: '11px',
      }}>
        <span style={{ color: '#94a3b8' }}>Threshold Triggers:</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fde047' }}>
          <span style={{ width: '8px', height: '8px', border: '1px dashed #eab308' }}></span>
          Warning: 30 mm/h
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fca5a5' }}>
          <AlertTriangle size={12} color="#ef4444" />
          Severe Inundation: 50 mm/h
        </span>
      </div>

      {/* Recharts Container */}
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="hour"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              fontFamily="var(--font-mono)"
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              domain={[0, 70]}
              fontFamily="var(--font-mono)"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              domain={[0, 100]}
              fontFamily="var(--font-mono)"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as HourlyForecastItem;
                return (
                  <div style={{
                    background: '#0f172a',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                      Time: {label}
                    </div>
                    <div style={{ color: '#38bdf8' }}>
                      Rainfall: <b>{d.predictedMm} mm</b>
                    </div>
                    <div style={{ color: d.riskProb > 70 ? '#f87171' : '#fde047' }}>
                      Flood Probability: <b>{d.riskProb}%</b>
                    </div>
                  </div>
                );
              }}
            />

            {/* Threshold Lines */}
            <ReferenceLine yAxisId="left" y={30} stroke="#eab308" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceLine yAxisId="left" y={50} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />

            {/* Precipitation Bars */}
            <Bar
              yAxisId="left"
              dataKey="predictedMm"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />

            {/* Risk Probability Trend Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="riskProb"
              stroke="#f87171"
              strokeWidth={3}
              dot={{ r: 3, fill: '#ef4444' }}
              activeDot={{ r: 6, fill: '#f87171' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
