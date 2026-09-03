import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Radio, PhoneCall } from 'lucide-react';
import type { AlertItem } from '../../types';

interface AlertCenterProps {
  alerts: AlertItem[];
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ alerts }) => {
  const [expandedId, setExpandedId] = useState<string | null>(alerts[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="alert-feed" className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="var(--severity-severe)" className="pulse-dot" style={{ background: 'transparent' }} />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Warning Broadcasts
          </h2>
        </div>
        <span className="badge badge-severe">
          {alerts.length} Warnings Active
        </span>
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.map((alert) => {
          const isExpanded = expandedId === alert.id;
          const isSevere = alert.severity === 'SEVERE';

          let borderCol = 'var(--border-subtle)';
          let badgeClass = 'badge-moderate';
          if (isSevere) {
            borderCol = 'rgba(239, 68, 68, 0.4)';
            badgeClass = 'badge-severe';
          } else if (alert.severity === 'HIGH') {
            borderCol = 'rgba(249, 115, 22, 0.4)';
            badgeClass = 'badge-high';
          }

          return (
            <div
              key={alert.id}
              style={{
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${borderCol}`,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Header Row */}
              <div
                onClick={() => toggleExpand(alert.id)}
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span className={`badge ${badgeClass}`} style={{ marginTop: '2px' }}>
                    {alert.severity}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      {alert.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '11px', color: '#94a3b8' }}>
                      <span>Issued: <b style={{ color: '#cbd5e1' }}>{alert.issuedAt}</b></span>
                      <span>•</span>
                      <span>Wards: {alert.affectedWards.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div style={{
                  padding: '0 14px 14px 14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  background: 'rgba(0, 0, 0, 0.2)',
                }}>
                  {/* Impact Summary */}
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>Impact Projection: </span>
                    {alert.impact}
                  </div>

                  {/* Recommendations */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Civic Response & Evacuation Protocols:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {alert.recommendations.map((rec, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#cbd5e1' }}>
                          <CheckCircle2 size={14} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Helpline action */}
                  <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PhoneCall size={12} color="#f87171" />
                      Disaster Cell: <b>020-25501269</b> / <b>1077</b>
                    </span>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Broadcasting alert for ${alert.affectedWards.join(', ')} to Civil Defense Team.`);
                      }}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
