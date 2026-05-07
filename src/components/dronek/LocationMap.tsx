'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Navigation, Star } from 'lucide-react';

export default function LocationMap() {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.4042845648833!2d-4.0035558!3d5.3539076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1e9b0f9812d8f%3A0x101ee5ad601fd796!2sDRONEK!5e0!3m2!1sfr!2sci!4v1713961200000!5m2!1sfr!2sci";
  const googleMapsUrl = "https://www.google.com/maps/place/DRONEK/@5.3539076,-4.0035558,17z/data=!3m1!4b1!4m6!3m5!1s0xfc1e9b0f9812d8f:0x101ee5ad601fd796!8m2!3d5.3539076!4d-4.0035558!16s%2Fg%2F11wnd6x92h?entry=ttu";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=5.3539076,-4.0035558&destination_place_id=0xfc1e9b0f9812d8f:0x101ee5ad601fd796";

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
      {/* Google Maps Iframe */}
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full"
      />

      {/* Information Card Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute top-6 left-6 z-10 w-[300px] sm:w-[340px] bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.3)] p-4 flex flex-col pointer-events-auto"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-[#202124] text-xl font-medium mb-0.5">DRONEK</h3>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[#70757a] text-sm font-medium">5,0</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                ))}
              </div>
              <span className="text-[#70757a] text-sm">(1)</span>
            </div>
            <p className="text-[#70757a] text-sm leading-tight mb-2">
              15 BP 116, Abidjan, Côte d'Ivoire
            </p>
          </div>

          <div className="flex gap-2 ml-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#1a73e8]"
              title="Ouvrir dans Google Maps"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#1a73e8]"
              title="Itinéraire"
            >
              <Navigation className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-2 pt-3 border-t border-gray-100">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#1a73e8] text-sm font-semibold hover:underline"
          >
            <Navigation className="w-4 h-4" />
            Itinéraire
          </a>
        </div>
      </motion.div>
    </div>
  );
}
