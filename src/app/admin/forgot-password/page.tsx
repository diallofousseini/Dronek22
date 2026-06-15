'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/components/dronek/LanguageProvider';

export default function ForgotPassword() {
  const { t, lang, setLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tall3333333333@gmail.com';

    setLoading(true);
    setError(null);
    setSuccess(false);

    const officialEmail = t.contact.email;
    if (email !== officialEmail) {
      setError(lang === 'fr' ? "Seul l'email officiel du site est autorisé pour la réinitialisation." : "Only the official site email is allowed for password reset.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (error) throw error;
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(lang === 'fr' ? "Email invalide ou compte inexistant dans notre base de données." : "Invalid email or account does not exist in our database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbf8] flex flex-col items-center justify-center p-4 relative overflow-hidden">


      {/* Brand Background Image - Optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08]">
        <div className="relative w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]">
          <Image 
            src="/images/dronek_image3-removebg-preview.png" 
            alt="" 
            fill 
            className="object-contain grayscale"
            priority
          />
        </div>
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 overflow-hidden">
        {/* Subtle corner watermark */}
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-[0.05] pointer-events-none">
          <Image 
            src="/images/dronek_image3-removebg-preview.png" 
            alt="" 
            fill 
            className="object-contain grayscale rotate-12"
          />
        </div>

        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#149655]/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-[#149655]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-3 uppercase tracking-tight">
            {lang === 'fr' ? 'Mot de passe oublié' : 'Forgot Password'}
          </h1>
          <p className="text-gray-500 text-sm px-4 font-medium">
            {lang === 'fr' ? 'Entrez votre email pour recevoir un lien de réinitialisation sécurisé' : 'Enter your email to receive a secure reset link'}
          </p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-[#eef8f3] text-[#149655] rounded-xl text-sm border border-[#149655]/20 text-center font-bold">
            {lang === 'fr' ? 'Un lien de réinitialisation a été envoyé à votre adresse email.' : 'A reset link has been sent to your email address.'}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center font-bold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@dronek.net"
              className="w-full pl-12 pr-4 py-4 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#149655]/20 focus:border-[#149655] transition-all font-medium text-center"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#149655] hover:bg-[#0b3b24] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#149655]/20 disabled:opacity-70 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              lang === 'fr' ? "Envoyer le lien" : "Send Link"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-10">
          <Link 
            href="/admin/login" 
            className="group inline-flex items-center justify-center gap-2 text-gray-400 hover:text-[#149655] font-bold text-[11px] uppercase tracking-widest transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {lang === 'fr' ? 'Retour à la connexion' : 'Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}
