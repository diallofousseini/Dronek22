'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';

export default function ContactCTA() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    needs: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = () => {
    const subject = `${lang === 'fr' ? 'Demande de contact - ' : 'Contact request - '}${formData.name}`;
    const body = `Nom: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A${lang === 'fr' ? 'Téléphone' : 'Phone'}: ${formData.phone}%0D%0A${lang === 'fr' ? 'Besoin' : 'Need'}: ${formData.needs}`;
    window.location.href = `mailto:info@dronek.net?subject=${subject}&body=${body}`;
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-4 lg:py-8 bg-[#f7f7f5]">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-[#1a4a2e] rounded-[2.5rem] lg:rounded-[4rem] lg:rounded-tl-[8rem] lg:rounded-br-[8rem] overflow-hidden min-h-[350px] lg:min-h-[420px] flex flex-col lg:flex-row items-center shadow-2xl">
          {/* Left Side: Professional Image */}
          <div className="lg:w-1/2 relative h-[250px] lg:h-full w-full flex items-start justify-center pt-0 overflow-visible">
             <img 
               src="/images/999999-removebg-preview.png" 
               alt="Professional Figure" 
               className="h-[140%] lg:h-[160%] w-auto object-contain z-10 relative translate-x-[250px] -translate-y-[35px] scale-[1.5]"
             />
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center relative z-20">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit">
                <Phone className="w-4 h-4 text-white" />
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                  {lang === 'fr' ? 'PRENEZ LES DEVANTS' : 'TAKE THE LEAD'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl lg:text-4xl font-black text-white leading-tight">
                {lang === 'fr' ? 'Prêt à ' : 'Ready to '}
                <span className="text-black">
                  {lang === 'fr' ? 'transformer ' : 'transform '}
                </span>
                {lang === 'fr' ? 'votre Projet ?' : 'your project?'}
              </h2>

              {/* Subtitle */}
              <p className="text-white/80 text-xs lg:text-sm leading-relaxed max-w-md">
                {lang === 'fr' 
                  ? 'Remplissez le formulaire ci-dessous, et notre équipe vous contactera rapidement pour discuter de vos besoins et vous proposer des solutions adaptées.'
                  : 'Fill out the form below, and our team will contact you quickly to discuss your needs and propose adapted solutions.'}
              </p>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={lang === 'fr' ? 'Votre nom et prénom' : 'Your full name'}
                  className="bg-white rounded-xl px-6 py-4 text-sm text-dronek-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a3c242] transition-all"
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={lang === 'fr' ? 'Votre adresse e-mail' : 'Your email address'}
                  className="bg-white rounded-xl px-6 py-4 text-sm text-dronek-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a3c242] transition-all"
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={lang === 'fr' ? 'Votre numéro de tél.' : 'Your phone number'}
                  className="bg-white rounded-xl px-6 py-4 text-sm text-dronek-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a3c242] transition-all"
                />
                <input 
                  type="text" 
                  name="needs"
                  value={formData.needs}
                  onChange={handleChange}
                  placeholder={lang === 'fr' ? 'Votre/vos besoin(s)' : 'Your need(s)'}
                  className="bg-white rounded-xl px-6 py-4 text-sm text-dronek-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a3c242] transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                  onClick={handleSend}
                  className="w-full sm:w-fit bg-white hover:bg-gray-100 text-black font-black px-10 py-6 h-auto rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-black/20"
                >
                  {lang === 'fr' ? 'ENVOYER LE MESSAGE' : 'SEND THE MESSAGE'}
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Corner Image */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-20">
             <img src="/images/dronek_image3-removebg-preview.png" alt="" className="w-[300px] h-auto translate-x-1/4 translate-y-1/4" />
          </div>
        </div>
      </div>
    </section>
  );
}
