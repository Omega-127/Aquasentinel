import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Maximize2 } from 'lucide-react';
import type { InundationZone, RegionInfo, WeatherStation } from '../../types';
import { MOCK_RIVERS } from '../../services/mockData';

interface MapContainerProps {
  region: RegionInfo;
  zones: InundationZone[];
  stations: WeatherStation[];
  horizonHours: number;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  region,
  zones,
  stations,
  horizonHours,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const zonesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const riversLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility Toggles
  const [showInundation, setShowInundation] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showStations, setShowStations] = useState(true);

  // Initialize Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Guard: If Leaflet already attached to this DOM node, skip re-init
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((container as any)._leaflet_id) return;

    const map = L.map(container, {
      center: [region.lat, region.lng],
      zoom: region.zoom,
      zoomControl: false,
    });

    // CartoDB Voyager Base Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Add Zoom Control at Top Right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer Groups
    zonesLayerGroupRef.current = L.layerGroup().addTo(map);
    riversLayerGroupRef.current = L.layerGroup().addTo(map);
    stationsLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      zonesLayerGroupRef.current = null;
      riversLayerGroupRef.current = null;
      stationsLayerGroupRef.current = null;
    };
  }, []);

  // Update Center when Region Changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([region.lat, region.lng], region.zoom);
    }
  }, [region]);

  // Render River Drainage Lines
  useEffect(() => {
    if (!riversLayerGroupRef.current) return;
    riversLayerGroupRef.current.clearLayers();

    if (!showRivers) return;

    MOCK_RIVERS.forEach((river) => {
      const line = L.polyline(river.coordinates, {
        color: '#06b6d4',
        weight: 4,
        opacity: 0.85,
        dashArray: undefined,
      });

      line.bindTooltip(`<b>${river.name}</b><br/>Flow Rate: Normal to Severe Runoff`, {
        sticky: true,
        className: 'custom-leaflet-tooltip',
      });

      riversLayerGroupRef.current?.addLayer(line);
    });
  }, [showRivers]);

  // Render Inundation Zones
  useEffect(() => {
    if (!zonesLayerGroupRef.current) return;
    zonesLayerGroupRef.current.clearLayers();

    if (!showInundation) return;

    // Horizon multiplier for flood depth simulation
    const depthMultiplier = horizonHours === 1 ? 0.7 : horizonHours === 3 ? 0.9 : horizonHours === 6 ? 1.0 : 0.6;

    zones.forEach((zone) => {
      const simulatedDepth = (zone.waterDepthMeters * depthMultiplier).toFixed(2);
      const simulatedProb = Math.min(1.0, zone.probability * (horizonHours === 6 ? 1.0 : 0.88));

      let fillColor = '#ef4444'; // Severe
      if (zone.severity === 'HIGH') fillColor = '#f97316';
      if (zone.severity === 'MODERATE') fillColor = '#eab308';
      if (zone.severity === 'LOW') fillColor = '#10b981';

      const polygon = L.polygon(zone.coordinates, {
        color: fillColor,
        weight: 2,
        fillColor: fillColor,
        fillOpacity: 0.45,
      });

      const popupContent = `
        <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.5; min-width: 190px;">
          <div style="font-weight: 700; color: #ffffff; font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
            <span>${zone.wardName}</span>
            <span style="background: ${fillColor}33; color: ${fillColor}; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800;">
              ${zone.severity}
            </span>
          </div>
          <div style="color: #94a3b8; margin-top: 6px;">
            <div>Est. Water Depth: <b style="color: #ffffff">${simulatedDepth} m</b></div>
            <div>Flood Probability: <b style="color: ${fillColor}">${Math.round(simulatedProb * 100)}%</b></div>
            <div>Ground Elevation: <span style="color: #cbd5e1">${zone.elevationMsl} m MSL</span></div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1); color: #fca5a5;">
              ⚠️ Priority Evacuation Recommended
            </div>
          </div>
        </div>
      `;

      polygon.bindPopup(popupContent);
      zonesLayerGroupRef.current?.addLayer(polygon);
    });
  }, [zones, showInundation, horizonHours]);

  // Render Weather Station Markers
  useEffect(() => {
    if (!stationsLayerGroupRef.current) return;
    stationsLayerGroupRef.current.clearLayers();

    if (!showStations) return;

    stations.forEach((stn) => {
      const isWarn = stn.status === 'warning';
      const markerColor = isWarn ? '#f97316' : '#06b6d4';

      const customIcon = L.divIcon({
        className: 'custom-station-icon',
        html: `
          <div style="
            background: ${markerColor};
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px ${markerColor};
            position: relative;
          "></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([stn.lat, stn.lng], { icon: customIcon });
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px;">
          <b style="color: #ffffff;">${stn.name}</b>
          <div style="color: #94a3b8; margin-top: 4px;">Current Rainfall: <b style="color: ${markerColor}">${stn.rainfallCurrent} mm/h</b></div>
          <div style="color: #94a3b8;">Station Status: <span style="color: #34d399; text-transform: uppercase;">ONLINE</span></div>
        </div>
      `);

      stationsLayerGroupRef.current?.addLayer(marker);
    });
  }, [stations, showStations]);

  const handleResetZoom = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([region.lat, region.lng], region.zoom);
    }
  };

  return (
    <div className="glass-panel" style={{
      position: 'relative',
      height: '540px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Map Control Bar Overlay (Top Left) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(11, 17, 32, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '6px 12px',
      }}>
        <Layers size={14} color="var(--accent-cyan)" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          GIS Layers:
        </span>

        {/* Layer 1: Inundation */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: showInundation ? '#ffffff' : '#64748b', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showInundation}
            onChange={(e) => setShowInundation(e.target.checked)}
            style={{ accentColor: '#ef4444' }}
          />
          <span>Inundation Polygons</span>
        </label>

        {/* Layer 2: Rivers */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: showRivers ? '#ffffff' : '#64748b', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showRivers}
            onChange={(e) => setShowRivers(e.target.checked)}
            style={{ accentColor: '#06b6d4' }}
          />
          <span>Drainage & Rivers</span>
        </label>

        {/* Layer 3: Stations */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: showStations ? '#ffffff' : '#64748b', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showStations}
            onChange={(e) => setShowStations(e.target.checked)}
            style={{ accentColor: '#3b82f6' }}
          />
          <span>AWS Stations</span>
        </label>
      </div>

      {/* Recenter / Reset Button (Top Right next to zoom) */}
      <button
        onClick={handleResetZoom}
        title="Reset Map View to Center"
        style={{
          position: 'absolute',
          top: '80px',
          right: '12px',
          zIndex: 500,
          background: '#111d35',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          color: '#38bdf8',
          padding: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Maximize2 size={16} />
      </button>

      {/* The Leaflet Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />

      {/* Map Legend Overlay (Bottom Right) */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        zIndex: 500,
        background: 'rgba(11, 17, 32, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        fontSize: '11px',
      }}>
        <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '6px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Inundation Threat Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '10px', background: '#ef4444', borderRadius: '2px', opacity: 0.8 }}></span>
            <span style={{ color: '#fca5a5' }}>Severe (&gt;1.0m Flood Depth)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '10px', background: '#f97316', borderRadius: '2px', opacity: 0.8 }}></span>
            <span style={{ color: '#fdba74' }}>High (0.5 - 1.0m Depth)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '10px', background: '#eab308', borderRadius: '2px', opacity: 0.8 }}></span>
            <span style={{ color: '#fde047' }}>Moderate Waterlogging</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#06b6d4', borderRadius: '1px' }}></span>
            <span style={{ color: '#67e8f9' }}>Mutha River Channel</span>
          </div>
        </div>
      </div>
    </div>
  );
};
