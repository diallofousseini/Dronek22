'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Save, Plus, Trash2, Upload, X, Loader2, 
  Zap, Globe, Shield, FileText, Image as ImageIcon, Copy, CheckCircle2, MapPin
} from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { 
  doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
        <GenericItemEditor type={type} id={id} />
      </div>
    </div>
  );
}

// ==========================================
// SHARED UI COMPONENTS (PREMIUM)
// ==========================================

function CMSHeader({ title, onSave, saving, isScrolled, scrollProgress, children }: any) {
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
          Retour
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
          Sauvegarder
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
            value={value} 
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
            value={value} 
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
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full h-[60px] px-6 bg-white border border-[#e5e7eb] rounded-2xl focus:border-[#149655] focus:ring-8 focus:ring-[#149655]/5 outline-none transition-all duration-300 text-[15px] font-semibold text-[#111] placeholder:text-[#9ca3af] shadow-sm"
        />
      )}
    </div>
  );
}

function SimpleUpload({ value, onChange, path }: { value: string, onChange: (v: string) => void, path: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [up, setUp] = useState(false);
  
  const handle = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f || !storage) return;
    setUp(true);
    try {
      const r = ref(storage, `${path}/${Date.now()}_${f.name}`);
      const s = await uploadBytes(r, f);
      const url = await getDownloadURL(s.ref);
      onChange(url);
    } catch {}
    setUp(false);
  };

  return (
    <div 
      onClick={() => fileRef.current?.click()} 
      className="relative aspect-video bg-[#fafafa] border-2 border-dashed border-[#d1d5db] rounded-[16px] overflow-hidden flex flex-col items-center justify-center cursor-pointer group hover:bg-[#f3f4f6] hover:border-[#149655] transition-all duration-300"
    >
       {up ? (
         <Loader2 className="w-8 h-8 animate-spin text-[#149655]" />
       ) : value ? (
         <>
           <Image src={value} alt="img" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
              <span className="text-[11px] text-[#9ca3af] uppercase tracking-wide">JPG, PNG - MAX 5MB</span>
            </div>
         </div>
       )}
       <input ref={fileRef} type="file" hidden accept="image/*" onChange={handle} />
    </div>
  );
}

function PdfUpload({ value, onChange, path }: { value: string, onChange: (v: string) => void, path: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [up, setUp] = useState(false);
  
  const handle = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f || !storage) return;
    setUp(true);
    try {
      const r = ref(storage, `${path}/${Date.now()}_${f.name}`);
      const s = await uploadBytes(r, f);
      const url = await getDownloadURL(s.ref);
      onChange(url);
    } catch {}
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

function GenericItemEditor({ type, id }: { type: string, id?: string | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<any>({ 
    title: '', name: '', category: '', content: '', description: '', 
    role: '', bio: '', linkedin: '', image: '', status: 'Publié',
    email: '', phone: '', location: '',
    year: '', objectives: [], impacts: [],
    date: '',
    capacity: '', surface: '', desc: '',
    employees: '', services: '',
    isFeatured: false, pdfUrl: '',
    detailTitle: '', detailShortDesc: '', detailLongDesc: '',
    serviceType: 'forestry', buttonText: 'En savoir plus',
    lat: '', lng: ''
  });
  const [saving, setSaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    if (id && db) {
      const col = type === 'projet' ? 'projects' : 
                  type === 'actualite' ? 'news' : 
                  type === 'membre' ? 'team' : 
                  type === 'production_site' ? 'production_sites' : 'contacts';
      getDoc(doc(db, col, id)).then(s => s.exists() && setData(s.data()));
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
      hasRequiredFields = !!(data.name && data.location && data.capacity && data.surface && data.image);
    } else if (type === 'service') {
      hasRequiredFields = !!(data.title && data.description && data.image);
    } else if (type === 'projet') {
      hasRequiredFields = !!(data.title && data.description && data.image && data.location && data.year);
    } else if (type === 'actualite') {
      hasRequiredFields = !!(data.title && data.description && data.image);
    } else {
      hasRequiredFields = !!(data.title && (data.category || data.content || data.description) && data.image);
    }

    if (!hasRequiredFields) {
      setShowErrorModal(true);
      return;
    }

    setSaving(true);
    try {
      const col = type === 'projet' ? 'projects' : 
                  type === 'actualite' ? 'news' : 
                  type === 'membre' ? 'team' : 
                  type === 'production_site' ? 'production_sites' : 
                  type === 'service' ? 'services' : 'contacts';
      const refDoc = id ? doc(db!, col, id) : doc(collection(db!, col));
      
      const finalData = { 
        ...data, 
        ...(type === 'actualite' && !id ? { 
          createdAt: serverTimestamp(),
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) 
        } : {}),
        title: isContact ? 'Informations de Contact' : data.title,
        category: isContact ? 'Configuration' : data.category
      };
      
      await setDoc(refDoc, { ...finalData, updatedAt: serverTimestamp() }, { merge: true });
      toast({ title: "Enregistré avec succès" });
      router.push('/admin');
    } catch (e) { toast({ title: "Erreur", variant: "destructive" }); }
    setSaving(false);
  };

  const labels: any = { 
    projet: <><span className="text-[#111]">Espace</span> <span className="text-[#149655]">Projet</span></>, 
    actualite: <><span className="text-[#111]">Espace</span> <span className="text-[#149655]">Actualités</span></>, 
    membre: <><span className="text-[#111]">Espace</span> <span className="text-[#149655]">Membres</span></>, 
    contact: <><span className="text-[#111]">Espace</span> <span className="text-[#149655]">Contact</span></>,
    production_site: <><span className="text-[#111]">Sites</span> <span className="text-[#149655]">Production</span></>,
    service: <><span className="text-[#111]">Espace</span> <span className="text-[#149655]">Service</span></>
  };

  return (
    <>
      <CMSHeader title={labels[type]} onSave={handleSave} saving={saving} isScrolled={isScrolled} scrollProgress={scrollProgress} />
      <main className="max-w-[1000px] mx-auto py-8 px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-12">
             {type === 'projet' && (
               <div className="flex items-center justify-between py-3 w-full max-w-md mx-auto mb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                     <Zap className={cn("w-5 h-5", data.isFeatured ? "text-[#149655] fill-[#149655]" : "text-gray-400")} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-[#111] uppercase tracking-tight">Mettre en avant ce projet</p>
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
                     <VerticalField labelSize="13px" label="Description" type="textarea" value={data.desc} onChange={(v: string) => setData({ ...data, desc: v })} placeholder="Description du site..." />
                   </div>

                   {/* Right Column: Image */}
                   <div className="flex flex-col items-center justify-center space-y-6">
                     <label className="text-[14px] font-black text-[#111] uppercase tracking-[0.2em] block text-center">Image du Site</label>
                     <div className="w-full max-w-sm">
                       <SimpleUpload value={data.image} onChange={(v) => setData({ ...data, image: v })} path={`uploads/${type}`} />
                     </div>
                   </div>
                 </div>
                 
                 {/* Geolocalisation Section */}
                 <div className="space-y-10 pt-4">
                    <div className="flex flex-col items-center gap-4 mb-2">
                       <div className="w-14 h-14 bg-[#149655]/5 rounded-full flex items-center justify-center border border-[#149655]/10">
                          <MapPin className="w-6 h-6 text-[#149655]" />
                       </div>
                       <h3 className="text-xl font-black text-[#111] uppercase tracking-[0.15em] text-center">Géolocalisation sur la carte</h3>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                      <div className="flex items-center gap-4">
                        <label className="text-xs font-black text-[#111] uppercase tracking-widest">Latitude</label>
                        <input 
                          type="text" 
                          value={data.lat} 
                          onChange={(e) => setData({ ...data, lat: e.target.value })} 
                          placeholder="ex: 5.2719"
                          className="h-[50px] w-32 px-4 bg-white border border-[#e5e7eb] rounded-xl focus:border-[#149655] outline-none text-center font-bold"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="text-xs font-black text-[#111] uppercase tracking-widest">Longitude</label>
                        <input 
                          type="text" 
                          value={data.lng} 
                          onChange={(e) => setData({ ...data, lng: e.target.value })} 
                          placeholder="ex: -3.5950"
                          className="h-[50px] w-32 px-4 bg-white border border-[#e5e7eb] rounded-xl focus:border-[#149655] outline-none text-center font-bold"
                        />
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
                 <HorizontalField labelSize="16px" label="Numéros de téléphone" type="textarea" value={data.phone} onChange={(v: string) => setData({ ...data, phone: v })} placeholder="ex: +225 07 07 73 22 64 (un par ligne)" />
                 <HorizontalField labelSize="16px" label="Adresse complète" type="textarea" value={data.location} onChange={(v: string) => setData({ ...data, location: v })} placeholder="Abidjan Cocody 216 Logements..." />
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
                  <HorizontalField labelSize="16px" label="Secteur" value={data.category} onChange={(v: string) => setData({ ...data, category: v })} />
                  <HorizontalField labelSize="16px" label="Localisation" value={data.location} onChange={(v: string) => setData({ ...data, location: v })} placeholder="ex: Parc National de Taï" />
                  <HorizontalField labelSize="16px" label="Année" value={data.year} onChange={(v: string) => setData({ ...data, year: v })} placeholder="ex: 2023" />
                  <HorizontalField labelSize="16px" label="Objectifs" type="textarea" value={Array.isArray(data.objectives) ? data.objectives.join('\n') : data.objectives || ''} onChange={(v: string) => setData({ ...data, objectives: v.split('\n').filter(Boolean) })} placeholder="Lister les objectifs (un par ligne)..." />
                  <HorizontalField labelSize="16px" label="Résultats & Impacts" type="textarea" value={Array.isArray(data.impacts) ? data.impacts.join('\n') : data.impacts || ''} onChange={(v: string) => setData({ ...data, impacts: v.split('\n').filter(Boolean) })} placeholder="Lister les résultats (un par ligne)..." />
                  <HorizontalField labelSize="16px" label="Description complète" type="textarea" value={data.description} onChange={(v: string) => setData({ ...data, description: v })} placeholder="Description générale du projet..." />
                </motion.div>
              )}

             {type === 'service' && (
               <div className="space-y-12">
                 {/* Card Section */}
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   className="space-y-6 border border-gray-100 p-8 rounded-[2rem] bg-[#fcfdfc] shadow-sm"
                 >
                   <div className="flex items-center justify-center gap-3 pb-2">
                     <ImageIcon className="w-5 h-5 text-[#149655]" />
                     <h3 className="font-bold text-[#111] uppercase tracking-wider text-sm">CARTE</h3>
                   </div>
                   <HorizontalField labelSize="14px" label="Titre de la Carte" value={data.title} onChange={(v: string) => setData({ ...data, title: v })} placeholder="Titre principal..." />
                   <HorizontalField labelSize="14px" label="Description Carte" type="textarea" value={data.description} onChange={(v: string) => setData({ ...data, description: v })} placeholder="Apparaît dans la colonne de droite de la carte..." />
                   <HorizontalField labelSize="14px" label="Texte du Bouton" value={data.buttonText || "En savoir plus"} onChange={(v: string) => setData({ ...data, buttonText: v })} placeholder="ex: En savoir plus" />
                 </motion.div>

                 {/* Detail Page Section */}
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                   className="space-y-6 border border-gray-100 p-8 rounded-[2rem] bg-[#fcfdfc] shadow-sm"
                 >
                    <div className="flex items-center justify-center gap-3 pb-2">
                      <FileText className="w-5 h-5 text-[#149655]" />
                      <h3 className="font-bold text-[#111] uppercase tracking-wider text-sm">En savoir plus </h3>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-gray-50 p-6 rounded-2xl space-y-6 border border-gray-100"
                    >
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Colonne de Gauche (Sur Image de fond)</p>
                      <HorizontalField labelSize="12px" label="Titre Détail" value={data.detailTitle} onChange={(v: string) => setData({ ...data, detailTitle: v })} placeholder="Titre superposé sur l'image..." />
                      <HorizontalField labelSize="12px" label="Description Gauche" type="textarea" value={data.detailShortDesc} onChange={(v: string) => setData({ ...data, detailShortDesc: v })} placeholder="Petite description sous le titre..." />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-gray-50 p-6 rounded-2xl space-y-6 border border-gray-100"
                    >
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Colonne de Droite</p>
                      <HorizontalField labelSize="12px" label="Description Longue" type="textarea" value={data.detailLongDesc} onChange={(v: string) => setData({ ...data, detailLongDesc: v })} placeholder="Contenu principal et détaillé..." />
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4">
                        <label className="md:col-span-3 font-bold text-[#111827] uppercase tracking-[0.05em]" style={{ fontSize: '12px' }}>Fichier à télécharger</label>
                        <div className="md:col-span-9">
                          <PdfUpload value={data.pdfUrl} onChange={(v: string) => setData({ ...data, pdfUrl: v })} path={`pdfs/services`} />
                        </div>
                      </div>
                    </motion.div>
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
                     <VerticalField labelSize="13px" label="Titre de l'actualité" value={data.title} onChange={(v: string) => setData({ ...data, title: v })} placeholder="Titre principal..." />
                     <VerticalField labelSize="13px" label="Contenu / Description" type="textarea" value={data.content || data.description} onChange={(v: string) => setData({ ...data, content: v, description: v })} placeholder="Détails de l'actualité..." />
                   </div>

                   {/* Right Column: Image */}
                   <div className="flex flex-col items-center justify-center space-y-6">
                     <label className="text-[14px] font-black text-[#111] uppercase tracking-[0.2em] block text-center">Image de l'article</label>
                     <div className="w-full max-w-sm">
                       <SimpleUpload value={data.image} onChange={(v) => setData({ ...data, image: v })} path={`uploads/${type}`} />
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}
             {type === 'membre' && (
               <div className="space-y-6">
                 <HorizontalField label="Poste / Responsabilité" value={data.role} onChange={(v: string) => setData({ ...data, role: v })} placeholder="ex: Responsable Agricole" />
                 <HorizontalField label="Lien Facebook" value={data.facebook} onChange={(v: string) => setData({ ...data, facebook: v })} placeholder="https://facebook.com/..." />
                 <HorizontalField label="Lien LinkedIn" value={data.linkedin} onChange={(v: string) => setData({ ...data, linkedin: v })} placeholder="https://linkedin.com/in/..." />
                 <HorizontalField label="Lien Email" value={data.email} onChange={(v: string) => setData({ ...data, email: v })} placeholder="exemple@dronek.net" />
               </div>
             )}
             
             {/* Centered Image Upload Section - Hidden for Contacts, Production Sites and News */}
             {type !== 'contact' && type !== 'production_site' && type !== 'actualite' && (
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
    </>
  );
}
