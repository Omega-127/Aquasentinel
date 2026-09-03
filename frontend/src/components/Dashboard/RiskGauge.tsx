import React from 'react';
import { AlertOctagon, ShieldCheck, Clock } from 'lucide-react';
import type { OverallRiskData } from '../../types';

interface RiskGaugeProps {
  riskData: OverallRiskData;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ riskData }) => {
  const {
    overallRisk,
    riskScorePercent,
    rainfallContribution,
    inundationContribution,
    modelConfidence,
    leadTimeHours,
  } = riskData;

  // Arc calculation for semi-circular radial gauge
  // Circumference of semi-circle arc: radius 70, arc length = PI * 70 = ~220
  const radius = 70;
  const arcCircumference = Math.PI * radius;
  const strokeDashoffset = arcCircumference - (riskScorePercent / 100) * arcCircumference;

  const getRiskColor = () => {
    switch (overallRisk) {
      case 'LOW': return '#10b981';
      case 'MODERATE': return '#eab308';
      case 'HIGH': return '#f97316';
      case 'SEVERE': return '#ef4444';
      default: return '#06b6d4';
    }
  };

  const currentColor = getRiskColor();

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
          <AlertOctagon size={18} color={currentColor} />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Risk Assessment Engine
          </h2>
        </div>
        <span className={`badge badge-${overallRisk.toLowerCase()}`}>
          {overallRisk} RISK
        </span>
      </div>

      {/* Semi-circular Radial Gauge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        padding: '6px 0 12px 0',
      }}>
        <svg width="200" height="115" viewBox="0 0 200 115" style={{ overflow: 'visible' }}>
          {/* Background Arc */}
          <path
            d="M 20 100 A 70 70 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 20 100 A 70 70 0 0 1 180 100"
            fill="none"
            stroke={currentColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={arcCircumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease',
              filter: `drop-shadow(0 0 8px ${currentColor}88)`,
            }}
          />

          {/* Needle / Value Text in Center */}
          <text
            x="100"
            y="85"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="32"
            fontWeight="800"
            fontFamily="var(--font-mono)"
          >
            {riskScorePercent}%
          </text>
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            THREAT SCORE
          </text>
        </svg>

        {/* Lead time pill */}
        <div style={{
          marginTop: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '999px',
          fontSize: '11px',
          color: '#f87171',
          fontWeight: 600,
        }}>
          <Clock size={12} />
          <span>Warning Lead Time: ~{leadTimeHours} Hours</span>
        </div>
      </div>

      {/* Component Factor Breakdown */}
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Rainfall Intensity Factor */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>
            <span>Precipitation Driver (XGBoost)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>{rainfallContribution}%</span>
          </div>
          <div style={{ height: '5px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${rainfallContribution}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
              borderRadius: '999px',
            }} />
          </div>
        </div>

        {/* Inundation / Topography Factor */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>
            <span>Terrain & Basin Inundation</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#f87171' }}>{inundationContribution}%</span>
          </div>
          <div style={{ height: '5px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${inundationContribution}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ea580c, #ef4444)',
              borderRadius: '999px',
            }} />
          </div>
        </div>

        {/* Model Confidence */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '11px',
          color: '#94a3b8',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#10b981" />
            Model Confidence
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 600 }}>
            {modelConfidence}% (ROC-AUC: 0.89)
          </span>
        </div>
      </div>
    </div>
  );
};
