'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen, Send, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';

interface FormationPageProps {
  onNavigate: (page: PageView) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const levelConfig: Record<string, { color: string; bg: string }> = {
  'Débutant': { color: 'text-green-700', bg: 'bg-green-100' },
  'Beginner': { color: 'text-green-700', bg: 'bg-green-100' },
  'Intermédiaire': { color: 'text-amber-700', bg: 'bg-amber-100' },
  'Intermediate': { color: 'text-amber-700', bg: 'bg-amber-100' },
  'Avancé': { color: 'text-red-700', bg: 'bg-red-100' },
  'Advanced': { color: 'text-red-700', bg: 'bg-red-100' },
};

const moduleGradients = [
  'from-dronek-green/10 to-emerald-50',
  'from-dronek-dark/10 to-green-50',
  'from-amber-500/10 to-amber-50',
  'from-emerald-500/10 to-teal-50',
];

export default function FormationPage({ onNavigate }: FormationPageProps) {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
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
              <GraduationCap className="w-4 h-4" />
              <span>DRONEK Academy</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-3xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.training.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl">{t.training.subtitle}</motion.p>
          </motion.div>
        </div>
      </section>

      {/* Training Modules */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {t.training.modules.map((module, idx) => {
              const levelCfg = levelConfig[module.level] || { color: 'text-gray-700', bg: 'bg-gray-100' };
              return (
                <motion.div key={idx} variants={scaleIn}>
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-500 bg-white hover:-translate-y-2 h-full rounded-2xl overflow-hidden group">
                    {/* Top gradient accent */}
                    <div className={`h-2 bg-gradient-to-r ${['from-dronek-green to-emerald-400', 'from-dronek-dark to-dronek-green', 'from-amber-500 to-dronek-gold', 'from-emerald-600 to-teal-400'][idx % 4]}`} />
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${moduleGradients[idx % moduleGradients.length]} flex items-center justify-center`}>
                          <BookOpen className="w-7 h-7 text-dronek-green" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${levelCfg.bg} ${levelCfg.color} text-xs rounded-full font-medium`}>
                            {module.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-dronek-green border-dronek-green/20 rounded-full">
                            <Clock className="w-3 h-3 mr-1" />
                            {module.duration}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-dronek-text mb-3 group-hover:text-dronek-green transition-colors">{module.title}</h3>
                      <p className="text-dronek-medium text-sm leading-relaxed mb-5">{module.desc}</p>

                      {/* Topics */}
                      <div className="space-y-2 mb-6">
                        {module.topics.map((topic, tidx) => (
                          <div key={tidx} className="flex items-center gap-2.5 text-sm text-dronek-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-dronek-green shrink-0" />
                            {topic}
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleNav('contact')}
                        className="w-full bg-gradient-to-r from-dronek-green to-dronek-dark hover:from-dronek-dark hover:to-dronek-green text-white rounded-full py-5 font-semibold shadow-md shadow-dronek-green/15 hover:shadow-dronek-green/25 transition-all duration-300"
                      >
                        {t.training.register}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-dronek-light relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <motion.h2 variants={fadeInUp} className="text-2xl lg:text-3xl font-bold text-dronek-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.training.newsletter.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-dronek-medium">{t.training.newsletter.subtitle}</motion.p>
            <motion.div variants={fadeInUp} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.training.newsletter.placeholder}
                className="flex-1 rounded-full border-gray-200 focus:border-dronek-green"
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
              <Button onClick={handleSubscribe} className="bg-dronek-green hover:bg-dronek-dark text-white rounded-full px-6 shadow-md shadow-dronek-green/20">
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
            {subscribed && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-dronek-green font-medium text-sm">
                ✓ {lang === 'fr' ? 'Merci pour votre inscription !' : 'Thank you for subscribing!'}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
            <div className="text-center mb-12">
              <motion.div variants={fadeInUp} className="flex justify-center mb-4">
                <div className="section-divider" />
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-2xl lg:text-3xl font-bold text-dronek-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t.training.faq.title}
              </motion.h2>
            </div>
            <motion.div variants={fadeInUp}>
              <Accordion type="single" collapsible className="space-y-3">
                {t.training.faq.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="border rounded-2xl shadow-sm px-6 data-[state=open]:shadow-md data-[state=open]:border-dronek-green/20 transition-all"
                  >
                    <AccordionTrigger className="text-left text-dronek-text font-medium hover:no-underline py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-dronek-medium text-sm leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
