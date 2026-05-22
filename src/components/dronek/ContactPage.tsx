'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from './LanguageProvider';
import Values from './Values';
import type { PageView } from './Navbar';
import { supabase } from '@/lib/supabase';
import LocationMap from './LocationMap';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ContactPage({ onNavigate }: { onNavigate: (page: PageView) => void }) {
  const { lang } = useLanguage();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    objet: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dynamicInfo, setDynamicInfo] = useState<any>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('sujet', 'Configuration')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setDynamicInfo(data);
      }
    };

    fetchContactInfo();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prenom.trim()) newErrors.prenom = lang === 'fr' ? "Ce champ est requis" : "This field is required";
    if (!formData.nom.trim()) newErrors.nom = lang === 'fr' ? "Ce champ est requis" : "This field is required";
    if (!formData.email.trim()) {
      newErrors.email = lang === 'fr' ? "Ce champ est requis" : "This field is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = lang === 'fr' ? "Format d'email invalide" : "Invalid email format";
    }
    if (!formData.objet.trim()) newErrors.objet = lang === 'fr' ? "L'objet est requis" : "Subject is required";
    if (!formData.message.trim()) newErrors.message = lang === 'fr' ? "Ce champ est requis" : "This field is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        // 1. Enregistrer dans la base de données Supabase
        const { error } = await supabase
          .from('contacts')
          .insert([
            {
              prenom: formData.prenom,
              nom: formData.nom,
              email: formData.email,
              telephone: formData.telephone,
              sujet: formData.objet,
              message: formData.message,
              statut: 'non_traite',
              created_at: new Date().toISOString()
            }
          ]);
        if (error) throw error;

        // 2. Envoyer l'e-mail via l'API locale /api/contact
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `${formData.prenom} ${formData.nom}`,
            email: formData.email,
            subject: formData.objet,
            message: formData.message
          })
        });

        if (!response.ok) {
          console.warn("L'e-mail n'a pas pu être envoyé via /api/contact");
        }

        setIsSuccess(true);
        setFormData({ prenom: '', nom: '', email: '', telephone: '', objet: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 🚀 BANNER HERO — Centered Dronek Style */}
      <AnimatedSection className="relative h-auto min-h-[100px] lg:min-h-[120px] flex items-start overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] lg:rounded-tl-[8rem] lg:rounded-br-[8rem] mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl bg-[#1a4a2e]">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-dronek-dark via-[#0a2118] to-dronek-green/20 opacity-90" />
        <div className="absolute inset-0 pattern-dots-light opacity-10" />
        
        {/* Custom Background Image on the Right */}
        <img 
          src="/images/dronek_image3-removebg-preview.png" 
          alt="" 
          className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-[400px] lg:w-[600px] h-auto opacity-20 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 pt-8 lg:pt-10 pb-6 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-montserrat-extrabold text-white uppercase tracking-[0.2em] leading-tight">
              {"Parlons-en".split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </h1>
            <div className="w-16 h-1 bg-white mx-auto mt-4 rounded-full opacity-80" />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Main Content */}
      <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column - Info */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={stagger}
              className="space-y-8 lg:pr-8"
            >
              <div>
                <motion.p variants={fadeInUp} className="text-[#2d7a3a] font-medium text-sm mb-4">
                </motion.p>
                <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  <span className="text-[#1a4a2e]">{lang === 'fr' ? 'Contactez-nous' : 'Contact us'}</span><br />
                  <span className="text-black font-normal">{lang === 'fr' ? 'aujourd\'hui' : 'today'}</span>
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-gray-500 text-base sm:text-lg mt-6 leading-relaxed max-w-lg">
                  {lang === 'fr' 
                    ? 'Remplissez le formulaire suivant pour toute demande de soumission ou d\'information. Propulsons votre croissance opérationnelle grâce à la technologie aérienne par drones.'
                    : 'Fill out the following form for any quote or information request. Let\'s boost your operational growth with drone aerial technology.'}
                </motion.p>
              </div>

              <motion.div variants={stagger} className="space-y-6 pt-6">
                <motion.div variants={fadeInUp} className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-[#1a4a2e]" />
                  <a 
                    href={`mailto:${dynamicInfo?.email || t.contact.email}`}
                    className="text-gray-600 font-medium text-lg hover:text-dronek-green transition-colors"
                  >
                    {dynamicInfo?.email || t.contact.email}
                  </a>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-[#1a4a2e]" />
                  <div className="flex flex-col">
                    {dynamicInfo?.telephone ? (
                      dynamicInfo.telephone.split('\n').map((num: string, idx: number) => (
                        <a key={idx} href={`tel:${num.replace(/\s+/g, '')}`} className="text-gray-600 font-medium text-lg hover:text-dronek-green transition-colors">
                          {num}
                        </a>
                      ))
                    ) : (
                      <>
                        <a href="tel:+2250707732264" className="text-gray-600 font-medium text-lg hover:text-dronek-green transition-colors">
                          +225 07 07 73 22 64
                        </a>
                        <a href="tel:+2252721514149" className="text-gray-600 font-medium text-lg hover:text-dronek-green transition-colors">
                          +225 27 21 51 41 49
                        </a>
                      </>
                    )}
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-[#1a4a2e]" />
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-1">
                      {lang === 'fr' ? 'Adresse' : 'Address'}
                    </span>
                    <p className="text-gray-600 font-medium text-lg">
                      {dynamicInfo?.message || t.contact.address}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeInUp}
              className="w-full"
            >
              <div className="bg-[#1a4a2e] rounded-[2.5rem] lg:rounded-[4rem] lg:rounded-tl-[8rem] lg:rounded-br-[8rem] p-8 sm:p-10 lg:p-14 shadow-2xl text-white relative overflow-hidden">
                {/* Decorative background image */}
                <img 
                  src="/images/dronek_image3-removebg-preview.png" 
                  alt="" 
                  className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-64 lg:w-96 h-auto opacity-20 pointer-events-none select-none grayscale brightness-200"
                />
                
                <h3 className="relative z-10 text-3xl font-bold mb-8">{t.contact.formTitle}</h3>
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder={t.contact.firstName + " *"} 
                        className={`w-full bg-white text-gray-900 border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-green-400 outline-none ${errors.prenom ? 'ring-2 ring-red-400' : ''}`}
                      />
                      {errors.prenom && <span className="text-red-300 text-xs block">{errors.prenom}</span>}
                    </div>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder={t.contact.lastName + " *"} 
                        className={`w-full bg-white text-gray-900 border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-green-400 outline-none ${errors.nom ? 'ring-2 ring-red-400' : ''}`}
                      />
                      {errors.nom && <span className="text-red-300 text-xs block">{errors.nom}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.contact.emailField + " *"} 
                        className={`w-full bg-white text-gray-900 border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-green-400 outline-none ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                      />
                      {errors.email && <span className="text-red-300 text-xs block">{errors.email}</span>}
                    </div>
                    <div className="space-y-2">
                      <input 
                        type="tel" 
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder={t.contact.phoneField} 
                        className="w-full bg-white text-gray-900 border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-green-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="text" 
                      name="objet"
                      value={formData.objet}
                      onChange={handleChange}
                      placeholder={lang === 'fr' ? "Objet *" : "Subject *"} 
                      className={`w-full bg-white text-gray-900 border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-green-400 outline-none ${errors.objet ? 'ring-2 ring-red-400' : ''}`}
                    />
                    {errors.objet && <span className="text-red-300 text-xs block">{errors.objet}</span>}
                  </div>

                  <div className="space-y-2 pt-1">
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.contact.message + " *"} 
                      rows={5}
                      className={`w-full bg-white text-gray-900 border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-green-400 outline-none resize-none ${errors.message ? 'ring-2 ring-red-400' : ''}`}
                    />
                    {errors.message && <span className="text-red-300 text-xs block">{errors.message}</span>}
                  </div>

                  {isSuccess && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/20 text-green-100 px-4 py-3 rounded-lg text-sm border border-green-500/30">
                      {t.contact.success}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#2d7a3a] hover:bg-[#23602d] text-white font-semibold py-4 rounded-full transition-colors duration-300 flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t.contact.sending}
                      </span>
                    ) : (
                      t.contact.send
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="h-[500px] w-full">
          <LocationMap />
        </div>
      </section>

    </div>
  );
}
