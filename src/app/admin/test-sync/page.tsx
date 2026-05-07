'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { 
  Activity, Server, Eye, Save, Zap, Terminal, 
  ArrowRight, Shield, Globe, Clock, CheckCircle2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LogType = 'admin' | 'visitor' | 'system';

interface LogMessage {
  id: string;
  time: string;
  message: string;
  type: LogType;
}

const TEST_DOC_ID = 'test-sync-doc';

export default function SyncTestPage() {
  // === Admin State ===
  const [adminData, setAdminData] = useState({
    title: 'Projet Test Initial',
    category: 'Innovation',
    isFeatured: false,
    image: '/images/hero-main.jpg'
  });
  const [isSaving, setIsSaving] = useState(false);

  // === Visitor State ===
  const [visitorData, setVisitorData] = useState<any>(null);
  const [lastUpdatePing, setLastUpdatePing] = useState(false);

  // === Logs State ===
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogType) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      time: timeString,
      message,
      type
    }]);
  };

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // === Visitor Listener (Real-time) ===
  useEffect(() => {
    if (!db) {
      addLog("Erreur: Base de données non connectée", "system");
      return;
    }

    addLog("Initialisation de l'écouteur WebSocket Firebase...", "system");
    
    const docRef = doc(db, 'projects', TEST_DOC_ID);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setVisitorData(data);
        addLog(`📡 Visiteur : Mise à jour reçue en temps réel -> "${data.title}"`, "visitor");
        
        // Visual ping effect
        setLastUpdatePing(true);
        setTimeout(() => setLastUpdatePing(false), 500);
      } else {
        addLog("Le document de test n'existe pas encore. L'administrateur doit le créer.", "system");
      }
    }, (error) => {
      addLog(`Erreur de connexion : ${error.message}`, "system");
    });

    return () => {
      unsubscribe();
      addLog("Fermeture de l'écouteur.", "system");
    };
  }, []);

  // === Admin Actions ===
  const handleAdminSave = async () => {
    setIsSaving(true);
    addLog(`📤 Admin : Envoi de la modification -> "${adminData.title}"...`, "admin");
    
    try {
      const docRef = doc(db, 'projects', TEST_DOC_ID);
      await setDoc(docRef, {
        ...adminData,
        updatedAt: serverTimestamp(),
        isTest: true // Just a flag
      });
      addLog("✅ Admin : Sauvegarde confirmée par le serveur Firebase.", "admin");
    } catch (error: any) {
      addLog(`❌ Admin : Erreur lors de la sauvegarde (${error.message})`, "admin");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#149655] p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900">Synchronisation Temps Réel</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Test de latence Admin ↔ Visiteur via Firebase WebSockets</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          Connecté
        </div>
      </header>

      {/* Main Content: Split Screen */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: ADMIN VIEW */}
        <section className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Simulateur Administrateur</h2>
          </div>
          
          <div className="p-6 space-y-6 flex-1">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Titre du Projet</label>
                <input 
                  type="text" 
                  value={adminData.title}
                  onChange={(e) => setAdminData({...adminData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#149655] focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Secteur / Catégorie</label>
                <select 
                  value={adminData.category}
                  onChange={(e) => setAdminData({...adminData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#149655] focus:outline-none transition-all"
                >
                  <option value="Innovation">Innovation</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Foresterie">Foresterie</option>
                  <option value="Technologie Drone">Technologie Drone</option>
                </select>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Projet Phare (Mise en avant)</p>
                  <p className="text-xs text-gray-500">Afficher le badge de mise en avant</p>
                </div>
                <button
                  onClick={() => setAdminData({...adminData, isFeatured: !adminData.isFeatured})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${adminData.isFeatured ? 'bg-[#149655]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adminData.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleAdminSave}
                disabled={isSaving}
                className="w-full flex justify-center items-center gap-2 bg-[#149655] hover:bg-[#0e6e3e] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? <Clock className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Sauvegarder la modification
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-wide">
                Envoie une requête d'écriture à Firestore
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT: VISITOR VIEW */}
        <section className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Vue Visiteur (Temps Réel)</h2>
            </div>
            
            <AnimatePresence>
              {lastUpdatePing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-xs font-bold text-[#149655] uppercase tracking-wider bg-green-50 px-2 py-1 rounded"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  Mise à jour reçue
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-6 flex-1 flex items-center justify-center bg-gray-100/50 relative overflow-hidden">
            {/* Visual pulse effect when data updates */}
            <AnimatePresence>
              {lastUpdatePing && (
                <motion.div 
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-[#149655]/10 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {visitorData ? (
              <motion.div 
                key={visitorData.updatedAt?.toMillis() || 'init'}
                initial={{ y: 5, opacity: 0.8 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100"
              >
                <div className="relative h-48 bg-gray-200 w-full overflow-hidden">
                  <Image 
                    src={visitorData.image || '/images/hero-main.jpg'} 
                    alt="Cover" 
                    fill 
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* FEATURED BADGE */}
                  <AnimatePresence>
                    {visitorData.isFeatured && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-4 left-4 flex items-center gap-1.5 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        Projet Phare
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-6 relative">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-[#149655] font-bold text-[10px] uppercase tracking-widest rounded-full mb-3">
                    {visitorData.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 uppercase leading-tight mb-4">
                    {visitorData.title}
                  </h3>
                  
                  <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-gray-400 flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs uppercase tracking-widest">En attente de données...</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* BOTTOM: LOGS CONSOLE */}
      <section className="h-64 bg-[#0a0a0a] text-[#00ffcc] border-t-4 border-[#149655] flex flex-col font-mono shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">
        <div className="px-4 py-2 bg-[#111] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <Terminal className="w-4 h-4" />
            Console de Synchronisation
          </div>
          <button 
            onClick={() => setLogs([])}
            className="text-xs text-gray-500 hover:text-white uppercase tracking-widest"
          >
            Clear
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-xs">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-gray-500 shrink-0">[{log.time}]</span>
              <span className={cn(
                "font-medium",
                log.type === 'admin' ? "text-yellow-400" :
                log.type === 'visitor' ? "text-green-400" :
                "text-blue-400"
              )}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </section>
    </div>
  );
}
