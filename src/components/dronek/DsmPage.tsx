'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Database,
  Activity,
  Map,
  Brain,
  Camera,
  ShieldCheck,
  Users,
  Smartphone,
  Handshake
} from 'lucide-react';

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

export default function DsmPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { lang } = useLanguage();
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  const screens = [
    {
      title: lang === 'fr' ? "Vue d'ensemble - Tableau de bord" : "Dashboard Overview",
      description: lang === 'fr' 
        ? "Vue d'ensemble de tous les projets de reboisement avec indicateurs globaux et KPIs."
        : "Overview of all reforestation projects with global indicators and KPIs.",
      image: "/IM1.png"
    },
    {
      title: lang === 'fr' ? "Gestion des parcelles" : "Plot Management",
      description: lang === 'fr'
        ? "Liste complète des parcelles de reboisement actives et de leur superficie."
        : "Complete list of active reforestation plots and their areas.",
      image: "/IM2.png"
    },
    {
      title: lang === 'fr' ? "Géolocalisation & Cartographie" : "Geolocation & Mapping",
      description: lang === 'fr'
        ? "Localisation précise et suivi cartographique interactif de toutes les parcelles."
        : "Precise location and interactive map tracking of all plots.",
      image: "/IM3.png"
    },
    {
      title: lang === 'fr' ? "Suivi de l'évolution visuelle" : "Visual Evolution Tracking",
      description: lang === 'fr'
        ? "Suivi photographique de l'évolution et de la croissance de la parcelle au fil du temps."
        : "Photographic monitoring of plot evolution and growth over time.",
      image: "/IM4.png"
    },
    {
      title: lang === 'fr' ? "Mon compte & Profil" : "My Account & Profile",
      description: lang === 'fr'
        ? "Profil de l'utilisateur avec son rôle d'habilitation et ses projets affectés."
        : "User profile with authorization role and assigned projects.",
      image: "/IM5.png"
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-4 pb-0">
      {/* Back button navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          onClick={() => onNavigate('home')}
          className="group inline-flex items-center gap-2 bg-transparent hover:bg-gray-100 text-dronek-dark border border-gray-200 rounded-[6px] px-4 py-2 text-sm transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-dronek-green transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-bold">{lang === 'fr' ? "Retour à l'accueil" : "Back to Home"}</span>
        </Button>
      </div>

      {/* Title & Introduction Section */}
      <section className="pt-2 pb-12 bg-white font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-dronek-dark mb-8 tracking-tight">
            Plateforme de <span className="text-[#149655]">Suivi Écologique</span>
          </h1>
          <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl mx-auto">
            {lang === 'fr' ? (
              <>
                DSM (Dronek Smart Monitoring) est une application développée par DRONEK pour centraliser, suivre et analyser l’ensemble des activités de reboisement, d’agroforesterie et de restauration des paysages.
                <br /><br />
                Conçue pour les équipes terrain, les gestionnaires de projets et les partenaires institutionnels, DSM transforme les données de plantation en informations exploitables pour piloter efficacement les projets environnementaux.
              </>
            ) : (
              <>
                DSM (Dronek Smart Monitoring) is an application developed by DRONEK to centralize, track, and analyze all reforestation, agroforestry, and landscape restoration activities.
                <br /><br />
                Designed for field teams, project managers, and institutional partners, DSM transforms planting data into actionable insights to effectively manage environmental projects.
              </>
            )}
          </p>
        </div>
      </section>

      {/* 6 Features Grid - Light theme cards with green icons and dark text */}
      <section className="bg-white py-16 text-dronek-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Centralisation des données */}
            <div className="bg-gray-50/50 border border-gray-100 hover:border-dronek-green/30 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-xl p-8 flex items-start gap-4">
              <Database className="w-6 h-6 text-[#149655] mt-1 shrink-0" />
              <div>
                <h3 className="text-dronek-dark text-lg font-bold">
                  {lang === 'fr' ? "Centralisation des données" : "Data Centralization"}
                </h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed font-medium">
                  {lang === 'fr' 
                    ? "Tous les projets, parcelles, espèces et données terrain sont regroupés dans une base unique et sécurisée."
                    : "All projects, plots, species, and field data are consolidated into a single secure database."}
                </p>
              </div>
            </div>

            {/* Card 2: Monitoring en temps réel */}
            <div className="bg-gray-50/50 border border-gray-100 hover:border-dronek-green/30 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-xl p-8 flex items-start gap-4">
              <Activity className="w-6 h-6 text-[#149655] mt-1 shrink-0" />
              <div>
                <h3 className="text-dronek-dark text-lg font-bold">
                  {lang === 'fr' ? "Monitoring en temps réel" : "Real-Time Monitoring"}
                </h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed font-medium">
                  {lang === 'fr' 
                    ? "Suivi du nombre de plants, de leur état de santé et du taux de survie avec historique d’évolution."
                    : "Monitoring of tree counts, health status, and survival rates with historical trends."}
                </p>
              </div>
            </div>

            {/* Card 3: Cartographie SIG intégrée */}
            <div className="bg-gray-50/50 border border-gray-100 hover:border-dronek-green/30 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-xl p-8 flex items-start gap-4">
              <Map className="w-6 h-6 text-[#149655] mt-1 shrink-0" />
              <div>
                <h3 className="text-dronek-dark text-lg font-bold">
                  {lang === 'fr' ? "Cartographie SIG intégrée" : "Integrated GIS Mapping"}
                </h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed font-medium">
                  {lang === 'fr' 
                    ? "Visualisation des parcelles et des plants sur une carte interactive grâce à la géolocalisation."
                    : "Visualization of plots and trees on an interactive map using geolocation."}
                </p>
              </div>
            </div>

            {/* Card 4: Analyse assistée par IA */}
            <div className="bg-gray-50/50 border border-gray-100 hover:border-dronek-green/30 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-xl p-8 flex items-start gap-4">
              <Brain className="w-6 h-6 text-[#149655] mt-1 shrink-0" />
              <div>
                <h3 className="text-dronek-dark text-lg font-bold">
                  {lang === 'fr' ? "Analyse assistée par IA" : "AI-Assisted Analysis"}
                </h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed font-medium">
                  {lang === 'fr' 
                    ? "Génération automatique de diagnostics, recommandations et rapports agronomiques basés sur les données collectées."
                    : "Automated diagnostics, recommendations, and agronomic reports based on collected data."}
                </p>
              </div>
            </div>

            {/* Card 5: Suivi photographique */}
            <div className="bg-gray-50/50 border border-gray-100 hover:border-dronek-green/30 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-xl p-8 flex items-start gap-4">
              <Camera className="w-6 h-6 text-[#149655] mt-1 shrink-0" />
              <div>
                <h3 className="text-dronek-dark text-lg font-bold">
                  {lang === 'fr' ? "Suivi photographique" : "Photographic Tracking"}
                </h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed font-medium">
                  {lang === 'fr' 
                    ? "Documentation visuelle de l’évolution des parcelles avec analyse d’images par intelligence artificielle."
                    : "Visual documentation of plot progress with computer vision analysis."}
                </p>
              </div>
            </div>

            {/* Card 6: Sécurité et gestion des accès */}
            <div className="bg-gray-50/50 border border-gray-100 hover:border-dronek-green/30 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-xl p-8 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-[#149655] mt-1 shrink-0" />
              <div>
                <h3 className="text-dronek-dark text-lg font-bold">
                  {lang === 'fr' ? "Sécurité et gestion des accès" : "Security & Access Management"}
                </h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed font-medium">
                  {lang === 'fr' 
                    ? "Rôles différenciés pour les administrateurs, agents terrain, partenaires et bailleurs de fonds."
                    : "Differentiated roles for administrators, field agents, partners, and financial sponsors."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Alternating Device Blocks with Realistic Mockups & Animations */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
          
          {/* Part 1: Macbook on the Left, Text on the Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center font-sans">
            <motion.div 
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-[600px] aspect-[653/382] transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/images/ordinateur.png"
                  fill
                  className="object-contain"
                  alt="Tableau de Bord DSM"
                  priority
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-3xl lg:text-4xl font-extrabold text-dronek-dark leading-tight tracking-tight text-center">
                {lang === 'fr' ? "Tableau de Bord DSM" : "DSM Dashboard"}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
                {lang === 'fr' 
                  ? "Cette page d’accueil centralise les indicateurs écologiques globaux pour les partenaires. Elle affiche une bannière de bienvenue, quatre KPIs clés ( Nombre projet, Nombre parcelle, Nombre Coopératives, taux de survie), et une carte résumant les statistiques du projet . La navigation est simplifiée via une sidebar (Tableau de bord, Espèces, Mon compte) et intègre un bouton d'installation PWA."
                  : "This home page centralizes global ecological indicators for partners. It displays a welcome banner, four key KPIs (1 project, 1 plot, 5 factories/cooperatives, 80% survival rate), and a map summarizing the statistics of the \"Premier projet\" (Bélier). Navigation is simplified via a sidebar (Tableau de bord, Espèces, Mon compte) and integrates a PWA installation button."}
              </p>
            </motion.div>
          </div>

          {/* Part 2: iPad on the Right, Text on the Left */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center font-sans">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:order-1"
            >
              <h3 className="text-3xl lg:text-4xl font-extrabold text-dronek-dark leading-tight tracking-tight text-center">
                {lang === 'fr' ? "Mon Compte" : "My Account"}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
                {lang === 'fr' 
                  ? "Cette page fournit un espace personnel permettant à l'utilisateur de consulter ses informations de profil et son périmètre d'action. Elle présente le nom de l'utilisateur, son adresse e-mail, son niveau d'habilitation, ainsi qu'un compteur indiquant le nombre de projet qui lui est affecté. La navigation reste structurée par la sidebar latérale gauche qui met en évidence l'onglet actif \"Mon compte\" , tandis que le haut de l'écran conserve le bouton d'installation PWA et le menu de profil."
                  : "This page provides a personal space allowing the user to view their profile information and scope of action. It presents the user's visual identity (\"TYTY\"), their email address (tyty@gmail.com), their authorization level via the green badge and the \"Commanditaire\" role, as well as a counter indicating 1 personally assigned project. Navigation remains structured by the left lateral sidebar which highlights the active \"Mon compte\" tab, while the top of the screen retains the PWA installation button and the profile menu."}
              </p>
            </motion.div>

            <motion.div 
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:order-2 flex justify-center"
            >
              <div className="relative w-full max-w-[480px] aspect-[1448/1086] hover:scale-[1.03] transition-transform duration-500">
                <Image
                  src="/images/tablette.png"
                  fill
                  className="object-contain"
                  alt="Module Mon Compte"
                />
              </div>
            </motion.div>
          </div>

          {/* Part 3: iPhone on the Left, Text on the Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center font-sans">
            <motion.div 
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-[320px] aspect-[340/735] hover:scale-[1.03] transition-transform duration-500">
                <Image
                  src="/images/telephone.png"
                  fill
                  className="object-contain"
                  alt="Modale d'Analyse IA du Projet"
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-3xl lg:text-4xl font-extrabold text-dronek-dark leading-tight tracking-tight text-center">
                {lang === 'fr' ? "Analyse IA du Projet" : "Project AI Analysis"}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
                {lang === 'fr' 
                  ? "Cette interface mobile affiche le diagnostic automatisé généré par Dronek AI pour le \"Premier projet\". Elle présente un résumé textuel mettant en évidence une progression préliminaire (Nombre de parcelle opérationnelle nommée \"Maparcelle\", nombre de plantes installées sur un objectif) , complété par un bloc récapitulatif des \"Données analysées\" et un avertissement d'expertise . L'en-tête offre deux actions rapides : un bouton pour \"Relancer l'analyse\" et un bouton vert déroulant \"Rapport\" destiné à exporter ce diagnostic."
                  : "This mobile interface displays the automated agronomic diagnostic generated by Dronek AI for the \"Premier projet\". It presents a textual summary highlighting a preliminary progress (only 1 operational plot named \"Maparcelle\", 5 plants installed out of a target of 500, or 1%), completed by a summary block of \"Données analysées\" and an agronomic expertise disclaimer. The header offers two quick actions: a button to \"Relancer l'analyse\" and a green dropdown \"Rapport\" button intended to export this diagnostic."}
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* New Section 2: Interactive Desktop Showcase (Left: Large Laptop screen, Right: 5 texts vertical list) */}
      <section className="bg-gray-50/50 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-dronek-dark mb-4 tracking-tight">
              {lang === 'fr' ? "Découvrez l'Interface de DSM" : "Discover the DSM Interface"}
            </h2>
            <div className="w-16 h-1 bg-dronek-green mx-auto rounded-full mb-6" />
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              {lang === 'fr' 
                ? "Cliquez sur les différentes fonctionnalités à droite pour visualiser l'affichage correspondant sur l'écran."
                : "Click on the different features on the right to visualize the corresponding screen layout."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Computer Mockup Displaying Active Screen */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[600px] mx-auto mb-6 transition-transform duration-500 hover:scale-[1.02]">
                {/* L'image de l'ordinateur qui dicte naturellement la taille du conteneur parent */}
                <Image
                  src="/images/ordinateur.png"
                  width={653}
                  height={382}
                  className="w-full h-auto block pointer-events-none relative z-10"
                  alt="DSM Computer Mockup"
                  priority
                />
                
                {/* L'écran interne dynamique, calé au pourcentage exact de l'ordinateur */}
                <div className="absolute top-[6.28%] left-[10.26%] right-[10.72%] bottom-[4.45%] overflow-hidden bg-black z-20 rounded-[2px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeScreenIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={screens[activeScreenIndex].image}
                        fill
                        className="object-cover"
                        alt={screens[activeScreenIndex].title}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Centered description line directly below the laptop mockup */}
              <div className="text-center mt-2 px-4 max-w-[500px] mx-auto">
                <p className="text-dronek-dark text-sm sm:text-base font-bold italic leading-relaxed text-center">
                  {screens[activeScreenIndex].description}
                </p>
              </div>
            </div>

            {/* Right Column: 5 Texts Aligned Vertically, centered, unnumbered, descriptions removed */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-3 w-full self-stretch">
              {screens.map((screen, idx) => {
                const isActive = activeScreenIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveScreenIndex(idx)}
                    className={`w-full py-4 px-6 rounded-xl border text-center transition-all duration-300 flex items-center justify-center font-bold text-sm sm:text-base ${
                      isActive 
                        ? 'bg-dronek-green/10 border-dronek-green/30 text-dronek-green shadow-sm scale-[1.02]' 
                        : 'bg-white border-gray-100 text-dronek-dark hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {screen.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* "A qui s'adresse DSM ?" Section */}
      <section className="py-20 bg-white font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-dronek-dark mb-4 tracking-tight">
              {lang === 'fr' ? "À qui s'adresse DSM ?" : "Who is DSM for?"}
            </h2>
            <div className="w-16 h-1 bg-dronek-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {/* Column 1: Admins */}
            <div className="flex flex-col items-center text-center">
              <div className="text-black mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dronek-dark mb-3 text-center">
                {lang === 'fr' ? "Administrateurs & chefs de projets" : "Administrators & Project Managers"}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm font-medium">
                {lang === 'fr' 
                  ? "Pilotage global des projets, gestion des ressources et analyse des performances."
                  : "Global project management, resource allocation, and performance analysis."}
              </p>
            </div>

            {/* Column 2: Field Agents */}
            <div className="flex flex-col items-center text-center">
              <div className="text-black mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dronek-dark mb-3 text-center">
                {lang === 'fr' ? "Agents terrain" : "Field Agents"}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm font-medium">
                {lang === 'fr' 
                  ? "Saisie rapide des données sur smartphone ou tablette hors connexion, même dans des environnements difficiles."
                  : "Fast data collection on smartphones or tablets offline, even in challenging environments."}
              </p>
            </div>

            {/* Column 3: Partners/Investors */}
            <div className="flex flex-col items-center text-center">
              <div className="text-black mb-4">
                <Handshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dronek-dark mb-3 text-center">
                {lang === 'fr' ? "Partenaires & bailleurs de fonds" : "Partners & Financial Sponsors"}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm font-medium">
                {lang === 'fr' 
                  ? "Consultation transparente des indicateurs, des cartes, des photos et des rapports d’avancement."
                  : "Transparent access to key performance indicators, maps, photos, and progress reports."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* L'innovation DRONEK - Styled exactly like the homepage value section */}
      <section className="py-20 bg-white relative overflow-hidden font-sans">
        {/* Decorative elements */}
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dronek-green/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="relative inline-flex flex-col items-center group max-w-2xl">
              {/* Decorative Leaf - Top Left with slow animation */}
              <motion.div 
                initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="absolute -top-2 -left-10 sm:-top-4 sm:-left-[56px] lg:-top-6 lg:-left-[72px] pointer-events-none"
              >
                <img
                  src="/images/partners/ChatGPT_Image_24_avr._2026__15_44_37-removebg-preview.png"
                  alt="Leaf"
                  className="w-12 h-10 sm:w-16 sm:h-12 lg:w-20 lg:h-16 object-contain opacity-100"
                />
              </motion.div>

              <div className="text-center">
                <h2 className="text-black text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight mb-1">
                  {(() => {
                    const words = lang === 'fr' 
                      ? [
                          { text: "Pourquoi", isGreen: false, isSlanted: false },
                          { text: "DSM", isGreen: false, isSlanted: false },
                          { text: "est", isGreen: false, isSlanted: false },
                          { text: "différent", isGreen: true, isSlanted: true },
                          { text: "?", isGreen: true, isSlanted: false },
                        ]
                      : [
                          { text: "Why", isGreen: false, isSlanted: false },
                          { text: "is", isGreen: false, isSlanted: false },
                          { text: "DSM", isGreen: false, isSlanted: false },
                          { text: "different", isGreen: true, isSlanted: true },
                          { text: "?", isGreen: true, isSlanted: false },
                        ];
                    let globalIdx = 0;
                    return words.map((w, wIdx) => (
                      <span key={wIdx} className="inline-block mr-[0.22em] last:mr-0">
                        {w.text.split('').map((char, cIdx) => {
                          const idx = globalIdx++;
                          return (
                            <motion.span
                              key={cIdx}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                              className={`inline-block ${
                                w.isGreen ? 'text-[#149655]' : 'text-black'
                              } ${
                                w.isSlanted ? 'slanted-text font-style-normal' : ''
                              }`}
                            >
                               {char}
                            </motion.span>
                          );
                        })}
                      </span>
                    ));
                  })()}
                </h2>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-[#444] text-base sm:text-lg max-w-4xl mx-auto leading-relaxed font-medium text-center space-y-4"
            >
              <p>
                {lang === 'fr' 
                  ? "DSM ne se limite pas à enregistrer des données. La plateforme combine monitoring opérationnel, géolocalisation, visualisation cartographique et intelligence artificielle pour offrir une vision complète de l’état des projets de reboisement."
                  : "DSM is not limited to logging data. The platform combines operational monitoring, geolocation, map visualization, and artificial intelligence to offer a comprehensive view of reforestation project health."}
              </p>
              <p className="text-gray-500 font-normal text-sm sm:text-base">
                {lang === 'fr' 
                  ? "Les données deviennent ainsi un véritable outil d’aide à la décision, permettant d’identifier rapidement les zones à risque, d’optimiser les interventions terrain et de produire des rapports fiables pour les audits environnementaux et les exigences RSE."
                  : "Data thus becomes a true decision-making tool, enabling rapid identification of high-risk areas, optimization of field interventions, and production of reliable reports for environmental audits and CSR requirements."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Control Section with QR Code (Positioned at the end, sticks to the footer) */}
      <section className="bg-white pt-16 pb-0 lg:pt-20 lg:pb-0 overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            
            {/* Left Column: Text + QR Code (no rounded corners) */}
            <div className="lg:col-span-7 space-y-8 text-center pb-16 lg:pb-20 flex flex-col items-center">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-dronek-dark leading-[1.1] tracking-tight text-center">
                  {lang === 'fr' ? (
                    <>
                      Accédez à l&apos;<span className="text-[#149655]">application DSM</span>
                    </>
                  ) : (
                    <>
                      Access the <span className="text-[#149655]">DSM App</span>
                    </>
                  )}
                </h2>
              </div>

              {/* Flex container to align Demo button */}
              <div className="flex flex-row items-center justify-center mt-8">
                <Button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 bg-[#149655] hover:bg-[#0f7d43] text-white font-bold px-8 py-3.5 text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  style={{ borderRadius: 0 }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {lang === 'fr' ? 'Demander une démonstration' : 'Request a demo'}
                </Button>
              </div>
            </div>
            
            {/* Right Column: DSM App User (Thumbs up) */}
            <div className="lg:col-span-5 flex justify-center items-end">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[349/527] transition-transform duration-500 hover:scale-[1.02] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] self-end">
                <Image
                  src="/images/high-five-man.png"
                  alt="DSM Mobile App User"
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
