'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dronek green SVG pin — encoded inline so no external file is needed
const PIN_SVG = (color: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 44" width="30" height="44">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
      </filter>
      <path
        d="M15 1 C6.716 1 0 7.716 0 16 C0 27.5 15 43 15 43 S30 27.5 30 16 C30 7.716 23.284 1 15 1 Z"
        fill="${color}"
        stroke="white"
        stroke-width="1.5"
        filter="url(#shadow)"
      />
      <circle cx="15" cy="16" r="6" fill="white"/>
    </svg>
  `)}`;

// Internal component to control map focus
function MapController({ sites, focusedSiteId }: { sites: any[], focusedSiteId: string | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (focusedSiteId) {
      const site = sites.find(s => s.id === focusedSiteId);
      if (site && site.center) {
        map.flyTo([site.center.lat, site.center.lng], 13, {
          duration: 1.5
        });
      }
    }
  }, [focusedSiteId, sites, map]);
  
  return null;
}

// ... (PIN_SVG and interfaces remain unchanged)

interface Site {
  id: string;
  name: string;
  location: string;
  desc?: string;
  description?: string;
  center?: { lat: number; lng: number };
}

interface InteractiveMapProps {
  sites: Site[];
  focusedSiteId?: string | null;
}

export default function InteractiveMap({ sites, focusedSiteId = null }: InteractiveMapProps) {
  const { lang } = useLanguage();
  const [L, setL] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!isMounted || !L) {
    return (
      <div className="w-full h-[600px] rounded-2xl flex items-center justify-center border-2 border-gray-100"
           style={{ background: '#f9fafb' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: 40, height: 40,
              border: '4px solid #149655',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <p style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 11 }}>
            Chargement de la carte...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Animation CSS for marker
  const vibrateStyles = `
    @keyframes vibrateMarker {
      0% { transform: translate(-2px, 2px); }
      20% { transform: translate(-2px, -2px); }
      40% { transform: translate(2px, 2px); }
      60% { transform: translate(2px, -2px); }
      80% { transform: translate(-2px, 2px); }
      100% { transform: translate(0, 0); }
    }
    .leaflet-marker-vibrate {
      animation: vibrateMarker 0.15s linear 20; /* 0.15s * 20 = 3s */
    }
  `;

  // Côte d'Ivoire center
  const center: [number, number] = [7.2, -5.4];
  const zoom = 7;

  // Build Leaflet icon from SVG data URL — rock-solid, no CSS dependency
  const makeIcon = (color: string, isFocused: boolean) =>
    L.icon({
      iconUrl: PIN_SVG(color),
      iconSize: [30, 44],
      iconAnchor: [15, 44],
      popupAnchor: [0, -44],
      className: isFocused ? 'leaflet-marker-vibrate' : '',
    });

  const greenIcon = (isFocused: boolean) => makeIcon('#149655', isFocused);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full h-[400px] sm:h-[500px] lg:h-[650px]"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        border: '4px solid white',
        position: 'relative',
        zIndex: 0,
      }}
    >
      <style>{vibrateStyles}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController sites={sites} focusedSiteId={focusedSiteId} />

        {sites.map((site, index) => {
          if (!site.center) return null;
          const position: [number, number] = [site.center.lat, site.center.lng];

          return (
            <Marker
              key={site.id || ('marker-' + index)}
              position={position}
              icon={greenIcon(site.id === focusedSiteId)}
            >
              <Popup>
                <div style={{ minWidth: 180, padding: '4px 2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#149655', flexShrink: 0 }} />
                    <strong style={{ color: '#149655', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {site.name}
                    </strong>
                  </div>
                  <p style={{ fontSize: 10, color: '#6b7280', margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase' }}>
                    {site.location}
                  </p>
                  {(site.desc || site.description) && (
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, lineHeight: 1.5, borderTop: '1px solid #f3f4f6', paddingTop: 6, fontStyle: 'italic' }}>
                      {site.desc || site.description}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Badge overlay */}
      <div 
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-dronek-green/15 pointer-events-none"
      >
        <span className="inline-block w-2 h-2 rounded-full bg-dronek-green animate-pulse" />
        <span className="text-[9px] sm:text-[10px] font-extrabold color-[#149655] uppercase tracking-widest">
          {lang === 'fr' ? 'Sites Actifs — Côte d\'Ivoire' : 'Active Sites — Ivory Coast'}
        </span>
      </div>
    </motion.div>
  );
}
