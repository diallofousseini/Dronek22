'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Linkedin, Twitter, Instagram, ArrowUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from './LanguageProvider';

interface FooterProps {
  onNavigate: (page: 'home' | 'services-forestry' | 'services-drone' | 'services-agroforestry' | 'services-agriculture' | 'projects' | 'blog' | 'training' | 'team' | 'production' | 'contact') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t, lang } = useLanguage();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubscribed, setFooterSubscribed] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [footerError, setFooterError] = useState('');

  const handleNav = (page: 'home' | 'services-forestry' | 'services-drone' | 'services-agroforestry' | 'services-agriculture' | 'projects' | 'blog' | 'training' | 'team' | 'production' | 'contact') => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubscribe = async () => {
    if (!footerEmail.trim()) return;
    setFooterLoading(true);
    setFooterError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: footerEmail, language: lang }),
      });
      const data = await res.json();
      if (data.success) {
        setFooterSubscribed(true);
        setFooterEmail('');
      } else {
        setFooterError(data.message);
      }
    } catch {
      setFooterError(lang === 'fr' ? 'Erreur réseau. Veuillez réessayer.' : 'Network error. Please try again.');
    } finally {
      setFooterLoading(false);
    }
  };

  const quickLinks = [
    { label: t.nav.home, page: 'home' as const },
    { label: t.nav.projects, page: 'projects' as const },
    { label: t.nav.blog, page: 'blog' as const },
    { label: t.nav.training, page: 'training' as const },
    { label: t.nav.team, page: 'team' as const },
    { label: t.nav.contact, page: 'contact' as const },
  ];

  const serviceLinks = [
    { label: t.services.forestry.name, page: 'services-forestry' as const },
    { label: t.services.drone.name, page: 'services-drone' as const },
    { label: t.services.agroforestry.name, page: 'services-agroforestry' as const },
    { label: t.services.agriculture.name, page: 'services-agriculture' as const },
  ];

  return (
    <footer className="bg-dronek-text relative">
      {/* Green gradient top border */}
      <div className="h-1 bg-gradient-to-r from-dronek-dark via-dronek-green to-dronek-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1: Company info + Newsletter */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/images/dronek-nav-icon.png"
                alt="DRONEK"
                className="h-16 lg:h-20 w-auto brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>DRONEK</span>
                <span className="text-xs font-medium text-dronek-green tracking-widest uppercase">SARL</span>
              </div>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
              ].map(({ icon: SocialIcon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-dronek-green hover:border-dronek-green transition-all duration-300"
                >
                  <SocialIcon className="w-4.5 h-4.5 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-dronek-gold font-semibold text-base uppercase tracking-wider mb-6">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className="text-gray-300 text-base hover:text-dronek-green transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-dronek-gold font-semibold text-base uppercase tracking-wider mb-6">
              {t.footer.ourServices}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className="text-gray-300 text-base hover:text-dronek-green transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact + Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 className="text-dronek-gold font-semibold text-base uppercase tracking-wider mb-6">
                {t.footer.contactUs}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-dronek-green mt-0.5 shrink-0" />
                  <span className="text-gray-300 text-base">{t.contact.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-dronek-green shrink-0" />
                  <a href="tel:+225070000000" className="text-gray-300 text-base hover:text-dronek-green transition-colors">{t.contact.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-dronek-green shrink-0" />
                  <span className="text-gray-300 text-base">{t.contact.email}</span>
                </li>
                <li className="text-gray-300 text-base pt-1">
                  {t.contact.schedule}
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-dronek-gold font-semibold text-base uppercase tracking-wider mb-3">
                Newsletter
              </h4>
              {footerSubscribed ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-dronek-green flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-dronek-green text-sm">{lang === 'fr' ? 'Merci pour votre inscription !' : 'Thank you for subscribing!'}</p>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 bg-white/5 border-white/10 text-white text-sm rounded-lg placeholder:text-gray-500 focus:border-dronek-green"
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter' && footerEmail) { await handleNewsletterSubscribe(); }
                      }}
                      disabled={footerLoading}
                    />
                    <Button
                      size="sm"
                      onClick={handleNewsletterSubscribe}
                      disabled={footerLoading || !footerEmail}
                      className="bg-dronek-green hover:bg-dronek-dark text-white rounded-lg shrink-0 disabled:opacity-50"
                    >
                      {footerLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                  {footerError && <p className="text-red-400 text-xs mt-1.5">{footerError}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">
              {t.footer.copyright}
            </p>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 text-xs hover:text-gray-300 transition-colors">
                {t.footer.legalNotices}
              </button>
              <button className="text-gray-400 text-xs hover:text-gray-300 transition-colors">
                {t.footer.privacy}
              </button>
              {/* Back to top */}
              <button
                onClick={scrollToTop}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-dronek-green hover:border-dronek-green transition-all duration-300"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-xs text-center mt-3 max-w-3xl mx-auto">
            {t.footer.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}
