'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import Map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

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

interface Site {
  id: string;
  name: string;
  location: string;
  description?: string;
  desc?: string;
  center?: { lat: number; lng: number };
}

interface InteractiveMapProps {
  sites: Site[];
}

export default function InteractiveMap({ sites }: InteractiveMapProps) {
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

  // Côte d'Ivoire center
  const center: [number, number] = [7.2, -5.4];
  const zoom = 7;

  // Build Leaflet icon from SVG data URL — rock-solid, no CSS dependency
  const makeIcon = (color: string) =>
    L.icon({
      iconUrl: PIN_SVG(color),
      iconSize: [30, 44],
      iconAnchor: [15, 44],
      popupAnchor: [0, -44],
    });

  const greenIcon = makeIcon('#149655');  // Dronek footer green

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: '100%',
        height: 650,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        border: '4px solid white',
        position: 'relative',
        zIndex: 0,
      }}
    >
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

        {sites.map((site, index) => {
          if (!site.center) return null;
          const position: [number, number] = [site.center.lat, site.center.lng];

          return (
            <Marker
              key={site.id || ('marker-' + index)}
              position={position}
              icon={greenIcon}
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
      <div style={{
        position: 'absolute', bottom: 24, right: 24, zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: 999,
        padding: '6px 14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        border: '1px solid rgba(20,150,85,0.15)',
        display: 'flex', alignItems: 'center', gap: 8,
        pointerEvents: 'none',
      }}>
        <span style={{
          display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
          background: '#149655', animation: 'pulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#149655', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Sites Actifs — Côte d'Ivoire
        </span>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    </motion.div>
  );
}
