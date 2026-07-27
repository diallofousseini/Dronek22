'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Save, Plus, Trash2, Upload, X, Loader2, 
  Zap, Globe, Shield, FileText, Image as ImageIcon, Copy, CheckCircle2, MapPin,
  ChevronDown, LayoutGrid, Play
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/dronek/LanguageProvider';

// --- Types ---
interface ServiceCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  pdfUrl: string;
}

interface ServicePageData {
  banner: {
    title: string;
    description: string;
    image: string;
  };
  cards: ServiceCard[];
  status: string;
}

const SERVICE_IDS = ['forestry', 'drone', 'agroforestry', 'agriculture'];
const SERVICE_LABELS: Record<string, string> = { 
  forestry: 'FORESTERIE', 
  drone: 'DRONE', 
  agroforestry: 'AGROFORESTERIE', 
  agriculture: 'AGRICULTURE' 
};

// --- Main Router ---
export default function UniversalCMSPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f9fafb]"><Loader2 className="w-8 h-8 text-[#149655] animate-spin" /></div>}>
      <CMSRouter />
    </Suspense>
  );
}

function CMSRouter() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'service';
  const id = searchParams.get('id');
  const mode = searchParams.get('mode');

  if (type === 'membre') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Non Autorisé</h1>
        <p className="text-gray-500 mb-6">Le formulaire de membre de l'équipe a été désactivé.</p>
        <Link href="/admin" className="bg-[#149655] hover:bg-[#0f7a44] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] selection:bg-[#149655]/10 relative overflow-hidden">
      {/* Brand Background Image - Same as Login */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08]">
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

      <div className="relative z-10">
        <GenericItemEditor type={type} id={id} mode={mode} />
      </div>
    </div>
  );
}

// ==========================================
// SHARED UI COMPONENTS (PREMIUM)
// ==========================================

function CMSHeader({ title, onSave, saving, isScrolled, scrollProgress, children }: any) {
  const { lang, setLang } = useLanguage();
  return (
    <header className={cn(
      "sticky top-0 z-[100] transition-all duration-300 bg-white/80 backdrop-blur-xl h-20 flex items-center justify-between px-10 shadow-sm",
      isScrolled ? "shadow-md" : "shadow-sm"
    )}>
      {/* ✨ Professional Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-100/30 overflow-hidden">
        <motion.div 
          className="h-full bg-[#149655] origin-left" 
          style={{ width: `${scrollProgress}%` }} 
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="flex-1 flex items-center gap-12">
        <Link href="/admin" className="flex items-center gap-4 text-[#6b7280] hover:text-[#111] font-bold text-sm uppercase tracking-[0.2em] transition-all group">
          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-gray-200 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </div>
          {lang === 'fr' ? 'Retour' : 'Back'}
        </Link>
        
        <div className="flex-1 flex justify-center">
          <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-[#111]">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-10">
        {children}
        <button 
          onClick={onSave} 
          disabled={saving} 
          className="bg-[#149655] hover:bg-[#0b3b24] text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {lang === 'fr' ? 'Sauvegarder' : 'Save'}
        </button>
      </div>
    </header>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="bg-white p-8 space-y-8">
      <div className="flex items-center justify-center gap-4">
        <div className="p-2.5 bg-[#149655]/5 text-[#149655] rounded-xl">{icon}</div>
        <h2 className="text-2xl font-bold uppercase tracking-[0.05em] text-[#111]">{title}</h2>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}

function HorizontalField({ label, value, onChange, placeholder, type = 'text', labelSize = '12px', options = [] }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      <label 
        className="md:col-span-3 font-bold text-[#111827] uppercase tracking-[0.05em] pt-4"
        style={{ fontSize: labelSize }}
      >
        {label}
      </label>
      <div className="md:col-span-9">
        {type === 'textarea' ? (
          <textarea 
            rows={5} 
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            className="w-full px-4 py-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl focus:bg-white focus:border-[#149655] focus:ring-4 focus:ring-[#149655]/5 outline-none transition-all duration-200 text-[14px] font-medium text-[#111827] leading-relaxed placeholder:text-[#9ca3af]"
          />
        ) : type === 'select' ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[50px] px-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl focus:bg-white focus:border-[#149655] focus:ring-4 focus:ring-[#149655]/5 outline-none transition-all duration-200 text-[14px] font-medium text-[#111827] cursor-pointer appearance-none"
          >
            <option value="" disabled>Sélectionner...</option>
            {options.map((opt: any) => (
              <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
          </select>
        ) : (
          <input 
            type="text" 
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            className="w-full h-[50px] px-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl focus:bg-white focus:border-[#149655] focus:ring-4 focus:ring-[#149655]/5 outline-none transition-all duration-200 text-[14px] font-medium text-[#111827] placeholder:text-[#9ca3af]"
          />
        )}
      </div>
    </div>
  );
}

function VerticalField({ label, value, onChange, placeholder, type = 'text', labelSize = '14px', options = [] }: any) {
  return (
    <div className="space-y-3">
      <label 
        className="font-black text-[#111] uppercase tracking-[0.1em] block"
        style={{ fontSize: labelSize }}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea 
          rows={5} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full px-6 py-5 bg-white border border-[#e5e7eb] rounded-2xl focus:border-[#149655] focus:ring-8 focus:ring-[#149655]/5 outline-none transition-all duration-300 text-[15px] font-semibold text-[#111] leading-relaxed placeholder:text-[#9ca3af] shadow-sm"
        />
      ) : (
        <input 
          type="text" 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full h-[60px] px-6 bg-white border border-[#e5e7eb] rounded-2xl focus:border-[#149655] focus:ring-8 focus:ring-[#149655]/5 outline-none transition-all duration-300 text-[15px] font-semibold text-[#111] placeholder:text-[#9ca3af] shadow-sm"
        />
      )}
    </div>
  );
}

const sanitizeFileName = (name: string) => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.]/gi, '_')
    .toLowerCase();
};

function SimpleUpload({ value, onChange, path }: { value: string, onChange: (v: string) => void, path: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [up, setUp] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  
  const handle = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Check file size (Supabase limit)
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (f.size > MAX_SIZE) {
      alert("Le fichier est trop volumineux (max 50 Mo). Veuillez le compresser.");
      return;
    }
    
    const objectUrl = URL.createObjectURL(f);
    setLocalPreview(objectUrl);
    
    setUp(true);
    try {
      const fileName = `${Date.now()}_${sanitizeFileName(f.name)}`;
      console.log("🚀 Tentative d'upload vers Supabase...");
      console.log("📁 Chemin :", `${path}/${fileName}`);
      
      // Try 'IMAGES' bucket first (matching your screenshot)
      let bucket = 'IMAGES';
      console.log("🪣 Bucket cible :", bucket);

      let { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${path}/${fileName}`, f, { cacheControl: '3600', upsert: true });

      if (error) {
        console.warn("⚠️ Échec sur bucket IMAGES, tentative sur DOCUMENTS...", error);
        // Fallback to 'DOCUMENTS' bucket
        bucket = 'DOCUMENTS';
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from(bucket)
          .upload(`${path}/${fileName}`, f, { cacheControl: '3600', upsert: true });
        
        if (fallbackError) {
           console.error("❌ Échec critique sur les deux buckets :", fallbackError);
           throw fallbackError;
        }
        data = fallbackData;
      }

      if (data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        console.log("✅ Upload réussi ! URL :", urlData.publicUrl);
        onChange(urlData.publicUrl);
      }
    } catch (err: any) {
      console.error("🔥 Erreur lors de l'upload :", err);
      alert("Erreur lors de l'upload : " + (err.message || "Erreur inconnue"));
    }
    setUp(false);
  };

  return (
    <div 
      onClick={() => fileRef.current?.click()} 
      className="relative min-h-[250px] w-full bg-[#fafafa] border-2 border-dashed border-[#d1d5db] rounded-[16px] overflow-hidden flex flex-col items-center justify-center cursor-pointer group hover:bg-[#f3f4f6] hover:border-[#149655] transition-all duration-300"
    >
       {up ? (
          <div className="relative w-full h-full min-h-[250px] flex flex-col items-center justify-center overflow-hidden">
            {localPreview && <img src={localPreview} alt="Uploading preview" className="absolute inset-0 object-cover w-full h-full opacity-40 blur-[2px]" />}
            <Loader2 className="w-10 h-10 animate-spin text-[#149655] relative z-10 drop-shadow-md" />
            <span className="text-[#149655] font-bold text-xs mt-3 uppercase tracking-widest relative z-10 drop-shadow-md">Upload en cours...</span>
          </div>
       ) : localPreview || value ? (
         <>
           <img 
             src={localPreview || value} 
             alt="Preview" 
             className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
             onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }} 
           />
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-2">
              <ImageIcon className="w-6 h-6" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Modifier l&apos;image</span>
           </div>
         </>
       ) : (
         <div className="flex flex-col items-center gap-3 text-center px-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-110">
               <Upload className="w-5 h-5 text-[#6b7280] group-hover:text-[#149655]" />
            </div>
            <div className="space-y-1">
              <span className="text-[12px] font-medium text-[#6b7280] uppercase tracking-widest block transition-colors group-hover:text-[#149655]">Uploader l&apos;image</span>
              <span className="text-[11px] text-[#9ca3af] uppercase tracking-wide">Toute résolution (JPG, PNG, WEBP)</span>
            </div>
         </div>
       )}
       <input ref={fileRef} type="file" hidden accept="image/*" onChange={handle} />
    </div>
  );
}

function VideoUpload({ value, onChange, path }: { value: string, onChange: (v: string) => void, path: string }) {
  const { lang } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [up, setUp] = useState(false);
  
  const handle = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Check file size (Supabase default limit is 50MB on free tier)
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (f.size > MAX_SIZE) {
      alert(lang === 'fr' 
        ? "Le fichier est trop volumineux (max 50 Mo). Veuillez compresser votre vidéo ou utiliser un lien YouTube/Facebook/Vimeo." 
        : "File is too large (max 50 MB). Please compress your video or use a YouTube/Facebook/Vimeo link.");
      return;
    }

    setUp(true);
    try {
      const fileName = `${Date.now()}_${sanitizeFileName(f.name)}`;
      let bucket = 'IMAGES';
      let { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${path}/${fileName}`, f, { cacheControl: '3600', upsert: true });

      if (error) {
        if (error.message?.includes('exceeded the maximum allowed size')) {
          throw new Error(lang === 'fr' ? "Le fichier dépasse la limite autorisée par le serveur." : "File exceeds the maximum allowed size on the server.");
        }
        bucket = 'DOCUMENTS';
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from(bucket)
          .upload(`${path}/${fileName}`, f, { cacheControl: '3600', upsert: true });
        
        if (fallbackError) throw fallbackError;
        data = fallbackData;
      }

      if (data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        onChange(urlData.publicUrl);
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      alert(err.message || (lang === 'fr' ? "Erreur lors de l'upload" : "Upload error"));
    }
    setUp(false);
  };

  return (
    <div className="flex flex-col gap-2">
       <input type="file" ref={fileRef} onChange={handle} accept="video/*" className="hidden" />
       <button 
         type="button"
         onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileRef.current?.click(); }}
         disabled={up}
         className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
       >
         {up ? <Loader2 className="w-3 h-3 animate-spin text-[#149655]" /> : <Upload className="w-3 h-3 text-[#149655]" />}
         {up ? "Upload..." : value ? "Changer" : "Uploader"}
       </button>
    </div>
  );
}


function PdfUpload({ value, onChange, path }: { value: string, onChange: (v: string) => void, path: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [up, setUp] = useState(false);
  
  const handle = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUp(true);
    try {
      const fileName = `${Date.now()}_${f.name.replace(/\s/g, '_')}`;
      const bucket = 'DOCUMENTS';
      const storagePath = path ? `${path}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, f, { cacheControl: '3600', upsert: true });

      if (error) throw error;
      
      if (data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        onChange(urlData.publicUrl);
      }
    } catch (err) {
      console.error("PDF Upload error:", err);
    }
    setUp(false);
  };

  return (
    <div className="flex items-center gap-3">
       <button 
         onClick={() => fileRef.current?.click()} 
         disabled={up} 
         className={cn(
           "flex-1 h-[50px] px-6 border rounded-xl text-[12px] font-medium uppercase tracking-widest transition-all duration-200 flex items-center gap-3 active:scale-[0.98]",
           value 
             ? "bg-green-50 border-green-100 text-green-700" 
             : "bg-[#f9fafb] border-[#e5e7eb] text-[#6b7280] hover:border-[#149655] hover:text-[#149655]"
         )}
       >
          {up ? <Loader2 className="w-4 h-4 animate-spin" /> : value ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          {value ? "PDF Ajouté" : "Fiche technique (PDF)"}
       </button>
       {value && (
         <button onClick={() => onChange('')} className="w-[50px] h-[50px] bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all flex items-center justify-center active:scale-90 border border-red-50">
           <Trash2 className="w-4 h-4" />
         </button>
       )}
       <input ref={fileRef} type="file" hidden accept=".pdf" onChange={handle} />
    </div>
  );
}

function GenericItemEditor({ type, id, mode }: { type: string, id?: string | null, mode?: string | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const { lang } = useLanguage();
  const [data, setData] = useState<any>({ 
    title: '', name: '', category: '', content: '', description: '', 
    role: '', bio: '', linkedin: '', image: '', status: 'Publié',
    email: '', phone: '', location: '',
    year: '', objectives: [], impacts: [],
    date: '',
    capacity: '', surface: '', desc: '',
    employees: '', services: '',
    isFeatured: false, isMainService: false, pdfUrl: '',
    detailTitle: '', detailShortDesc: '', detailLongDesc: '',
    serviceType: 'forestry', buttonText: 'En savoir plus',
    lat: '', lng: '',
    galleryImages: []
  });
  const [saving, setSaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formMode, setFormMode] = useState<'featured' | 'regular'>(
    mode === 'featured' ? 'featured' : 'regular'
  );
  const [allExpertiseDomains, setAllExpertiseDomains] = useState<any[]>([]);

  useEffect(() => {
    if (type === 'service' && allExpertiseDomains.length > 0) {
      const isValidDomain = allExpertiseDomains.some(d => d.id === data.serviceType);
      if (!isValidDomain) {
        const matchedDomain = allExpertiseDomains.find(d => 
          (d.titre || '').toLowerCase().trim() === (data.serviceType || '').toLowerCase().trim()
        );
        const nextId = matchedDomain ? matchedDomain.id : allExpertiseDomains[0].id;
        setData((prev: any) => {
          if (prev.serviceType === nextId) return prev;
          return { ...prev, serviceType: nextId };
        });
      }
    }
  }, [allExpertiseDomains, type, data.serviceType]);

  useEffect(() => {
    if (type === 'service') {
      const fetchDomains = async () => {
        const { data: list } = await supabase
          .from('services')
          .select('*')
          .in('statut', ['publie', 'Publié', 'Published']);
        if (list) {
          const { data: config } = await supabase.from('contacts').select('*').eq('sujet', 'MainServices').single();
          let mainIds: string[] = [];
          if (config && config.message) {
            try { mainIds = JSON.parse(config.message); } catch (e) {}
          }
          const domains = list.filter(item => mainIds.includes(item.id) || item.service_type === 'domain');
          setAllExpertiseDomains(domains);
        }
      };
      fetchDomains();
    }
  }, [type]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        setTimeout(() => router.push('/admin'), 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, router]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (id && type !== 'mediatheque') {
      const table = type === 'projet' ? 'projets' : 
                    type === 'actualite' ? 'actualites' : 
                    type === 'membre' ? 'equipe' : 
                    type === 'production_site' ? 'production_sites' : 
                    type === 'service' ? 'services' : 'contacts';
      
      supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data: item }) => {
          if (item) {
            let year = '';
            let objectives: string[] = [];
            let impacts: string[] = [];
            let gallery: string[] = [];
            let description = item.description_courte || item.description || '';
            let descriptionShort = item.description_courte || '';

            if (type === 'projet' && item.description_complete && item.description_complete.startsWith('{') && item.description_complete.endsWith('}')) {
              try {
                const parsed = JSON.parse(item.description_complete);
                description = parsed.detail || '';
                year = parsed.year || '';
                objectives = parsed.objectives || [];
                impacts = parsed.impacts || [];
                gallery = parsed.gallery || [];
              } catch (e) {
                console.error("Error parsing description_complete:", e);
                description = item.description_complete;
              }
            } else if (type === 'projet') {
              description = item.description_complete || item.description_courte || '';
            }

            setData({
              ...item,
              title: item.titre || item.title,
              description: description,
              descriptionShort: descriptionShort,
              image: item.image_url || item.image,
              status: item.statut || item.status,
              phone: item.telephone || item.phone,
              location: item.message || item.location,
              name: item.nom ? `${item.prenom || ''} ${item.nom}` : item.name,
              role: item.poste || item.role,
              bio: item.biographie || item.bio,
              detailTitle: item.detail_title || item.detailTitle || '',
              detailShortDesc: item.detail_short_desc || item.detailShortDesc || '',
              detailLongDesc: item.detail_long_desc || item.detailLongDesc || '',
              serviceType: item.service_type || item.serviceType || 'forestry',
              isMainService: false,
              pdfUrl: item.button_text || item.pdf_url || item.pdfUrl || '',
              // production_site specific field mapping
              desc: item.description || item.desc || '',
              lat: item.latitude?.toString() || item.lat || '',
              lng: item.longitude?.toString() || item.lng || '',
              // project specific fields
              year: year,
              objectives: objectives,
              impacts: impacts,
              gallery: gallery,
              // actualite gallery images
              galleryImages: (() => {
                if (item.gallery) {
                  try {
                    const parsed = JSON.parse(item.gallery);
                    if (Array.isArray(parsed)) return parsed;
                  } catch (e) {}
                }
                return [];
              })()
            });

            if (type === 'service') {
              const isDomain = item.service_type === 'domain';
              if (isDomain) {
                setFormMode('featured');
              }
              supabase.from('contacts').select('*').eq('sujet', 'MainServices').single().then(({ data: config }) => {
                if (config && config.message) {
                  try {
                    const mainIds = JSON.parse(config.message);
                    if (Array.isArray(mainIds) && mainIds.includes(item.id)) {
                      setData(prev => ({ ...prev, isMainService: true }));
                      setFormMode('featured');
                    }
                  } catch (e) {}
                }
              });
            }
          }
        });
    } else if (type === 'mediatheque') {
      supabase
        .from('contacts')
        .select('*')
        .eq('sujet', 'Mediatheque')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data: item }) => {
          if (item) {
            try {
              const mediathequeData = JSON.parse(item.message || '{}');
              setData((prev) => ({ 
                ...prev, 
                id: item.id,
                mediatheque: {
                  images: mediathequeData.images || Array(8).fill(''),
                  videos: mediathequeData.videos || Array(2).fill('')
                }
              }));
            } catch (e) {
              setData((prev) => ({ 
                ...prev, 
                id: item.id,
                mediatheque: { images: Array(8).fill(''), videos: Array(2).fill('') }
              }));
            }
          } else {
            setData((prev) => ({ 
              ...prev, 
              mediatheque: { images: Array(8).fill(''), videos: Array(2).fill('') }
            }));
          }
        });
    } else if (type === 'contact' && !id) {
      supabase
        .from('contacts')
        .select('*')
        .eq('sujet', 'Configuration')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data: item }) => {
          if (item) {
            setData((prev: any) => ({
              ...prev,
              ...item,
              email: item.email || '',
              phone: item.telephone || '',
              location: item.message || '',
            }));
          }
        });
    }
  }, [id, type]);

  const handleSave = async () => {
    const isMember = type === 'membre';
    const isContact = type === 'contact';
    const isProdSite = type === 'production_site';
    
    let hasRequiredFields = false;
    if (isMember) {
      hasRequiredFields = !!(data.name && data.role && data.image);
    } else if (isContact) {
      hasRequiredFields = !!(data.email && data.phone && data.location);
    } else if (isProdSite) {
      hasRequiredFields = !!(data.name && data.location && data.image);
    } else if (type === 'service') {
      if (formMode === 'featured') {
        hasRequiredFields = !!(data.title && data.description && data.image);
      } else {
        hasRequiredFields = !!(data.title && data.description);
      }
    } else if (type === 'projet') {
      hasRequiredFields = true; // Tous les champs sont optionnels pour la sauvegarde
    } else if (type === 'actualite') {
      hasRequiredFields = !!(data.title && data.description && data.image);
    } else if (type === 'mediatheque') {
      hasRequiredFields = true;
    } else {
      hasRequiredFields = !!(data.title && (data.category || data.content || data.description) && data.image);
    }

    if (!hasRequiredFields) {
      setShowErrorModal(true);
      return;
    }

    setSaving(true);
    try {
      let table: any = type === 'membre' ? 'equipe' : type === 'projet' ? 'projets' : type === 'actualite' ? 'actualites' : 'services';
      let payload: any = {};
      if (id) payload.id = id;

      if (type === 'projet') {
        const serializedDescription = JSON.stringify({
          detail: data.description || '',
          year: data.year || '',
          objectives: data.objectives || [],
          impacts: data.impacts || []
        });

        payload = { 
          ...payload, 
          titre: data.title, 
          categorie: data.category, 
          description_courte: data.descriptionShort || data.description || '', 
          description_complete: serializedDescription,
          image_url: data.image, 
          localisation: data.location, 
          is_featured: !!data.isFeatured,
          statut: data.status || 'publie'
        };
      } else if (type === 'membre') {
        const [prenom, ...nomParts] = (data.name || '').split(' ');
        payload = { 
          ...payload, 
          prenom, 
          nom: nomParts.join(' '), 
          poste: data.role, 
          biographie: data.bio, 
          photo_url: data.image, 
          email: data.email,
          linkedin: data.linkedin,
          statut: data.status || 'publie'
        };
      } else if (type === 'service') {
        payload = { 
          ...payload, 
          titre: data.title, 
          description_courte: data.description, 
          image_url: data.image || null, 
          service_type: formMode === 'regular' ? data.serviceType : 'domain',
          description_complete: '',
          detail_title: null,
          detail_short_desc: null,
          detail_long_desc: null,
          button_text: formMode === 'regular' ? data.pdfUrl : null, // repurposing button_text for PDF URL
          statut: data.status || 'publie'
        };
      } else if (type === 'actualite') {
        payload = { 
          ...payload, 
          titre: data.title, 
          resume: data.description, 
          contenu: data.content,
          image_url: data.image,
          gallery: data.galleryImages && data.galleryImages.length > 0 ? JSON.stringify(data.galleryImages) : null,
          statut: data.status || 'publie',
          date_publication: data.date || new Date().toISOString()
        };
      } else if (type === 'contact') {
        table = 'contacts';
        payload = { ...payload, email: data.email, telephone: data.phone, sujet: 'Configuration', message: data.location, statut: 'publie' };
      } else if (type === 'production_site') {
        table = 'production_sites';
        payload = { 
          ...payload, 
          nom: data.name, 
          localisation: data.location, 
          image_url: data.image,
          description: data.desc || data.description,
          ...(data.lat && { lat: parseFloat(data.lat) || data.lat }),
          ...(data.lng && { lng: parseFloat(data.lng) || data.lng }),
          statut: 'publie'
        };
      } else if (type === 'mediatheque') {
        table = 'contacts';
        payload = { 
          ...payload, 
          sujet: 'Mediatheque',
          nom: 'Configuration',
          email: 'admin@dronek.ci',
          telephone: 'N/A',
          message: JSON.stringify(data.mediatheque || { images: Array(8).fill(''), videos: Array(2).fill('') }),
          statut: 'publie'
        };
      } else {
        payload = { ...payload, titre: data.title, image_url: data.image, statut: data.status || 'publie' };
      }

      const targetId = id || (type === 'mediatheque' || type === 'contact' ? data.id : null);
      const { data: savedData, error } = targetId 
        ? await supabase.from(table).update(payload).eq('id', targetId).select().single()
        : await supabase.from(table).insert([payload]).select().single();
      
      if (error) throw new Error(`Supabase [${error.code}]: ${error.message}`);

      if (type === 'service' && savedData) {
        const { data: config } = await supabase.from('contacts').select('*').eq('sujet', 'MainServices').single();
        let mainIds: string[] = [];
        if (config && config.message) {
          try { mainIds = JSON.parse(config.message); } catch (e) {}
        }
        if (data.isMainService) {
          if (!mainIds.includes(savedData.id)) mainIds.push(savedData.id);
        } else {
          mainIds = mainIds.filter(mid => mid !== savedData.id);
        }
        if (config) {
          await supabase.from('contacts').update({ message: JSON.stringify(mainIds) }).eq('id', config.id);
        } else {
          await supabase.from('contacts').insert([{ sujet: 'MainServices', message: JSON.stringify(mainIds), statut: 'publie' }]);
        }
      }

      setShowSuccessModal(true);

    } catch (e: any) {
      console.error("❌ [CATCH]", e);
      toast({ title: lang === 'fr' ? 'Erreur' : 'Error', description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const labels: Record<string, React.ReactNode> = {
    projet: <><span className="text-[#111]">{lang === 'fr' ? 'Espace' : 'Space'}</span> <span className="text-[#149655]">{lang === 'fr' ? 'Projet' : 'Project'}</span></>,
    actualite: <><span className="text-[#111]">{lang === 'fr' ? 'Espace' : 'Space'}</span> <span className="text-[#149655]">{lang === 'fr' ? 'Actualités' : 'News'}</span></>,
    membre: <><span className="text-[#111]">{lang === 'fr' ? 'Espace' : 'Space'}</span> <span className="text-[#149655]">{lang === 'fr' ? 'Membres' : 'Members'}</span></>,
    contact: <><span className="text-[#111]">{lang === 'fr' ? 'Espace' : 'Space'}</span> <span className="text-[#149655]">Contact</span></>,
    production_site: <><span className="text-[#111]">{lang === 'fr' ? 'Sites' : 'Sites'}</span> <span className="text-[#149655]">{lang === 'fr' ? 'Production' : 'Production'}</span></>,
    service: <><span className="text-[#111]">{lang === 'fr' ? 'Espace' : 'Space'}</span> <span className="text-[#149655]">Service</span></>,
    mediatheque: <><span className="text-[#111]">{lang === 'fr' ? 'Espace' : 'Space'}</span> <span className="text-[#149655]">{lang === 'fr' ? 'Média' : 'Gallery'}</span></>,
  };

  return (
    <>
      <CMSHeader title={labels[type]} onSave={handleSave} saving={saving} isScrolled={isScrolled} scrollProgress={scrollProgress} />
      <main className="max-w-[1000px] mx-auto py-8 px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="space-y-12">
          {type === 'service' && !id && !mode && (
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-2 border border-gray-200 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('featured');
                    setData(prev => ({ ...prev, isMainService: true }));
                  }}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200",
                    formMode === 'featured'
                      ? "bg-white text-[#149655] shadow-md border border-gray-100"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Domaine d'expertise
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('regular');
                    setData(prev => ({ ...prev, isMainService: false }));
                  }}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200",
                    formMode === 'regular'
                      ? "bg-white text-[#149655] shadow-md border border-gray-100"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Service
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-12">
             {type === 'projet' && (
               <div className="flex items-center justify-between py-3 w-full max-w-md mx-auto mb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                     <Zap className={cn("w-5 h-5", data.isFeatured ? "text-[#149655] fill-[#149655]" : "text-gray-400")} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-[#111] uppercase tracking-tight">{lang === 'fr' ? 'Mettre en avant ce projet' : 'Feature this project'}</p>
                   </div>
                 </div>
                 <button
                   type="button"
                   onClick={() => setData({ ...data, isFeatured: !data.isFeatured })}
                   className={cn(
                     "relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none border-2",
                     data.isFeatured ? "bg-[#149655] border-[#149655]" : "bg-gray-200 border-gray-300"
                   )}
                 >
                   <span
                     className={cn(
                       "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md",
                       data.isFeatured ? "translate-x-6" : "translate-x-1"
                     )}
                   />
                 </button>
               </div>
             )}
             {type !== 'contact' && type !== 'production_site' && type !== 'service' && type !== 'actualite' && (
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
               >
                 <HorizontalField 
                   labelSize="16px"
                   label={type === 'membre' ? "Nom Complet" : "Titre Principal"} 
                   value={data.title || data.name} 
                   onChange={(v: string) => setData({ ...data, [type === 'membre' ? 'name' : 'title']: v })} 
                 />
               </motion.div>
             )}

             {type === 'production_site' && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="space-y-12"
               >
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {/* Left Column: Info */}
                   <div className="space-y-8">
                     <VerticalField labelSize="13px" label="Nom du Site" value={data.name} onChange={(v: string) => setData({ ...data, name: v })} placeholder="ex: Site de Bonoua" />
                     <VerticalField labelSize="13px" label="Localisation" value={data.location} onChange={(v: string) => setData({ ...data, location: v })} placeholder="ex: Bonoua, Côte d'Ivoire" />
                      <div className="space-y-3">
                        <label className="text-[13px] font-black text-[#111] uppercase tracking-[0.1em] block">Géolocalisation sur la carte</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-2xl px-4 h-[60px] shadow-sm">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lat</label>
                            <input 
                              type="text" 
                              value={data.lat} 
                              onChange={(e) => setData({ ...data, lat: e.target.value })} 
                              placeholder="ex: 5.2719"
                              className="w-full bg-transparent outline-none font-bold text-sm text-center"
                            />
                          </div>
                          <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-2xl px-4 h-[60px] shadow-sm">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lng</label>
                            <input 
                              type="text" 
                              value={data.lng} 
                              onChange={(e) => setData({ ...data, lng: e.target.value })} 
                              placeholder="ex: -3.5950"
                              className="w-full bg-transparent outline-none font-bold text-sm text-center"
                            />
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Right Column: Image */}
                   <div className="flex flex-col items-center justify-center space-y-6">
                     <label className="text-[14px] font-black text-[#111] uppercase tracking-[0.2em] block text-center">Image du Site</label>
                     <div className="w-full max-w-sm">
                       <SimpleUpload value={data.image} onChange={(v) => setData({ ...data, image: v })} path={`uploads/${type}`} />
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}

             {type === 'contact' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <HorizontalField labelSize="16px" label="Email" value={data.email} onChange={(v: string) => setData({ ...data, email: v })} placeholder="contact@dronek.ci" />
                  <HorizontalField labelSize="16px" label={lang === 'fr' ? "Numéros de téléphone" : "Phone numbers"} type="textarea" value={data.phone} onChange={(v: string) => setData({ ...data, phone: v })} placeholder={lang === 'fr' ? "ex: +225 07 07 73 22 64 (un par ligne)" : "e.g. +225 07 07 73 22 64 (one per line)"} />
                  <HorizontalField labelSize="16px" label={lang === 'fr' ? "Adresse complète" : "Full address"} type="textarea" value={data.location} onChange={(v: string) => setData({ ...data, location: v })} placeholder="Abidjan Cocody 216 Logements..." />
                </motion.div>
              )}

             {type === 'projet' && (
                <motion.div 
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <HorizontalField 
                    labelSize="16px" 
                    label={lang === 'fr' ? "Secteur" : "Sector"} 
                    type="select"
                    value={data.category || 'Foresterie'} 
                    onChange={(v: string) => setData({ ...data, category: v })} 
                    options={[
                      { value: "Foresterie", label: "Foresterie" },
                      { value: "Agriculture", label: "Agriculture" },
                      { value: "Drone et technologie", label: "Drone et technologie" }
                    ]}
                  />
                  <HorizontalField labelSize="16px" label={lang === 'fr' ? "Localisation" : "Location"} value={data.location || ''} onChange={(v: string) => setData({ ...data, location: v })} placeholder={lang === 'fr' ? "ex: Parc National de Taï" : "e.g. Tai National Park"} />
                  <HorizontalField labelSize="16px" label={lang === 'fr' ? "Année" : "Year"} value={data.year || ''} onChange={(v: string) => setData({ ...data, year: v })} placeholder={lang === 'fr' ? "ex: 2023" : "e.g. 2023"} />
                  <HorizontalField labelSize="16px" label={lang === 'fr' ? "Objectifs" : "Objectives"} type="textarea" value={Array.isArray(data.objectives) ? data.objectives.join('\n') : data.objectives || ''} onChange={(v: string) => setData({ ...data, objectives: v.split('\n').filter(Boolean) })} placeholder={lang === 'fr' ? "Lister les objectifs (un par ligne)..." : "List objectives (one per line)..."} />
                  <HorizontalField labelSize="16px" label={lang === 'fr' ? "Description" : "Description"} type="textarea" value={data.description || ''} onChange={(v: string) => setData({ ...data, description: v })} placeholder={lang === 'fr' ? "Description générale du projet..." : "General description of the project..."} />
                </motion.div>
              )}

             {type === 'service' && formMode === 'featured' && (
                <div className="space-y-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6 border border-gray-100 p-8 rounded-[2rem] bg-[#fcfdfc] shadow-sm"
                  >
                     <div className="flex items-center justify-center gap-3 pb-2">
                       <Zap className="w-5 h-5 text-[#149655]" />
                       <h3 className="font-bold text-[#111] uppercase tracking-wider text-sm">{lang === 'fr' ? "DOMAINE D'EXPERTISE" : "DOMAIN OF EXPERTISE"}</h3>
                     </div>
                     
                     <HorizontalField labelSize="14px" label={lang === 'fr' ? "Titre" : "Title"} value={data.title} onChange={(v: string) => setData({ ...data, title: v })} placeholder={lang === 'fr' ? "Titre du domaine d'expertise..." : "Title of the domain of expertise..."} />
                     <HorizontalField labelSize="14px" label={lang === 'fr' ? "Description" : "Description"} type="textarea" value={data.description} onChange={(v: string) => setData({ ...data, description: v })} placeholder={lang === 'fr' ? "Description du domaine d'expertise..." : "Description of the domain of expertise..."} />
                     
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-4">
                       <label className="md:col-span-3 font-bold text-[#111827] uppercase tracking-[0.05em] pt-4" style={{ fontSize: '14px' }}>{lang === 'fr' ? "Image" : "Image"}</label>
                       <div className="md:col-span-9 max-w-md">
                         <SimpleUpload value={data.image} onChange={(v) => setData({ ...data, image: v })} path={`uploads/${type}`} />
                       </div>
                     </div>
                  </motion.div>
                </div>
              )}

             {type === 'service' && formMode === 'regular' && (
                <div className="space-y-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6 border border-gray-100 p-8 rounded-[2rem] bg-[#fcfdfc] shadow-sm"
                  >
                     <div className="flex items-center justify-center gap-3 pb-2">
                       <FileText className="w-5 h-5 text-[#149655]" />
                       <h3 className="font-bold text-[#111] uppercase tracking-wider text-sm">{lang === 'fr' ? "SERVICE" : "SERVICE"}</h3>
                     </div>
                     
                     <HorizontalField 
                       labelSize="14px" 
                       label={lang === 'fr' ? "Domaine d'expertise parent" : "Parent domain of expertise"} 
                       type="select" 
                       value={data.serviceType} 
                       onChange={(v: string) => setData({ ...data, serviceType: v })} 
                       options={allExpertiseDomains.map(d => ({ value: d.id, label: d.titre || d.title }))} 
                     />

                     <HorizontalField labelSize="14px" label={lang === 'fr' ? "Titre" : "Title"} value={data.title} onChange={(v: string) => setData({ ...data, title: v })} placeholder={lang === 'fr' ? "Titre du service..." : "Title of the service..."} />
                     <HorizontalField labelSize="14px" label={lang === 'fr' ? "Description" : "Description"} type="textarea" value={data.description} onChange={(v: string) => setData({ ...data, description: v })} placeholder={lang === 'fr' ? "Description du service..." : "Description of the service..."} />
                     
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-4">
                       <label className="md:col-span-3 font-bold text-[#111827] uppercase tracking-[0.05em] pt-4" style={{ fontSize: '14px' }}>{lang === 'fr' ? "Image" : "Image"}</label>
                       <div className="md:col-span-9 max-w-md">
                         <SimpleUpload value={data.image} onChange={(v) => setData({ ...data, image: v })} path={`uploads/${type}`} />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4">
                       <label className="md:col-span-3 font-bold text-[#111827] uppercase tracking-[0.05em]" style={{ fontSize: '14px' }}>{lang === 'fr' ? "Fiche technique (PDF)" : "Technical sheet (PDF)"}</label>
                       <div className="md:col-span-9">
                         <PdfUpload value={data.pdfUrl} onChange={(v: string) => setData({ ...data, pdfUrl: v })} path={`pdfs/services`} />
                       </div>
                     </div>
                  </motion.div>
                </div>
              )}

             {type === 'actualite' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Info */}
                    <div className="space-y-8">
                      <VerticalField labelSize="13px" label={lang === 'fr' ? "Titre de l'actualité" : "News Title"} value={data.title} onChange={(v: string) => setData({ ...data, title: v })} placeholder={lang === 'fr' ? "Titre principal..." : "Main title..."} />
                      <VerticalField labelSize="13px" label={lang === 'fr' ? "Contenu / Description" : "Content / Description"} type="textarea" value={data.content || data.description} onChange={(v: string) => setData({ ...data, content: v, description: v })} placeholder={lang === 'fr' ? "Détails de l'actualité..." : "News details..."} />
                    </div>

                    {/* Right Column: Image principale */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <label className="text-[14px] font-black text-[#111] uppercase tracking-[0.2em] block text-center">{lang === 'fr' ? "Image principale (Image 1)" : "Main Image (Image 1)"}</label>
                      <div className="w-full max-w-sm">
                        <SimpleUpload value={data.image} onChange={(v) => setData({ ...data, image: v })} path={`uploads/${type}`} />
                      </div>
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                      <h3 className="text-[14px] font-black text-[#111] uppercase tracking-[0.2em]">
                        {lang === 'fr' ? "Galerie d'images supplémentaires" : 'Additional Image Gallery'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="space-y-3 bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">
                            {lang === 'fr' ? `Photo galerie ${i + 1}` : `Gallery Photo ${i + 1}`}
                          </label>
                          <SimpleUpload 
                            value={data.galleryImages?.[i] || ''} 
                            onChange={(url) => {
                              const newGallery = [...(data.galleryImages || Array(6).fill(''))];
                              while (newGallery.length <= i) newGallery.push('');
                              newGallery[i] = url;
                              setData({ ...data, galleryImages: newGallery });
                            }} 
                            path={`uploads/${type}/gallery`} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
             {type === 'membre' && (
               <div className="space-y-6">
                 <HorizontalField label={lang === 'fr' ? "Poste / Responsabilité" : "Position / Responsibility"} value={data.role} onChange={(v: string) => setData({ ...data, role: v })} placeholder={lang === 'fr' ? "ex: Responsable Agricole" : "e.g. Agricultural Manager"} />
                 <HorizontalField label={lang === 'fr' ? "Lien Facebook" : "Facebook Link"} value={data.facebook} onChange={(v: string) => setData({ ...data, facebook: v })} placeholder="https://facebook.com/..." />
                 <HorizontalField label={lang === 'fr' ? "Lien LinkedIn" : "LinkedIn Link"} value={data.linkedin} onChange={(v: string) => setData({ ...data, linkedin: v })} placeholder="https://linkedin.com/in/..." />
                  <HorizontalField label={lang === 'fr' ? "Lien Email" : "Email Link"} value={data.email} onChange={(v: string) => setData({ ...data, email: v })} placeholder="exemple@dronek.net" />
                </div>
             )}

              {type === 'mediatheque' && (
                <div className="space-y-16">
                  {/* Images Section */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                      <ImageIcon className="w-6 h-6 text-[#149655]" />
                      <h3 className="text-xl font-bold uppercase tracking-widest text-gray-800">
                        {lang === 'fr' ? 'Images du Média (1 à 2)' : 'Gallery Images (1 to 8)'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="space-y-3 bg-gray-50 p-4 rounded-[2rem] border border-gray-100 shadow-sm">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">Position {i + 1}</label>
                          <SimpleUpload 
                            value={data.mediatheque?.images?.[i] || ''} 
                            onChange={(url) => {
                              const newImages = [...(data.mediatheque?.images || Array(8).fill(''))];
                              newImages[i] = url;
                              setData({ ...data, mediatheque: { ...(data.mediatheque || { images: Array(8).fill(''), videos: Array(2).fill('') }), images: newImages } });
                            }} 
                            path="mediatheque" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Videos Section */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                      <FileText className="w-6 h-6 text-[#149655]" />
                      <h3 className="text-xl font-bold uppercase tracking-widest text-gray-800">
                        {lang === 'fr' ? 'Vidéos YouTube (2 maximum)' : 'YouTube Videos (2 maximum)'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {/* Vidéo 1 */}
                      <div className="space-y-3 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Vidéo 1 (YouTube, FB, Vimeo, Local)</label>
                          <VideoUpload 
                            value={data.mediatheque?.videos?.[0] || ''} 
                            onChange={(v) => {
                              const newVideos = [...(data.mediatheque?.videos || Array(2).fill(''))];
                              newVideos[0] = v;
                              setData({ ...data, mediatheque: { ...(data.mediatheque || { images: Array(8).fill(''), videos: Array(2).fill('') }), videos: newVideos } });
                            }}
                            path={`mediatheque/${id || 'new'}`}
                          />
                        </div>
                        <input 
                          type="text" 
                          value={data.mediatheque?.videos?.[0] || ''} 
                          onChange={(e) => {
                            const val = e.target.value;
                            const newVideos = [...(data.mediatheque?.videos || Array(2).fill(''))];
                            newVideos[0] = val;
                            setData({ ...data, mediatheque: { ...(data.mediatheque || { images: Array(8).fill(''), videos: Array(2).fill('') }), videos: newVideos } });
                          }} 
                          placeholder="Lien YouTube, Facebook, Vimeo..."
                          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:border-[#149655] outline-none text-sm font-bold placeholder:font-normal placeholder:text-gray-300"
                        />
                        {data.mediatheque?.videos?.[0] ? (
                           <div className="relative aspect-video rounded-xl overflow-hidden mt-3 shadow-md border border-white bg-black">
                             {(() => {
                               const v = data.mediatheque.videos[0];
                               const ytMatch = v.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                               const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : (v.length === 11 ? v : '');
                               
                               if (ytId) {
                                 return <img src={`https://img.youtube.com/vi/${ytId}/default.jpg`} className="w-full h-full object-cover" />;
                               } else if (v.includes('facebook.com') || v.includes('fb.watch')) {
                                 return <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">Facebook Video</div>;
                               } else if (v.includes('vimeo.com')) {
                                 return <div className="w-full h-full flex items-center justify-center bg-blue-400 text-white font-bold text-xs">Vimeo Video</div>;
                               } else {
                                 return <video src={v} className="w-full h-full object-cover" />;
                               }
                             })()}
                             <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                               <Play className="w-6 h-6 text-white opacity-80" />
                             </div>
                           </div>
                        ) : (
                          <div className="aspect-video bg-white/50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 mt-3">
                            <LayoutGrid className="w-5 h-5 text-gray-200" />
                          </div>
                        )}
                      </div>

                      {/* Vidéo 2 */}
                      <div className="space-y-3 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Vidéo 2 (YouTube, FB, Vimeo, Local)</label>
                          <VideoUpload 
                            value={data.mediatheque?.videos?.[1] || ''} 
                            onChange={(v) => {
                              const newVideos = [...(data.mediatheque?.videos || Array(2).fill(''))];
                              newVideos[1] = v;
                              setData({ ...data, mediatheque: { ...(data.mediatheque || { images: Array(8).fill(''), videos: Array(2).fill('') }), videos: newVideos } });
                            }}
                            path={`mediatheque/${id || 'new'}`}
                          />
                        </div>
                        <input 
                          type="text" 
                          value={data.mediatheque?.videos?.[1] || ''} 
                          onChange={(e) => {
                            const val = e.target.value;
                            const newVideos = [...(data.mediatheque?.videos || Array(2).fill(''))];
                            newVideos[1] = val;
                            setData({ ...data, mediatheque: { ...(data.mediatheque || { images: Array(8).fill(''), videos: Array(2).fill('') }), videos: newVideos } });
                          }} 
                          placeholder="Lien YouTube, Facebook, Vimeo..."
                          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:border-[#149655] outline-none text-sm font-bold placeholder:font-normal placeholder:text-gray-300"
                        />
                        {data.mediatheque?.videos?.[1] ? (
                           <div className="relative aspect-video rounded-xl overflow-hidden mt-3 shadow-md border border-white bg-black">
                             {(() => {
                               const v = data.mediatheque.videos[1];
                               const ytMatch = v.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                               const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : (v.length === 11 ? v : '');
                               
                               if (ytId) {
                                 return <img src={`https://img.youtube.com/vi/${ytId}/default.jpg`} className="w-full h-full object-cover" />;
                               } else if (v.includes('facebook.com') || v.includes('fb.watch')) {
                                 return <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">Facebook Video</div>;
                               } else if (v.includes('vimeo.com')) {
                                 return <div className="w-full h-full flex items-center justify-center bg-blue-400 text-white font-bold text-xs">Vimeo Video</div>;
                               } else {
                                 return <video src={v} className="w-full h-full object-cover" />;
                               }
                             })()}
                             <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                               <Play className="w-6 h-6 text-white opacity-80" />
                             </div>
                           </div>
                        ) : (
                          <div className="aspect-video bg-white/50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 mt-3">
                            <LayoutGrid className="w-5 h-5 text-gray-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {type !== 'contact' && type !== 'production_site' && type !== 'actualite' && type !== 'mediatheque' && type !== 'service' && (
               <div className="pt-4 space-y-8 flex flex-col items-center">
                 <label className="text-[12px] font-bold text-[#111827] uppercase tracking-[0.05em] block text-center">Image de Couverture</label>
                 <div className="w-full max-w-md mx-auto">
                   <SimpleUpload value={data.image} onChange={(v) => setData({ ...data, image: v })} path={`uploads/${type}`} />
                 </div>
                 </div>
               )}
            </div>
          </div>
      </main>

      <AnimatePresence>
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-12 text-center max-w-md w-full shadow-[0_32px_80px_rgba(0,0,0,0.3)] border border-gray-100"
            >
              <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
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
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <X className="w-12 h-12 text-red-500 stroke-[4px] relative z-10" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Oups...</h2>
              <p className="text-gray-500 mb-10 font-medium text-lg">Certains champs obligatoires sont manquants. Veuillez compléter tout le formulaire avant de sauvegarder.</p>
              <button 
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-[#149655] hover:bg-[#0f7a44] text-white font-bold py-5 px-8 rounded-2xl transition-all active:scale-95 shadow-xl shadow-[#149655]/20 uppercase tracking-widest text-xs"
              >
                Compris
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0b261a]/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0, y: 100 }}
              animate={{ 
                scale: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 200, damping: 15 }
              }}
              exit={{ scale: 0, y: -100 }}
              className="relative z-10"
            >
              <motion.div
                animate={{
                  y: [0, 12, 0], // Gentle emoji float
                  scale: [1, 1.03, 1],
                  rotate: [-2, 2, -2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="origin-bottom w-[280px] h-[280px] rounded-[2.5rem] bg-white border-4 border-white shadow-[0_30px_70px_-10px_rgba(20,150,85,0.3)] relative flex flex-col items-center justify-center p-6 select-none"
              >
                {/* Modern Innovative Success Icon Container */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* Glowing background radial gradient pulse */}
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.8, 1.1, 0.95], opacity: [0, 0.15, 0.08] }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-radial from-[#149655] to-transparent blur-md"
                  />

                  <svg className="w-full h-full text-[#149655]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Rotating Dashed Outer Ring */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#149655"
                      strokeWidth="1.5"
                      strokeDasharray="5 6"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                      className="origin-center"
                    />

                    {/* Self-drawing Inner Ring */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#149655"
                      strokeWidth="3.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease: "easeInOut", delay: 0.1 }}
                    />

                    {/* Elastic-drawing Checkmark */}
                    <motion.path
                      d="M34 50.5 L45 61.5 L67 38.5"
                      stroke="#149655"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ type: "spring", stiffness: 150, damping: 11, delay: 0.45 }}
                    />

                    {/* Radial Micro-Particles flaring out */}
                    {[...Array(6)].map((_, i) => {
                      const angle = (i * 360) / 6;
                      const angleRad = (angle * Math.PI) / 180;
                      const distance = 42;
                      const targetX = 50 + Math.cos(angleRad) * distance;
                      const targetY = 50 + Math.sin(angleRad) * distance;
                      return (
                        <motion.circle
                          key={i}
                          cx={50}
                          cy={50}
                          r="2.5"
                          fill="#149655"
                          initial={{ cx: 50, cy: 50, opacity: 0 }}
                          animate={{
                            cx: targetX,
                            cy: targetY,
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            delay: 0.55,
                            duration: 0.55,
                            ease: "easeOut"
                          }}
                        />
                      );
                    })}

                    {/* Expanding Wave Shockwave */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#149655"
                      strokeWidth="1.5"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1.25, opacity: [0, 0.4, 0] }}
                      transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                      className="origin-center"
                    />
                  </svg>
                </div>

                {/* Tracking tracked success text */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="text-[#149655] font-black text-[11px] uppercase tracking-[0.25em] text-center mt-5"
                >
                  {lang === 'fr' ? 'Sauvegarde réussie' : 'Saved successfully'}
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
