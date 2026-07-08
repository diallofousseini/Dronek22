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
    <div className="min-h-screen bg-[#f7fbf8] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Brand Background Image - Optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08]">
        <div className="relative w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]">
          <Image 
            src="/images/AAAAAA-removebg-preview.png" 
            alt="" 
            fill 
            className="object-contain grayscale"
            priority
          />
        </div>
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 overflow-hidden border border-gray-100">
        
        {/* Subtle corner watermark */}
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-[0.05] pointer-events-none">
          <Image 
            src="/images/AAAAAA-removebg-preview.png" 
            alt="" 
            fill 
            className="object-contain grayscale rotate-12"
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
              {/* Top Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <Image 
                    src="/ssss.png" 
                    alt="Security Lock" 
                    width={96} 
                    height={96} 
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight italic">
                  {lang === 'fr' ? 'Mot de passe oublié' : 'Forgot Password'}
                </h1>
                <p className="text-gray-500 text-sm px-2 font-medium leading-relaxed">
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
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@dronek.ci"
                    className="w-full pl-12 pr-4 py-4 bg-[#f8faf9] border border-gray-200 focus:border-[#14532d] focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 transition-all font-bold text-center text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#14532d]/20 disabled:opacity-70 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
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
              {/* Top Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative w-28 h-28 flex items-center justify-center bg-[#14532d]/5 rounded-full text-[#14532d]">
                  <ShieldCheck className="w-14 h-14" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight italic">
                  {lang === 'fr' ? 'Vérification OTP' : 'OTP Verification'}
                </h1>
                <p className="text-gray-500 text-xs px-2 font-semibold leading-relaxed">
                  {lang === 'fr' 
                    ? `Saisissez le code à 6 chiffres envoyé par SMS au numéro associé ${obfuscatedPhone}.` 
                    : `Enter the 6-digit code sent via SMS to the associated number ${obfuscatedPhone}.`}
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
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-12 pr-4 py-4 bg-[#f8faf9] border border-gray-200 focus:border-[#14532d] focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 transition-all font-black text-center tracking-[0.4em] text-lg"
                  />
                </div>

                <div className="flex items-center justify-between text-xs px-1 font-bold text-gray-500">
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
                      {lang === 'fr' ? 'Renvoyer le code' : 'Resend Code'}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#14532d]/20 disabled:opacity-75 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
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
              {/* Top Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative w-28 h-28 flex items-center justify-center bg-[#14532d]/5 rounded-full text-[#14532d]">
                  <Lock className="w-12 h-12" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight italic">
                  {lang === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                </h1>
                <p className="text-gray-500 text-xs px-2 font-semibold leading-relaxed">
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
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={lang === 'fr' ? "Nouveau mot de passe" : "New Password"}
                    className="w-full pl-12 pr-12 py-3.5 bg-[#f8faf9] border border-gray-200 focus:border-[#14532d] focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 transition-all font-semibold text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={lang === 'fr' ? "Confirmer le mot de passe" : "Confirm Password"}
                    className="w-full pl-12 pr-12 py-3.5 bg-[#f8faf9] border border-gray-200 focus:border-[#14532d] focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 transition-all font-semibold text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[10px] text-gray-450 space-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 font-bold leading-normal">
                  <p className="text-gray-600 uppercase tracking-widest text-[9px] mb-1">{lang === 'fr' ? 'Exigences :' : 'Requirements :'}</p>
                  <p className={password.length >= 8 ? "text-green-600" : "text-gray-400"}>• Au moins 8 caractères</p>
                  <p className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-600" : "text-gray-400"}>• Lettres majuscules & minuscules</p>
                  <p className={/\d/.test(password) ? "text-green-600" : "text-gray-400"}>• Au moins un chiffre</p>
                  <p className={/[!@#$%^&*(),.?":{}|<>_\-]/.test(password) ? "text-green-600" : "text-gray-400"}>• Au moins un caractère spécial</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#14532d]/20 disabled:opacity-75 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
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
                <div className="relative w-24 h-24 flex items-center justify-center bg-green-50 text-green-600 rounded-full">
                  <CheckCircle2 className="w-16 h-16" />
                </div>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight italic">
                  {lang === 'fr' ? 'Mot de passe mis à jour' : 'Password Updated'}
                </h1>
                <p className="text-gray-500 text-sm font-semibold leading-relaxed px-1">
                  {lang === 'fr' 
                    ? "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec vos nouvelles informations." 
                    : "Your password has been successfully updated. You can now log in with your new credentials."}
                </p>
              </div>

              {/* Return to login button */}
              <Link
                href="/admin/login"
                className="w-full flex items-center justify-center bg-[#14532d] hover:bg-[#0d361d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#14532d]/20 active:scale-95"
              >
                {lang === 'fr' ? 'Se connecter' : 'Log In'}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Login Link (Hidden on Success step) */}
        {step !== 'success' && (
          <div className="text-center mt-8">
            <Link 
              href="/admin/login" 
              className="group inline-flex items-center justify-center gap-2 text-gray-400 hover:text-[#14532d] font-bold text-[10px] uppercase tracking-widest transition-all"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {lang === 'fr' ? 'Retour à la connexion' : 'Back to Login'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
