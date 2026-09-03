import React from 'react';
import { ShieldAlert, RefreshCw, Bell, Satellite, MapPin, Clock } from 'lucide-react';
import type { RegionInfo } from '../../types';
import { SUPPORTED_REGIONS } from '../../services/mockData';

interface HeaderProps {
  selectedRegion: RegionInfo;
  onSelectRegion: (region: RegionInfo) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onSelectRegion,
  onRefresh,
  isRefreshing,
  activeAlertCount,
}) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: 'rgba(11, 17, 32, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      {/* Brand & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
        }}>
          <ShieldAlert size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Aqua<span style={{ color: 'var(--accent-cyan)' }}>Sentinel</span>
            </h1>
            <span style={{
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              color: 'var(--accent-cyan)',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '999px',
              letterSpacing: '0.04em',
            }}>
              SIH 2026
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            AI/ML Early Warning & Inundation Intelligence
          </p>
        </div>
      </div>

      {/* Region Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--bg-surface)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        <MapPin size={16} color="var(--accent-cyan)" />
        <label htmlFor="region-select" style={{ fontSize: '12px', color: '#94a3b8' }}>Region:</label>
        <select
          id="region-select"
          value={selectedRegion.id}
          onChange={(e) => {
            const found = SUPPORTED_REGIONS.find((r) => r.id === e.target.value);
            if (found) onSelectRegion(found);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {SUPPORTED_REGIONS.map((r) => (
            <option key={r.id} value={r.id} style={{ background: '#0f172a', color: '#ffffff' }}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Telemetry Status & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Live Pulse Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          color: '#34d399',
        }}>
          <span className="pulse-dot" style={{ background: '#10b981' }}></span>
          <Satellite size={14} />
          <span>IMD Radar Live Sync</span>
        </div>

        {/* System Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#94a3b8',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
        }}>
          <Clock size={14} />
          <span>IST 14:15</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="btn btn-ghost"
          style={{ padding: '7px 12px' }}
          title="Refresh Predictions & Telemetry"
        >
          <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} style={{
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
          }} />
          <span>Sync</span>
        </button>

        {/* Alert Bell */}
        <div style={{
          position: 'relative',
          padding: '8px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Bell size={16} color={activeAlertCount > 0 ? '#f87171' : '#94a3b8'} />
          {activeAlertCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--severity-severe)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.7)',
            }}>
              {activeAlertCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
