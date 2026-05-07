"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type Zone = { id: string; city: string; nursery: string; center: { lat: number; lng: number }; color: string;
}; 

const containerStyle: React.CSSProperties = { width: '100%', height: '100%' }; 

// Couleurs uniques pour chaque ville
export const nurseryZones: Zone[] = [ 
  { id: 'abidjan', city: 'Abidjan', nursery: 'Pépinière de Cocody', center: { lat: 5.3600, lng: -3.9800 }, color: '#18b26a' },
  { id: 'yamoussoukro', city: 'Yamoussoukro', nursery: 'Pépinière centrale', center: { lat: 6.8200, lng: -5.2800 }, color: '#1565C0' },
  { id: 'san-pedro', city: 'San-Pédro', nursery: 'Pépinière du littoral', center: { lat: 4.7500, lng: -6.6400 }, color: '#F57C00' },
  { id: 'daloa', city: 'Daloa', nursery: 'Pépinière de Daloa', center: { lat: 6.8900, lng: -6.4500 }, color: '#D32F2F' },
  { id: 'bouake', city: 'Bouaké', nursery: 'Pépinière de Bouaké', center: { lat: 7.6900, lng: -5.0300 }, color: '#7B1FA2' },
  { id: 'korhogo', city: 'Korhogo', nursery: 'Pépinière de Korhogo', center: { lat: 9.4580, lng: -5.6290 }, color: '#8B6F47' },
  { id: 'man', city: 'Man', nursery: 'Pépinière de Man', center: { lat: 7.4100, lng: -7.5500 }, color: '#00838F' },
  { id: 'abengourou', city: 'Abengourou', nursery: 'Pépinière d\'Abengourou', center: { lat: 6.7290, lng: -3.4960 }, color: '#C2185B' },
  { id: 'gagnoa', city: 'Gagnoa', nursery: 'Pépinière de Gagnoa', center: { lat: 6.1320, lng: -5.9500 }, color: '#F9A825' },
  { id: 'divo', city: 'Divo', nursery: 'Pépinière de Divo', center: { lat: 5.8380, lng: -5.3570 }, color: '#0D8030' },
]; 

interface NurseriesMapProps { 
  selectedZoneId: string; 
  onSelectZone: (zoneId: string) => void;
} 

export function NurseriesLegend({ selectedZoneId, onSelectZone }: NurseriesMapProps) { 
  return ( 
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-dronek-green/20 bg-white/95 p-4 shadow-lg shadow-black/5 backdrop-blur-md"
    > 
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-dronek-text">Zones de pépinières - Côte d'Ivoire</h3>
        <p className="text-[11px] text-dronek-light-text">Cliquez sur une ville pour la centrer sur la carte</p>
      </div> 
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-5 lg:grid-cols-10">
        {nurseryZones.map((zone) => ( 
          <motion.button 
            key={`legend-${zone.id}`} 
            type="button" 
            onClick={() => onSelectZone(zone.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-all duration-200',
              selectedZoneId === zone.id 
                ? 'bg-white ring-2 ring-dronek-green/50 shadow-md' 
                : 'hover:bg-gray-50/80 border border-gray-100'
            )}
          >
            <span className="h-3 w-3 shrink-0 rounded-[3px] shadow-sm" style={{ backgroundColor: zone.color }} /> 
            <span className="min-w-0 truncate text-xs font-medium text-dronek-text">{zone.city}</span> 
          </motion.button>
        ))} 
      </div> 
    </motion.div> 
  );
} 

export default function NurseriesMap({ selectedZoneId, onSelectZone }: NurseriesMapProps) {
  const selectedZone = nurseryZones.find((zone) => zone.id === selectedZoneId) || nurseryZones[0];
  const embedMapUrl = useMemo(() => {
    const query = `${selectedZone.center.lat},${selectedZone.center.lng}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=8&output=embed`;
  }, [selectedZone.center.lat, selectedZone.center.lng]);

  return (
    <div className="relative w-full h-full flex flex-col gap-4">
      <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
        <iframe
          title={`Carte - ${selectedZone.city}`}
          src={embedMapUrl}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <NurseriesLegend selectedZoneId={selectedZoneId} onSelectZone={onSelectZone} />
    </div>
  );
}
