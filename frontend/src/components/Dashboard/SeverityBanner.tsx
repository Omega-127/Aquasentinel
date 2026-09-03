import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, X, ShieldAlert } from 'lucide-react';
import type { OverallRiskData } from '../../types';

interface SeverityBannerProps {
  riskData: OverallRiskData;
  regionName: string;
}

export const SeverityBanner: React.FC<SeverityBannerProps> = ({ riskData, regionName }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (riskData.overallRisk !== 'SEVERE' && riskData.overallRisk !== 'HIGH')) {
    return null;
  }

  const isSevere = riskData.overallRisk === 'SEVERE';

  return (
    <div
      className={isSevere ? 'pulse-severe' : ''}
      style={{
        margin: '16px 24px 0 24px',
        padding: '12px 20px',
        borderRadius: 'var(--radius-lg)',
        background: isSevere
          ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.22) 0%, rgba(17, 29, 53, 0.85) 100%)'
          : 'linear-gradient(90deg, rgba(249, 115, 22, 0.2) 0%, rgba(17, 29, 53, 0.85) 100%)',
        border: `1px solid ${isSevere ? 'rgba(239, 68, 68, 0.5)' : 'rgba(249, 115, 22, 0.4)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          padding: '8px',
          borderRadius: '8px',
          background: isSevere ? 'rgba(239, 68, 68, 0.25)' : 'rgba(249, 115, 22, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <AlertTriangle size={20} color={isSevere ? '#ef4444' : '#f97316'} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '12px',
              color: isSevere ? '#f87171' : '#fb923c',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {isSevere ? 'CRITICAL DISASTER ALERT' : 'HIGH FLOOD RISK ADVISORY'}
            </span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{regionName}</span>
          </div>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#f1f5f9', fontWeight: 500 }}>
            {isSevere
              ? `Heavy inundation forecast: Mutha River Basin expected to reach overflow threshold within ~${riskData.leadTimeHours} hrs. Evacuation advised in low-lying riverside societies.`
              : 'Intense precipitation detected. Multiple urban bottlenecks experiencing rising waterlogging. Avoid underpass transit.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a
          href="#alert-feed"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            background: isSevere ? 'rgba(239, 68, 68, 0.3)' : 'rgba(249, 115, 22, 0.3)',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 600,
            border: `1px solid ${isSevere ? 'rgba(239, 68, 68, 0.6)' : 'rgba(249, 115, 22, 0.5)'}`,
            whiteSpace: 'nowrap',
          }}
        >
          <ShieldAlert size={14} />
          <span>View Action Plan</span>
          <ChevronRight size={14} />
        </a>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Dismiss banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
