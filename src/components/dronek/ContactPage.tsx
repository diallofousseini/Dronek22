'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Linkedin, Twitter, Instagram, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from './LanguageProvider';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
];

const contactCards = [
  { icon: MapPin, label: 'Adresse', key: 'address' as const },
  { icon: Phone, label: 'Téléphone', key: 'phone' as const },
  { icon: Mail, label: 'Email', key: 'email' as const },
  { icon: Clock, label: 'Horaires', key: 'schedule' as const },
];

export default function ContactPage() {
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-80 sm:h-96 lg:h-[28rem] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dronek-dark via-dronek-green to-dronek-dark" />
        <div className="absolute inset-0 pattern-dots-light opacity-15" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              <span>DRONEK</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-3xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.contact.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl">
              {t.contact.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
              {/* Contact cards */}
              {contactCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div key={idx} variants={fadeInUp}>
                    <div className="p-5 rounded-2xl border border-gray-100 hover:border-dronek-green/20 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-dronek-green/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-dronek-green" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-dronek-text text-sm mb-1">{card.label}</h3>
                          <p className="text-dronek-medium text-sm">{t.contact[card.key]}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Social media */}
              <motion.div variants={fadeInUp}>
                <div className="p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-dronek-text text-sm mb-4">Suivez-nous</h3>
                  <div className="flex items-center gap-3">
                    {[
                      { icon: Facebook, color: 'hover:bg-blue-600' },
                      { icon: Linkedin, color: 'hover:bg-blue-700' },
                      { icon: Twitter, color: 'hover:bg-gray-800' },
                      { icon: Instagram, color: 'hover:bg-pink-600' },
                    ].map(({ icon: SocialIcon, color }, idx) => (
                      <a key={idx} href="#" className={`w-10 h-10 rounded-xl bg-dronek-light flex items-center justify-center text-dronek-green ${color} hover:text-white transition-all duration-300`}>
                        <SocialIcon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Map placeholder */}
              <motion.div variants={fadeInUp}>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-md bg-dronek-light/50 border border-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-dronek-green mx-auto mb-2" />
                      <p className="text-sm text-dronek-medium font-medium">Abidjan, Cocody</p>
                      <p className="text-xs text-dronek-light-text">216 Logements</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%" className="text-dronek-green">
                      <defs>
                        <pattern id="contact-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#contact-grid)" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="lg:col-span-2 space-y-8">
              {/* Main contact form */}
              <motion.div variants={fadeInUp}>
                <Card className="border-0 shadow-lg bg-white rounded-2xl">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-dronek-text mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {t.contact.formTitle}
                    </h2>
                    {sent && (
                      <div className="mb-6 p-4 rounded-xl bg-dronek-light text-dronek-green text-sm font-medium border border-dronek-green/20">
                        ✓ {t.contact.success}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-dronek-text">{t.contact.name}</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            required
                            className="rounded-xl border-gray-200 focus:border-dronek-green"
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-dronek-text">{t.contact.emailField}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            required
                            className="rounded-xl border-gray-200 focus:border-dronek-green"
                            placeholder="jean@exemple.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-dronek-text">{t.contact.phoneField}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleFormChange('phone', e.target.value)}
                            className="rounded-xl border-gray-200 focus:border-dronek-green"
                            placeholder="+225 07 XX XX XX XX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-dronek-text">{t.contact.subject}</Label>
                          <Select value={formData.subject} onValueChange={(val) => handleFormChange('subject', val)} required>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-dronek-green">
                              <SelectValue placeholder={t.contact.subjects.select} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quote">{t.contact.subjects.quote}</SelectItem>
                              <SelectItem value="info">{t.contact.subjects.info}</SelectItem>
                              <SelectItem value="partnership">{t.contact.subjects.partnership}</SelectItem>
                              <SelectItem value="training">{t.contact.subjects.training}</SelectItem>
                              <SelectItem value="other">{t.contact.subjects.other}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-dronek-text">{t.contact.message}</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleFormChange('message', e.target.value)}
                          required
                          rows={5}
                          className="rounded-xl border-gray-200 focus:border-dronek-green resize-none"
                          placeholder={t.contact.message}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-gradient-to-r from-dronek-green to-dronek-dark hover:from-dronek-dark hover:to-dronek-green text-white rounded-full py-6 font-semibold shadow-lg shadow-dronek-green/15 transition-all duration-300"
                      >
                        {sending ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t.contact.sending}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            {t.contact.send}
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quote request */}
              <motion.div variants={fadeInUp}>
                <Card className="border border-dronek-green/10 bg-gradient-to-br from-dronek-light/50 to-white rounded-2xl">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-dronek-text mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {t.contact.quoteTitle}
                    </h2>
                    <p className="text-dronek-medium text-sm mb-6">{t.contact.quoteDesc}</p>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Merci pour votre demande de devis ! Nous vous répondrons sous 48h.'); }} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t.contact.name}</Label>
                          <Input required className="rounded-xl border-gray-200 focus:border-dronek-green" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t.contact.emailField}</Label>
                          <Input type="email" required className="rounded-xl border-gray-200 focus:border-dronek-green" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t.contact.message}</Label>
                        <Textarea required rows={4} className="rounded-xl border-gray-200 focus:border-dronek-green resize-none" />
                      </div>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-dronek-gold to-amber-500 hover:from-amber-500 hover:to-dronek-gold text-white rounded-full px-8 shadow-lg shadow-dronek-gold/15 transition-all duration-300 hover:scale-105"
                      >
                        {t.contact.quoteTitle}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Appointment booking */}
              <motion.div variants={fadeInUp}>
                <Card className="border-0 shadow-lg bg-white rounded-2xl">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-dronek-text mb-2 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <Calendar className="w-5 h-5 text-dronek-green" />
                      {t.contact.appointmentTitle}
                    </h2>
                    <p className="text-dronek-medium text-sm mb-6">{t.contact.appointmentDesc}</p>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Votre demande de rendez-vous a été enregistrée !'); }} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t.contact.dateField}</Label>
                          <Input type="date" required className="rounded-xl border-gray-200 focus:border-dronek-green" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t.contact.timeField}</Label>
                          <Select required>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-dronek-green">
                              <SelectValue placeholder={t.contact.timeField} />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t.contact.description}</Label>
                        <Textarea rows={3} className="rounded-xl border-gray-200 focus:border-dronek-green resize-none" placeholder={t.contact.description} />
                      </div>
                      <Button
                        type="submit"
                        className="bg-dronek-green hover:bg-dronek-dark text-white rounded-full px-8 shadow-md shadow-dronek-green/15 transition-all duration-300"
                      >
                        {t.contact.book}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
