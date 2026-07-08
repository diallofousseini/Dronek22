'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import { useLanguage } from '@/components/dronek/LanguageProvider';

export default function AdminLogin() {
  const { t, lang, setLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (showCountdown) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            window.location.href = '/admin';
          }, 300);
        }
      }, 30); // 100 * 30ms = 3000ms = 3 seconds
      return () => clearInterval(interval);
    }
  }, [showCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tall3333333333@gmail.com';
    const masterPassword = 'f75Y0&5H04@';

    // Master credential bypass (useful if Firebase user is not yet created or service is down)
    if (email === adminEmail && password === masterPassword) {
      setLoading(true);
      localStorage.setItem('dronek_mock_auth', 'true');
      setShowCountdown(true);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (data.user?.email !== adminEmail) {
      await supabase.auth.signOut();
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setShowCountdown(true);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-5 w-full bg-white relative overflow-hidden">
      
      {/* Partie Gauche (Brand Panel) - Desktop uniquement */}
      <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center bg-[#f7fbf8] p-12 relative overflow-hidden">
        {/* Subtly animated decorative watermark */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08]">
          <div className="relative w-[500px] h-[500px] lg:w-[700px] lg:h-[700px]">
            <Image 
              src="/images/dronek_image3-removebg-preview.png" 
              alt="" 
              fill 
              className="object-contain grayscale"
              priority
            />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-[320px] flex flex-col items-center justify-center"
        >
          <Image 
            src="/logo.png" 
            alt="DRONEK Logo" 
            width={350} 
            height={120} 
            className="w-full h-auto object-contain scale-[1.3]"
            priority
          />
        </motion.div>
      </div>

      {/* Partie Droite (Form Panel) - Fond vert principal (Vert du footer #14532d) */}
      <div className="flex md:col-span-3 flex-col items-center justify-center bg-[#14532d] p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle corner watermark on green background */}
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 opacity-[0.08] pointer-events-none">
          <Image 
            src="/images/dronek_image3-removebg-preview.png" 
            alt="" 
            fill 
            className="object-contain invert brightness-0 rotate-12"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 overflow-hidden"
        >
          
          {/* Logo mobile uniquement */}
          <div className="flex md:hidden justify-center h-[50px] mb-4 items-center pointer-events-none">
            <Image 
              src="/logo.png" 
              alt="DRONEK Logo" 
              width={140} 
              height={44} 
              className="h-full w-auto object-contain scale-[1.3]"
              priority
            />
          </div>

          {/* Form Header (Coloré avec le vert du footer) */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-[#14532d] mb-1 tracking-tight">
              {lang === 'fr' ? 'Connexion' : 'Login'}
            </h1>
            <p className="text-[#14532d]/80 text-xs font-semibold">
              {lang === 'fr' ? 'Connectez-vous à votre espace' : 'Connect to your space'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 ml-1">
                {lang === 'fr' ? 'Email' : 'Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@dronek.net"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 ml-1">
                {lang === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Notice Box */}
            <div className="bg-[#f4f7f5] text-[#14532d] px-4 py-2.5 rounded-xl text-[10px] border border-[#14532d]/15 font-bold uppercase tracking-widest text-center">
              {lang === 'fr' ? 'Accès réservé au Administrateur' : 'Access restricted to Administrator'}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#14532d]/20 disabled:opacity-70 active:scale-95"
            >
              {loading ? t.admin.login.loading : (lang === 'fr' ? 'Je me connecte' : 'Login')}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-5 flex justify-between items-center px-1">
            <Link 
              href="/" 
              className="text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              {lang === 'fr' ? 'Retour' : 'Back'}
            </Link>
            
            <Link 
              href="/admin/forgot-password" 
              className="text-[#14532d] hover:text-[#0d361d] text-[10px] font-bold uppercase tracking-wider transition-colors duration-300"
            >
              {lang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot Password?'}
            </Link>
          </div>

        </motion.div>
      </div>

      <AnimatePresence>
        {showCountdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] bg-[#f7fbf8] flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex items-center justify-center w-48 h-48"
            >
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className="text-[#14532d] transition-all duration-75 ease-linear" 
                />
              </svg>
              <div className="absolute text-5xl font-black text-[#14532d] drop-shadow-md">{progress}%</div>
            </motion.div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-xl font-black text-[#111] uppercase tracking-widest drop-shadow-sm"
            >
              {lang === 'fr' ? 'Connexion en cours...' : 'Connecting...'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[24px] p-10 text-center min-w-[320px] shadow-[0_20px_70px_rgba(0,0,0,0.4)] border border-gray-100"
            >
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="absolute inset-0 bg-red-50 rounded-full"
                />
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 border-4 border-red-100 rounded-full"
                />
                <X className="w-10 h-10 text-red-500 stroke-[4px] relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.admin.login.errorTitle}</h2>
              <p className="text-gray-500 mb-8 font-medium">{t.admin.login.errorDesc}</p>
              <button 
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-[#14532d] hover:bg-[#0d361d] text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#14532d]/20"
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
