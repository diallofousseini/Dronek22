'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import { useLanguage } from '@/components/dronek/LanguageProvider';

export default function AdminLogin() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tall3333333333@gmail.com';
    const masterPassword = 'f75Y0&5H04@';

    // Master credential bypass (useful if Firebase user is not yet created or service is down)
    if (email === adminEmail && password === masterPassword) {
      setLoading(true);
      localStorage.setItem('dronek_mock_auth', 'true');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);
      return;
    }

    if (!auth) {
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error: any) {
      console.error("Login error:", error);
      setShowErrorModal(true);
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
        
        {/* Logo */}
        <div className="flex justify-center h-[100px] mb-10 items-center pointer-events-none overflow-visible">
          <Image 
            src="/logo.png" 
            alt="DRONEK Logo" 
            width={240} 
            height={80} 
            className="h-[100px] w-auto object-contain scale-[2.5] origin-center"
            priority
          />
        </div>



        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.admin.login.email}
              className="w-full pl-11 pr-4 py-4 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#149655]/20 focus:border-[#149655] transition-all font-medium text-center"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.admin.login.password}
              className="w-full pl-11 pr-12 py-4 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#149655]/20 focus:border-[#149655] transition-all font-medium text-center"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Notice Box */}
          <div className="bg-[#f0f4f2] text-gray-600 px-4 py-3.5 rounded-xl text-[11px] border border-[#149655]/10 font-bold uppercase tracking-widest text-center">
            {t.admin.login.notice}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#149655] hover:bg-[#0b3b24] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#149655]/20 disabled:opacity-70 active:scale-95"
          >
            {loading ? t.admin.login.loading : t.admin.login.submit}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col gap-4 items-center">
          <Link 
            href="/admin/forgot-password" 
            className="text-[#149655] hover:text-[#0b3b24] text-[11px] font-bold uppercase tracking-wider transition-colors duration-300"
          >
            {t.admin.login.forgot}
          </Link>
          <Link 
            href="/" 
            className="text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-center"
          >
            {t.admin.login.back}
          </Link>
        </div>

      </div>

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
                className="w-full bg-[#149655] hover:bg-[#0f7a44] text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#149655]/20"
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
