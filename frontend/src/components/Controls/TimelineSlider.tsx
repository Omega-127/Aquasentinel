import React, { useEffect } from 'react';
import { Play, Pause, FastForward, Clock, Cpu } from 'lucide-react';
import type { ForecastHorizonData } from '../../types';

interface TimelineSliderProps {
  currentHorizon: number;
  onHorizonChange: (horizon: number) => void;
  horizonData: ForecastHorizonData;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const HORIZONS = [1, 3, 6, 24];

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  currentHorizon,
  onHorizonChange,
  horizonData,
  isPlaying,
  onTogglePlay,
}) => {
  // Cycle horizons during playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onHorizonChange(
        currentHorizon === 1 ? 3 : currentHorizon === 3 ? 6 : currentHorizon === 6 ? 24 : 1
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, currentHorizon, onHorizonChange]);

  return (
    <div className="glass-panel" style={{
      padding: '14px 20px',
      marginTop: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.02em' }}>
            Predictive Horizon Timeline
          </span>
          <span className="badge badge-high" style={{ fontSize: '11px' }}>
            {horizonData.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={14} color="#38bdf8" />
            Model: <b style={{ color: '#ffffff' }}>XGBoost Ensemble</b>
          </span>
          <span>
            Confidence: <b style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{Math.round(horizonData.confidence * 100)}%</b>
          </span>
          <span>
            Expected Rain: <b style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{horizonData.predictedRainfallMm.toFixed(1)} mm</b>
          </span>
        </div>
      </div>

      {/* Timeline Controls & Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="btn btn-primary"
          style={{ padding: '8px 14px', minWidth: '100px' }}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          <span>{isPlaying ? 'Pause' : 'Simulate'}</span>
        </button>

        {/* Stepper Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          {HORIZONS.map((h) => {
            const isActive = currentHorizon === h;
            return (
              <button
                key={h}
                onClick={() => onHorizonChange(h)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                  background: isActive ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>+{h} Hour{h > 1 ? 's' : ''}</span>
                {isActive && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
