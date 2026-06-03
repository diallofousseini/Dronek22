'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Sprout, 
  Map, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  Eye, 
  Smartphone, 
  Lock, 
  Download,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import { ScrollTitle } from './ScrollTitle';

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function DsmPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { lang } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  // Localization dict
  const content = {
    fr: {
      backBtn: "Retour à l'accueil",
      tagline: "Dronek Smart Monitoring",
      quote: "Une plateforme décisionnelle et de traçabilité écologique pour pérenniser vos plantations.",
      introParagraph1: "Dronek Smart Monitoring (DSM) est une application web métier conçue spécifiquement pour le suivi, la gestion et l'analyse des activités de reboisement et de plantation. Dans un contexte où la traçabilité écologique et les audits environnementaux sont devenus primordiaux, DSM agit comme une plateforme centralisée de prise de décision.",
      introParagraph2: "L'application permet d'éliminer les pertes de données liées aux suivis manuels, d'assurer un monitoring continu de l'évolution des plantations (taux de survie, décompte précis, état de santé) et de gérer géographiquement les parcelles via un système d'information géographique (SIG) intégré.",
      sectionModulesTitle: "Les Modules Applicatifs",
      sectionModulesSubtitle: "Découvrez les composants clés de la suite Dronek Smart Monitoring",
      sectionAiTitle: "Intelligence Artificielle & Diagnostic par Vision",
      sectionAiDesc: "DSM intègre des algorithmes avancés de traitement de données et de vision par ordinateur pour automatiser l'analyse et la prise de décision sur le terrain.",
      sectionSpecsTitle: "Exigences Techniques & Performance",
      sectionResultsTitle: "Résultats Attendus & Impact Écologique",
      pdfBtn: "Télécharger le PRD (PDF)",
      modules: [
        {
          id: 1,
          icon: LayoutDashboard,
          title: "Tableau de Bord Global",
          subtitle: "Pilotage multi-projets",
          desc: "Agit comme la tour de contrôle en offrant une vue macroscopique : volume global de plants mis en terre, nombre de parcelles gérées, taux de survie moyen global et fiches synthétiques par projet actif.",
          details: ["Bouton d'ajout rapide (+ Ajouter un projet)", "Calcul dynamique du taux de survie moyen global (%)", "Indicateurs clés agrégés en temps réel", "Cartes projets avec statistiques locales (Plants, Parcelles, Région)"]
        },
        {
          id: 2,
          icon: Sprout,
          title: "Référentiel Botanique",
          subtitle: "Gestion des espèces",
          desc: "Constitue et maintient à jour le catalogue botanique de référence pour garantir une nomenclature uniforme à travers tous les projets de reboisement.",
          details: ["Compteur dynamique d'espèces", "Recherche textuelle et filtres de recherche rapide", "Formulaire manuel détaillé d'ajout d'espèce", "Importation massive de données via fichiers Excel"]
        },
        {
          id: 3,
          icon: Map,
          title: "Cartographie SIG Leaflet",
          subtitle: "Localisation géospatiale",
          desc: "Visualisation cartographique interactive des activités de plantation. Les parcelles et les plants sont géolocalisés sur un moteur Leaflet/OpenStreetMap.",
          details: ["Affichage dynamique de marqueurs de parcelles", "Regroupement (clustering) automatique des points", "Pop-up informative au clic sur une parcelle", "Fonctionnalité 'Ma position' via le GPS de l'appareil mobile"]
        },
        {
          id: 4,
          icon: TrendingUp,
          title: "Monitoring Biométrique",
          subtitle: "Statistiques et courbes",
          desc: "Fournit des outils analytiques pour comprendre la dynamique de mortalité ou de réussite des plantations au fil du temps.",
          details: ["Moteur de filtres croisés par espèce et par parcelle", "Graphiques chronologiques superposant plantations vs survie", "Visualisation Donut de l'état des plants (Vivants / Morts)", "Journal de documentation chronologique des agents terrain"]
        },
        {
          id: 5,
          icon: Cpu,
          title: "Évolution & Vision IA",
          subtitle: "Diagnostic par image",
          desc: "Prouve la croissance de la biomasse et analyse l'état des parcelles grâce à un modèle d'IA de vision par ordinateur.",
          details: ["Galerie chronologique de photographies de parcelles", "Classification automatique par IA (Vivant, Mort, Déboisé)", "Explications et justifications générées par l'IA", "Recommandations d'actions correctives basées sur l'image"]
        },
        {
          id: 6,
          icon: Lock,
          title: "Administration & Rôles",
          subtitle: "Cloisonnement des accès",
          desc: "Garantit la sécurité de la plateforme en distribuant les accès selon le principe du moindre privilège via Supabase Auth.",
          details: ["Rôle Super Admin / Admin : contrôle total à 360°", "Rôle Agent Terrain : saisie mobile simplifiée", "Rôle Commanditaire / Bailleur : accès en lecture seule restreint", "Tableau de contrôle des accès et assignation par projet"]
        }
      ],
      aiFeatures: [
        {
          title: "Rapport Agronomique Automatisé",
          desc: "Génération automatique d'un rapport textuel détaillé synthétisant le diagnostic IA basé sur les données récentes, incluant l'analyse sanitaire (taux de survie), le calcul de densité de plantation et des recommandations agronomiques prescriptives. Exportable en PDF et Word (.docx)."
        },
        {
          title: "Diagnostic Phytosanitaire Assisté",
          desc: "L'agent terrain prend une photo de la parcelle. Le modèle de Computer Vision classifie l'état de la végétation en temps réel (Vivant/Vert ou Inconnu/Déboisé), justifie son choix textuellement et suggère un plan d'action (ex: paillage, inventaire physique)."
        }
      ],
      technicalSpecs: [
        { label: "Architecture", val: "Progressive Web App (PWA) avec support hors-ligne (Offline-first) pour le travail en zone forestière isolée." },
        { label: "Base de données", val: "Supabase (PostgreSQL) couplée à Prisma/SQLite pour le fonctionnement local et la résilience." },
        { label: "Cartographie", val: "Leaflet.js + OpenStreetMap (léger, fluide pour gérer des milliers de marqueurs GPS)." },
        { label: "Visualisation", val: "Recharts / Chart.js pour des graphiques temporels interactifs avec tooltips au survol." },
        { label: "Charte Graphique", val: "Vert Dronek (#149655), Blanc et Gris pour garantir une visibilité optimale en extérieur sous le soleil." },
        { label: "Typographie", val: "ITC Avant Garde, conférant un aspect géométrique, moderne et très lisible." }
      ],
      results: [
        { title: "Zéro Perte de Données", desc: "Remplacement des fichiers Excel éparpillés et notes papier par une base SQL unique et sécurisée." },
        { title: "Transparence RSE", desc: "Suivi photographique horodaté et géolocalisé pour auditer les projets auprès des bailleurs de fonds." },
        { title: "Prise de Décision Rapide", desc: "Identification immédiate des zones à fort taux de mortalité pour planifier des campagnes de regarnissage." },
        { title: "Optimisation de l'Irrigation", desc: "Couplage avec des capteurs météo locaux pour ajuster en direct le planning d'irrigation." }
      ]
    },
    en: {
      backBtn: "Back to Home",
      tagline: "Dronek Smart Monitoring",
      quote: "A decision-making platform and ecological traceability system to sustain your plantations.",
      introParagraph1: "Dronek Smart Monitoring (DSM) is a business web application specifically designed to monitor, manage, and analyze reforestation and planting activities. In a context where ecological traceability and environmental audits have become paramount, DSM acts as a centralized decision-making platform.",
      introParagraph2: "The application eliminates data loss associated with manual monitoring, ensures continuous monitoring of plant growth (survival rate, precise count, health status), and manages plots geographically through an integrated GIS mapping system.",
      sectionModulesTitle: "Application Modules",
      sectionModulesSubtitle: "Discover the key components of the Dronek Smart Monitoring suite",
      sectionAiTitle: "Artificial Intelligence & Vision Diagnostics",
      sectionAiDesc: "DSM integrates advanced data processing and computer vision algorithms to automate analysis and field-level decision making.",
      sectionSpecsTitle: "Technical Specifications & Performance",
      sectionResultsTitle: "Expected Results & Ecological Impact",
      pdfBtn: "Download PRD (PDF)",
      modules: [
        {
          id: 1,
          icon: LayoutDashboard,
          title: "Global Dashboard",
          subtitle: "Multi-project management",
          desc: "Acts as the control tower by providing a macroscopic view: total trees planted, number of parcelles managed, average global survival rate, and cards summarizing active projects.",
          details: ["Quick action button (+ Add a project)", "Dynamic calculation of the average survival rate (%)", "Real-time aggregated KPIs", "Project cards with local stats (Plants, Plots, Region)"]
        },
        {
          id: 2,
          icon: Sprout,
          title: "Botanical Database",
          subtitle: "Species catalog",
          desc: "Establishes and maintains the botanical reference catalog to ensure uniform nomenclature across all reforestation initiatives.",
          details: ["Dynamic species counter", "Text search and quick filter options", "Detailed manual species entry form", "Bulk database initialization via Excel imports"]
        },
        {
          id: 3,
          icon: Map,
          title: "Leaflet GIS Mapping",
          subtitle: "Geospatial tracking",
          desc: "Interactive map visualization of planting activities. Plots and individual trees are georeferenced using a Leaflet/OpenStreetMap engine.",
          details: ["Dynamic rendering of parcel boundary markers", "Automatic point clustering for clean layouts", "Information pop-up when clicking a marker", "'My position' tracking using the mobile device GPS"]
        },
        {
          id: 4,
          icon: TrendingUp,
          title: "Biometric Monitoring",
          subtitle: "Analytics & charts",
          desc: "Provides analytical tools to understand mortality dynamics or planting success trends over time.",
          details: ["Cross-filtering by species and parcelles", "Timeline charts comparing planting effort vs survival", "Donut chart displaying tree status (Alive / Dead)", "Field log recording qualitative agent notes"]
        },
        {
          id: 5,
          icon: Cpu,
          title: "Evolution & AI Vision",
          subtitle: "Image diagnosis",
          desc: "Proves biomass growth and diagnoses plot health over time using a customized computer vision model.",
          details: ["Chronological photo gallery of plots", "AI-based automatic classification (Alive, Dead, Deforested)", "Textual justifications generated by the AI", "Recommended actions based on image analysis"]
        },
        {
          id: 6,
          icon: Lock,
          title: "Administration & Access",
          subtitle: "Access control",
          desc: "Guarantees platform security by distributing permissions according to the principle of least privilege via Supabase Auth.",
          details: ["Super Admin/Admin: 360-degree control", "Field Agent: simplified mobile data entry", "Sponsor/Investor: read-only access restricted to funded projects", "Access control panel and project-specific assignment"]
        }
      ],
      aiFeatures: [
        {
          title: "Automated Agronomic Report",
          desc: "Automatic generation of a detailed textual report summarizing the recent database diagnostic. Includes sanitary status (survival rates), planting density calculations, and prescriptive agronomical recommendations. Exportable to PDF and Word (.docx)."
        },
        {
          title: "Assisted Phytosanitary Diagnostic",
          desc: "The field agent snaps a picture of a parcel. The computer vision model classifies vegetation health in real-time (Alive/Green or Unknown/Deforested), justifies its classification textually, and suggests corrective steps."
        }
      ],
      technicalSpecs: [
        { label: "Architecture", val: "Progressive Web App (PWA) with offline-first support for remote forest operations." },
        { label: "Database", val: "Supabase (PostgreSQL) coupled with Prisma/SQLite for local resilience." },
        { label: "Mapping", val: "Leaflet.js + OpenStreetMap (lightweight, handles thousands of GPS pins smoothly)." },
        { label: "Visualization", val: "Recharts / Chart.js for interactive time-series charts with hover tooltips." },
        { label: "Design System", val: "Dronek Green (#149655), White, and Gray for optimal outdoors visibility under sunlight." },
        { label: "Typography", val: "ITC Avant Garde, giving a geometric, technical, and highly legible look." }
      ],
      results: [
        { title: "Zero Data Loss", desc: "Replacement of scattered Excel files and paper notes with a single, secure SQL database." },
        { title: "CSR Transparency", desc: "Timestamped and geolocated photo evidence to audit project progress for corporate investors." },
        { title: "Fast Decisions", desc: "Immediate identification of high-mortality zones to plan replanting campaigns." },
        { title: "Irrigation Optimization", desc: "Integration with local weather sensors to adjust watering schedules live." }
      ]
    }
  };

  const tPage = lang === 'fr' ? content.fr : content.en;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Back navigation & Title area (No banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            onClick={() => onNavigate('home')}
            className="group inline-flex items-center gap-2 bg-transparent hover:bg-gray-100 text-dronek-dark border border-gray-200 rounded-[6px] px-4 py-2 text-sm transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 text-dronek-green transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-bold">{tPage.backBtn}</span>
          </Button>
        </motion.div>
      </div>

      {/* Introduction block (Balanced 3/6/3 layout with IoT and QR widgets) */}
      <section className="pb-16 bg-white">
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Image: Gauche.png (3 columns) */}
            <motion.div variants={fadeInUp} className="lg:col-span-3 flex justify-center w-full">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[450px] lg:h-[550px] flex items-center justify-center transition-transform duration-500 hover:scale-[1.03]">
                <Image
                  src="/images/Gauche.png"
                  alt="Dronek Smart Monitoring Station"
                  fill
                  className="object-contain animate-float"
                  priority
                />
              </div>
            </motion.div>

            {/* Middle: Title, Description, and Engineered Widgets (6 columns) */}
            <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-6 text-left relative z-10 pr-0 lg:pr-12">
              <div className="space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dronek-green/10 text-dronek-green text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#149655] animate-pulse" />
                  {tPage.tagline}
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-dronek-dark leading-tight">
                  DSM
                </h1>
                <p className="text-gray-600 text-base sm:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {lang === 'fr' 
                    ? "Pilotez la santé de vos parcelles et optimisez l'irrigation en temps réel grâce aux technologies de précision Dronek."
                    : "Manage plot health and optimize irrigation in real-time with Dronek precision technology."}
                </p>
              </div>

              {/* Engineered Widgets: Weather & QR Code Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Widget 1: Weather Stats (IoT Live) */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3 hover:border-dronek-green/20 transition-all duration-300 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lang === 'fr' ? 'Capteur IoT Live' : 'IoT Sensor Live'}</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">{lang === 'fr' ? 'Précipitations' : 'Rainfall'}</span>
                      <span className="text-sm font-extrabold text-dronek-dark">12.4 mm</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">{lang === 'fr' ? 'Température' : 'Temperature'}</span>
                      <span className="text-sm font-extrabold text-dronek-dark">28.5 °C</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">{lang === 'fr' ? 'Humidité' : 'Humidity'}</span>
                      <span className="text-sm font-extrabold text-dronek-dark">76 %</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">{lang === 'fr' ? 'Vent' : 'Wind'}</span>
                      <span className="text-sm font-extrabold text-dronek-dark">14 km/h</span>
                    </div>
                  </div>
                </div>

                {/* Widget 2: QR Code Scan to Access Page */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:border-dronek-green/20 transition-all duration-300 shadow-sm relative overflow-hidden group">
                  {/* Scan line animation */}
                  <div className="absolute left-0 right-0 h-0.5 bg-dronek-green/60 shadow-[0_0_8px_#149655] z-10 animate-scan pointer-events-none" />
                  
                  {/* QR Code SVG */}
                  <div className="w-16 h-16 bg-white border border-gray-200 p-1 flex items-center justify-center rounded-xl shrink-0 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-dronek-dark">
                      {/* Outer borders */}
                      <path d="M 0 0 h 30 v 10 h -20 v 20 h -10 Z" fill="currentColor" />
                      <path d="M 100 0 h -30 v 10 h 20 v 20 h 10 Z" fill="currentColor" />
                      <path d="M 0 100 h 30 v -10 h -20 v -20 h -10 Z" fill="currentColor" />
                      <path d="M 100 100 h -30 v -10 h 20 v -20 h 10 Z" fill="currentColor" />
                      {/* Quiet zones / Position patterns */}
                      <rect x="15" y="15" width="20" height="20" fill="currentColor" />
                      <rect x="18" y="18" width="14" height="14" fill="white" />
                      <rect x="21" y="21" width="8" height="8" fill="currentColor" />
                      
                      <rect x="65" y="15" width="20" height="20" fill="currentColor" />
                      <rect x="68" y="18" width="14" height="14" fill="white" />
                      <rect x="71" y="21" width="8" height="8" fill="currentColor" />
                      
                      <rect x="15" y="65" width="20" height="20" fill="currentColor" />
                      <rect x="18" y="68" width="14" height="14" fill="white" />
                      <rect x="21" y="71" width="8" height="8" fill="currentColor" />
                      
                      {/* Random QR bits */}
                      <rect x="45" y="20" width="5" height="5" fill="currentColor" />
                      <rect x="50" y="30" width="5" height="5" fill="currentColor" />
                      <rect x="40" y="45" width="10" height="5" fill="currentColor" />
                      <rect x="65" y="45" width="5" height="10" fill="currentColor" />
                      <rect x="20" y="45" width="5" height="5" fill="currentColor" />
                      <rect x="30" y="55" width="5" height="10" fill="currentColor" />
                      
                      <rect x="45" y="65" width="10" height="5" fill="currentColor" />
                      <rect x="55" y="75" width="5" height="10" fill="currentColor" />
                      <rect x="65" y="65" width="10" height="10" fill="currentColor" />
                      <rect x="80" y="50" width="5" height="5" fill="currentColor" />
                      <rect x="50" y="50" width="10" height="5" fill="currentColor" />
                      <rect x="75" y="80" width="10" height="5" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{lang === 'fr' ? 'Accès Mobile' : 'Mobile Access'}</span>
                    <h4 className="text-xs font-bold text-dronek-dark">{lang === 'fr' ? 'Scanner pour mobile' : 'Scan for mobile'}</h4>
                    <p className="text-[9px] text-gray-500 font-medium leading-tight">{lang === 'fr' ? "Accédez directement à l'application officielle depuis votre mobile." : "Directly access the official app from your mobile device."}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button 
                  className="bg-[#149655] hover:bg-[#0f7d43] text-white font-bold rounded-[6px] px-8 py-4.5 text-sm transition-all duration-300 shadow-lg shadow-dronek-green/20 border-0 hover:scale-105 active:scale-[0.98]"
                  onClick={() => window.open('https://dsm.dronek.com', '_blank')}
                >
                  {lang === 'fr' ? "Lancer DSM" : "Launch DSM"}
                </Button>
                <Button 
                  className="bg-transparent hover:bg-gray-100 text-dronek-dark border border-gray-200 font-bold rounded-[6px] px-6 py-4.5 text-sm transition-all duration-300 flex items-center gap-2 shadow-sm hover:scale-105 active:scale-[0.98]"
                  onClick={() => window.open('/documents/DSM_Cahier_des_Charges.pdf', '_blank')}
                >
                  <Download className="w-4 h-4 text-dronek-green" />
                  <span>{tPage.pdfBtn}</span>
                </Button>
              </div>
            </motion.div>

            {/* Right: Mockup Composition (3 columns - same size as left, transparent background) */}
            <motion.div variants={fadeInUp} className="lg:col-span-3 flex justify-center w-full relative z-20">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[450px] lg:h-[550px] flex flex-col items-center justify-center overflow-visible group">
                {/* Droite_1 (Phone - Floating and Overlapping) */}
                <div className="relative w-[180px] h-[250px] lg:w-[240px] lg:h-[330px] transition-transform duration-500 group-hover:scale-[1.05] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)] z-10">
                  <Image
                    src="/images/Droite_1-removebg-preview.png"
                    alt="DSM Mobile App"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Droite_2 (Laptop - Overflowing Left into Middle Column) */}
                <div className="relative w-[280px] h-[175px] lg:w-[380px] lg:h-[240px] lg:-ml-24 -mt-10 transition-transform duration-500 group-hover:scale-[1.05] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)] z-0">
                  <Image
                    src="/images/Droite_2-removebg-preview.png"
                    alt="DSM Web Dashboard"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Modules Grid (Format "Members Grid" from TeamPage) */}
      <section className="bg-gray-50/50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-dronek-dark mb-4 uppercase tracking-tight">
              {tPage.sectionModulesTitle}
            </h2>
            <div className="w-16 h-1 bg-dronek-green mx-auto mb-6 rounded-full" />
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              {tPage.sectionModulesSubtitle}
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {tPage.modules.map((mod, idx) => {
              const Icon = mod.icon;
              const isSelected = selectedModule === idx;

              return (
                <motion.div
                  key={mod.id}
                  variants={fadeInUp}
                  className="h-full"
                >
                  <div 
                    onClick={() => setSelectedModule(isSelected ? null : idx)}
                    className={`group flex flex-col justify-between h-full bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 cursor-pointer transition-all duration-500 shadow-sm hover:shadow-xl hover:border-dronek-green/20 ${
                      isSelected ? 'ring-2 ring-dronek-green border-transparent' : ''
                    }`}
                  >
                    <div>
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-dronek-green/10 text-dronek-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Header */}
                      <div className="space-y-1 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                          {mod.subtitle}
                        </span>
                        <h3 className="text-xl font-bold text-[#149655] tracking-tight group-hover:text-dronek-green transition-colors">
                          {mod.title}
                        </h3>
                      </div>

                      {/* Desc */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                        {mod.desc}
                      </p>
                    </div>

                    {/* Features list dropdown */}
                    <div className="mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-dronek-green border-t border-gray-50 pt-4 w-full justify-between">
                        <span>{lang === 'fr' ? 'Fonctionnalités' : 'Features'}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSelected ? 'rotate-90' : ''}`} />
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 space-y-2.5 overflow-hidden pl-1"
                          >
                            {mod.details.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                                <span className="text-dronek-green font-extrabold select-none mt-0.5">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* AI Features & Report Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text description on left */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-xs font-bold text-dronek-green uppercase tracking-[0.2em] block mb-2">Dronek AI Solutions</span>
                <h2 className="text-3xl font-extrabold text-dronek-dark uppercase tracking-tight">
                  {tPage.sectionAiTitle}
                </h2>
                <div className="w-16 h-1 bg-dronek-green mt-4 rounded-full" />
              </div>
              
              <p className="text-gray-500 font-medium text-base sm:text-lg leading-relaxed">
                {tPage.sectionAiDesc}
              </p>

              <div className="space-y-6">
                {tPage.aiFeatures.map((feat, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-dronek-green/30 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-dronek-green/5 text-dronek-green flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-dronek-dark text-base">{feat.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard web mockup illustration on right (large, clean laptop screen) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[550px] aspect-[16/10] bg-[#149655]/5 border border-gray-100 p-4 sm:p-6 rounded-[2rem] shadow-xl group">
                <div className="absolute inset-0 bg-[#149655]/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)]">
                  <Image 
                    src="/images/Droite_2-removebg-preview.png"
                    alt="Dronek AI Dashboard"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Technical specifications & Results (side-by-side grids) */}
      <section className="bg-gray-50/50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Technical Specs */}
            <div className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-dronek-dark tracking-tight">
                {tPage.sectionSpecsTitle}
              </h2>
              <div className="w-12 h-1 bg-dronek-green rounded-full" />
              
              <dl className="divide-y divide-gray-100 mt-6 space-y-4">
                {tPage.technicalSpecs.map((spec, sIdx) => (
                  <div key={sIdx} className="pt-4 first:pt-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <dt className="text-sm font-bold text-dronek-green uppercase tracking-wide">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-gray-600 sm:col-span-2 font-medium">
                      {spec.val}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Results & Impact */}
            <div className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-dronek-dark tracking-tight">
                {tPage.sectionResultsTitle}
              </h2>
              <div className="w-12 h-1 bg-dronek-green rounded-full" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {tPage.results.map((res, rIdx) => (
                  <div key={rIdx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-dronek-green" />
                      <h3 className="font-bold text-dronek-dark text-sm uppercase tracking-wide">
                        {res.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium pl-4">
                      {res.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.3; }
          50% { top: 100%; opacity: 1; }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
