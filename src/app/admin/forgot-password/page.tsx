'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, KeyRound, Lock, ShieldCheck, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/components/dronek/LanguageProvider';

type RecoveryStep = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPassword() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<RecoveryStep>('email');

  const leftImageSrc = (step === 'email' || step === 'reset') 
    ? '/ssss.png' 
    : '/ChatGPT Image 9 juil. 2026, 00_46_42.png';
  
  // State variables
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Security tokens & settings
  const [resetToken, setResetToken] = useState('');
  const [obfuscatedPhone, setObfuscatedPhone] = useState('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Send OTP via SMS/Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue.');
      }

      setObfuscatedPhone(data.phone || '+225 07 •• •• 22 64');
      setOtpTimer(300);
      setIsTimerActive(true);
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    if (otpTimer === 0) {
      setError(lang === 'fr' ? 'Le code OTP a expiré. Veuillez demander un nouveau code.' : 'The OTP code has expired. Please request a new code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Code OTP invalide.');
      }

      setResetToken(data.token);
      setIsTimerActive(false);
      setStep('reset');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError(lang === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }

    // Password strength check
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-]/.test(password);

    if (password.length < minLength || !hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      setError(lang === 'fr' 
        ? 'Le mot de passe doit comporter au moins 8 caractères, incluant au moins une majuscule, une minuscule, un chiffre et un caractère spécial.' 
        : 'Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: resetToken, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation.');
      }

      setSuccessMsg(data.message || 'Mot de passe mis à jour avec succès.');
      setStep('success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle requesting a new code
  const handleResendOtp = async () => {
    setError(null);
    setOtp('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue.');
      }

      setOtpTimer(300);
      setIsTimerActive(true);
      setSuccessMsg(lang === 'fr' ? 'Un nouveau code a été envoyé.' : 'A new code has been sent.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-5 w-full bg-white relative overflow-hidden">
      
      {/* Partie Gauche (Brand Panel) - Desktop uniquement */}
      <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center bg-[#f7fbf8] p-12 relative overflow-hidden">
        {/* Subtle decorative watermark */}
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
          key={leftImageSrc}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full flex flex-col items-center justify-center"
        >
          <Image 
            src={leftImageSrc} 
            alt="Brand Graphic" 
            width={leftImageSrc === '/ssss.png' ? 220 : 350} 
            height={leftImageSrc === '/ssss.png' ? 220 : 350} 
            className="object-contain"
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
          <div className="flex md:hidden justify-center h-[120px] mb-6 items-center pointer-events-none">
            <Image 
              src="/ChatGPT Image 9 juil. 2026, 00_46_42.png" 
              alt="OTP Logo" 
              width={140} 
              height={140} 
              className="h-full w-auto object-contain"
              priority
            />
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: EMAIL REQUEST */}
            {step === 'email' && (
              <motion.div
                key="step-email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-extrabold text-[#14532d] mb-1 tracking-tight uppercase italic">
                    {lang === 'fr' ? 'Récupération' : 'Recovery'}
                  </h1>
                  <p className="text-gray-500 text-xs font-semibold px-2 leading-relaxed">
                    {lang === 'fr' 
                      ? "Entrez votre email d'administrateur pour recevoir un code OTP sécurisé par SMS." 
                      : "Enter your administrator email to receive a secure OTP code via SMS."}
                  </p>
                </div>

                {/* Error messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 font-bold flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSendOtp} className="space-y-4">
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
                        placeholder="admin@dronek.ci"
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#14532d]/20 disabled:opacity-70 active:scale-95 mt-4"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      lang === 'fr' ? "Envoyer le code OTP" : "Send OTP Code"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === 'otp' && (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-extrabold text-[#14532d] mb-1 tracking-tight uppercase italic">
                    {lang === 'fr' ? 'Code OTP' : 'OTP Code'}
                  </h1>
                  <p className="text-gray-500 text-xs font-semibold px-2 leading-relaxed">
                    {lang === 'fr' 
                      ? `Saisissez le code à 6 chiffres envoyé au numéro associé ${obfuscatedPhone}.` 
                      : `Enter the 6-digit code sent to the associated number ${obfuscatedPhone}.`}
                  </p>
                </div>

                {/* Message indicators */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 font-bold flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl text-xs border border-green-100 font-bold flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800 ml-1">
                      {lang === 'fr' ? 'Code de sécurité' : 'Security Code'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <KeyRound className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all text-center tracking-[0.4em] font-black text-lg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs px-1 font-bold text-gray-500 pt-2">
                    <span>
                      {lang === 'fr' ? 'Expire dans :' : 'Expires in :'} <span className="text-red-500 font-black">{formatTimer(otpTimer)}</span>
                    </span>
                    {otpTimer === 0 ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#14532d] hover:underline"
                      >
                        {lang === 'fr' ? 'Renvoyer le code' : 'Resend Code'}
                      </button>
                    ) : (
                      <span className="text-gray-300">
                        {lang === 'fr' ? 'Renvoyer' : 'Resend'}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#14532d]/20 disabled:opacity-75 active:scale-95 mt-4"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      lang === 'fr' ? "Valider le code" : "Verify Code"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: RESET FORM */}
            {step === 'reset' && (
              <motion.div
                key="step-reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-extrabold text-[#14532d] mb-1 tracking-tight uppercase italic">
                    {lang === 'fr' ? 'Mot de passe' : 'New Password'}
                  </h1>
                  <p className="text-gray-500 text-xs font-semibold px-2 leading-relaxed">
                    {lang === 'fr' 
                      ? "Veuillez définir un mot de passe fort pour l'administrateur." 
                      : "Please define a strong password for the administrator."}
                  </p>
                </div>

                {/* Errors */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 font-bold flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800 ml-1">
                      {lang === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
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
                        placeholder={lang === 'fr' ? "Nouveau mot de passe" : "New Password"}
                        className="w-full pl-11 pr-12 py-3.5 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all text-sm font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800 ml-1">
                      {lang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={lang === 'fr' ? "Confirmer le mot de passe" : "Confirm Password"}
                        className="w-full pl-11 pr-12 py-3.5 bg-[#f8faf9] border border-transparent rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all text-sm font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-450 space-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 font-bold leading-normal">
                    <p className="text-gray-650 uppercase tracking-widest text-[9px] mb-1">{lang === 'fr' ? 'Exigences :' : 'Requirements :'}</p>
                    <p className={password.length >= 8 ? "text-green-600" : "text-gray-450"}>• Au moins 8 caractères</p>
                    <p className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-600" : "text-gray-450"}>• Majuscules & minuscules</p>
                    <p className={/\d/.test(password) ? "text-green-600" : "text-gray-450"}>• Au moins un chiffre</p>
                    <p className={/[!@#$%^&*(),.?":{}|<>_\-]/.test(password) ? "text-green-600" : "text-gray-450"}>• Au moins un caractère spécial</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#14532d]/20 disabled:opacity-75 active:scale-95 mt-4"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      lang === 'fr' ? "Réinitialiser" : "Reset Password"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Success Badge */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 flex items-center justify-center bg-green-50 text-green-600 rounded-full">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                </div>

                {/* Title */}
                <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-[#14532d] mb-1 tracking-tight uppercase italic">
                    {lang === 'fr' ? 'Succès' : 'Success'}
                  </h1>
                  <p className="text-gray-500 text-sm font-semibold leading-relaxed px-1 mt-2">
                    {lang === 'fr' 
                      ? "Votre mot de passe a été mis à jour avec succès." 
                      : "Your password has been successfully updated."}
                  </p>
                </div>

                {/* Return to login button */}
                <Link
                  href="/admin/login"
                  className="w-full flex items-center justify-center bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#14532d]/20 active:scale-95"
                >
                  {lang === 'fr' ? 'Se connecter' : 'Log In'}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Login Link (Hidden on Success step) */}
          {step !== 'success' && (
            <div className="text-center mt-6">
              <Link 
                href="/admin/login" 
                className="group inline-flex items-center justify-center gap-2 text-gray-400 hover:text-[#14532d] font-bold text-[10px] uppercase tracking-widest transition-all"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                {lang === 'fr' ? 'Retour à la connexion' : 'Back to Login'}
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
