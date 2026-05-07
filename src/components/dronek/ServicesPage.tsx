'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, TreePine, Navigation, Sprout, Wheat, ShieldCheck } from 'lucide-react';
import { collection, serverTimestamp, query, orderBy, addDoc, onSnapshot, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import AnimatedSection from './AnimatedSection';
import type { PageView } from './Navbar';
import SolutionsPerformantes from './SolutionsPerformantes';
import { ScrollTitle } from './ScrollTitle';

interface ServicesPageProps {
  service: 'forestry' | 'drone' | 'agroforestry' | 'agriculture';
  onNavigate: (page: PageView) => void;
}

const serviceConfig: Record<string, any> = {
  forestry: { icon: TreePine, image: '/images/hero-forest.jpg', color: 'from-dronek-dark to-dronek-green' },
  drone: { icon: Navigation, image: '/images/hero-drone.jpg', color: 'from-gray-800 to-gray-600' },
  agroforestry: { icon: Sprout, image: '/images/hero-agroforestry.jpg', color: 'from-green-800 to-green-600' },
  surveillance: { icon: ShieldCheck, image: '/images/hero-agroforestry.jpg', color: 'from-green-800 to-green-600' },
  agriculture: { icon: Wheat, image: '/images/hero-agriculture.jpg', color: 'from-amber-800 to-amber-600' },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function ServicesPage({ service, onNavigate }: ServicesPageProps) {
  const { t, lang } = useLanguage();
  const config = serviceConfig[service];
  const data = t.services[service];
  const stackSectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const [pageData, setPageData] = useState<any>(null);
  const [dynamicCards, setDynamicCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (!db) return;
    
    setLoading(true);
    // 1. Fetch Global Page Config (Banner)
    const docRef = doc(db, 'service_configs', service);
    const unsubscribeConfig = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPageData(docSnap.data());
      }
    });

    // 2. Fetch Individual Cards for this Service
    const q = query(
      collection(db, 'services'), 
      where('status', 'in', ['Publié', 'Published']),
      orderBy('createdAt', 'asc')
    );
    const unsubscribeCards = onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((c: any) => c.serviceType === service);
      setDynamicCards(cards);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching service cards:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeConfig();
      unsubscribeCards();
    };
  }, [service]);

  // Merge CMS cards with Translation items as fallback
  const allServiceItems = dynamicCards.length > 0 
    ? dynamicCards 
    : (pageData?.cards?.map((c: any) => ({
        title: c.title,
        desc: c.description,
        image: c.image || config.image,
        pdfUrl: c.pdfUrl || '#',
        buttonText: c.buttonText || t.services.learnMore,
        detailTitle: c.detailTitle || c.title,
        detailShortDesc: c.detailShortDesc || c.description,
        detailLongDesc: c.detailLongDesc || c.description
      })) || data.items.map((item: any) => ({
        ...item,
        pdfUrl: item.pdfUrl || '#',
        buttonText: t.services.learnMore,
        detailTitle: item.title,
        detailShortDesc: item.desc,
        detailLongDesc: item.desc
      })));

  const bannerInfo = {
    title: pageData?.banner?.title || data.name,
    description: pageData?.banner?.description || data.fullDesc,
    image: pageData?.banner?.image || config.image
  };
  const [consultationData, setConsultationData] = useState({
    nom: '',
    prenom: '',
    email: '',
    message: '',
  });
  const [sendingConsultation, setSendingConsultation] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState('');
  const [consultationError, setConsultationError] = useState('');

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setStackSectionRef = (index: number) => (node: HTMLDivElement | null) => {
    stackSectionRefs.current[index] = node;
  };

  const getStackStyle = (index: number) => {
    const depth = Math.max(0, activeStackIndex - index);
    const offset = depth * 6;
    const scale = Math.max(0.88, 1 - depth * 0.04);
    const zIndex = 10 - depth * 2;

    return {
      transform: `translateY(${offset}px) scale(${scale})`,
      zIndex: zIndex,
    };
  };

  useEffect(() => {
    const updateActiveStackIndex = () => {
      const trigger = window.innerHeight * 0.22;
      let nextActiveIndex = 0;

      stackSectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= trigger) {
          nextActiveIndex = index;
        }
      });

      setActiveStackIndex(nextActiveIndex);
    };

    updateActiveStackIndex();
    window.addEventListener('scroll', updateActiveStackIndex, { passive: true });
    window.addEventListener('resize', updateActiveStackIndex);

    return () => {
      window.removeEventListener('scroll', updateActiveStackIndex);
      window.removeEventListener('resize', updateActiveStackIndex);
    };
  }, []);

  const handleConsultationField = (field: 'nom' | 'prenom' | 'email' | 'message', value: string) => {
    setConsultationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consultationData.nom || !consultationData.prenom || !consultationData.email || !consultationData.message) {
      setConsultationError(t.services.error);
      setConsultationSuccess('');
      return;
    }

    setSendingConsultation(true);
    setConsultationSuccess('');
    setConsultationError('');

    try {
      if (!db) {
        throw new Error('Firebase not configured');
      }

      await addDoc(collection(db, 'consultations'), {
        nom: consultationData.nom,
        prenom: consultationData.prenom,
        email: consultationData.email,
        message: consultationData.message,
        service,
        serviceName: data.name,
        createdAt: serverTimestamp(),
      });

      setConsultationData({ nom: '', prenom: '', email: '', message: '' });
      setConsultationSuccess(t.services.success);
    } catch {
      setConsultationError(t.services.error);
    } finally {
      setSendingConsultation(false);
    }
  };

  useEffect(() => {
    const initScrollEffect = () => {
      const cards = document.querySelectorAll('.stack-card');
      if (cards.length === 0) return;

      const handleScroll = () => {
        cards.forEach((card, index) => {
          const nextCard = cards[index + 1];
          if (!nextCard) return;

          const rect = nextCard.getBoundingClientRect();
          const nextStickyTop = 120; 
          const triggerDistance = 400; 
          
          const distance = rect.top - nextStickyTop;
          
          if (distance < triggerDistance) {
            // Cards now stay full size and bright to be fully covered by the next one
            (card as HTMLElement).style.transform = 'scale(1)';
            (card as HTMLElement).style.filter = 'brightness(1)';
            (card as HTMLElement).style.opacity = '1';
          } else {
            (card as HTMLElement).style.transform = 'scale(1)';
            (card as HTMLElement).style.filter = 'brightness(1)';
            (card as HTMLElement).style.opacity = '1';
          }
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    };

    const cleanup = initScrollEffect();
    return () => cleanup && cleanup();
  }, [allServiceItems.length]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner — Sticky Stack */}
      <div ref={setStackSectionRef(0)} className="relative">
        <div
          className="sticky top-0 transform-gpu transition-transform duration-300 ease-out origin-top"
          style={getStackStyle(0)}
        >
          <AnimatedSection className="relative h-auto min-h-[400px] flex items-start overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl group">
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute inset-0"
              >
                <Image src={bannerInfo.image || config.image} alt={bannerInfo.title} fill className="object-cover" priority />
              </motion.div>
              <div className={`absolute inset-0 bg-gradient-to-t ${config.color} opacity-80`} />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-36 lg:pt-48 pb-16">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-24">
                <div className="flex-1 min-w-0">
                    <ScrollTitle as="h1" className="text-3xl lg:text-5xl font-montserrat-extrabold text-white leading-[1.1] uppercase tracking-tighter">
                      {bannerInfo.title.split('').map((char: string, i: number) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.1, delay: i * 0.03 }}
                          className="inline-block"
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </ScrollTitle>
                </div>

                <div className="lg:max-w-xl">
                  <motion.p 
                    initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                    transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white/90 text-base lg:text-xl font-medium leading-relaxed italic"
                  >
                    {bannerInfo.description}
                  </motion.p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div 
        key={service} 
        id="stack-container"
        className="relative pt-16 pb-0" 
        style={{ 
          minHeight: `${allServiceItems.length * 85}vh`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative block">
            {allServiceItems.map((item: any, idx: number) => (
              <motion.div 
                key={idx} 
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                style={{
                  position: 'sticky',
                  top: '100px',
                  zIndex: 20 + idx,
                  height: '80vh',
                  marginBottom: idx === allServiceItems.length - 1 ? '10vh' : '40vh',
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                }}
                className={`stack-card stack-card-${idx} w-full group`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Left Column - Image */}
                  <div className="relative h-64 lg:h-full overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <Image src={item.image || config.image} alt={item.title} fill className="object-cover" />
                    </motion.div>
                  </div>
                  {/* Right Column - Text Content */}
                  <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
                    <ScrollTitle
                      as="h3"
                      className="font-montserrat-extrabold uppercase text-3xl md:text-4xl text-dronek-dark mb-6 leading-none"
                    >
                      {item.title}
                    </ScrollTitle>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-base md:text-lg text-dronek-medium leading-relaxed font-medium"
                    >
                      {item.desc}
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="mt-12"
                    >
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="group/btn inline-flex items-center justify-center px-8 py-4 rounded-xl bg-dronek-green hover:bg-dronek-dark text-white text-sm font-bold transition-all shadow-lg hover:shadow-dronek-green/20 active:scale-95 gap-3"
                      >
                        <span className="relative z-10">{item.buttonText || t.services.learnMore}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions Performantes UI Section */}
      <SolutionsPerformantes />

      {/* Detail Modal — 2 Columns Premium Design */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-6xl bg-white rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row h-auto max-h-[90vh] lg:h-[700px]"
            >
              {/* Left Column - Image Background & Text Overlay */}
              <div className="lg:w-[45%] relative min-h-[300px] lg:min-h-full">
                <Image 
                  src={selectedItem.image || config.image} 
                  alt={selectedItem.title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark via-dronek-dark/40 to-transparent" />
                
                <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end text-white">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl lg:text-5xl font-montserrat-extrabold uppercase leading-none mb-6"
                  >
                    {selectedItem.detailTitle || selectedItem.title}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/80 text-base lg:text-lg font-medium leading-relaxed italic"
                  >
                    {selectedItem.detailShortDesc || selectedItem.desc}
                  </motion.p>
                </div>
              </div>

              {/* Right Column - Detailed Info & Actions */}
              <div className="lg:w-[55%] p-8 lg:p-16 overflow-y-auto bg-white flex flex-col justify-between">
                <div>
                  <div className="w-12 h-1.5 bg-dronek-green rounded-full mb-10" />
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 text-lg lg:text-xl leading-relaxed font-medium">
                      {selectedItem.detailLongDesc || selectedItem.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-4">
                  <a 
                    href={selectedItem.pdfUrl} 
                    download
                    className="w-full inline-flex items-center justify-center px-10 py-5 rounded-full bg-dronek-green hover:bg-dronek-dark text-white font-bold uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-dronek-green/30 active:scale-95 gap-3"
                  >
                    <FileText className="w-5 h-5" />
                    Télécharger la fiche technique
                  </a>
                  
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-full inline-flex items-center justify-center px-10 py-5 rounded-full border-2 border-gray-100 hover:bg-gray-50 text-gray-900 font-bold uppercase tracking-widest text-xs transition-all active:scale-95 gap-3"
                  >
                    <X className="w-5 h-5" />
                    Fermer la page
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
