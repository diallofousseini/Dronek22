import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, X, ImageIcon, Newspaper, Share2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import Partners from './Partners';
import type { PageView } from './Navbar';
import { collection, getDocs, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BlogPageProps {
  onNavigate: (page: PageView) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const { t, lang } = useLanguage();
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!db) return;
    
    setLoading(true);
    const q = query(
      collection(db, 'news'), 
      where('status', 'in', ['Publié', 'Published']),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        desc: doc.data().content || doc.data().desc,
        image: doc.data().image || '/images/hero-main.jpg'
      }));
      setDynamicNews(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to news:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const allNews = [...dynamicNews, ...t.blog.newsGrid];
  const selectedNews = selectedNewsId ? allNews.find((n: any, i: number) => (n.id || String(i)) === selectedNewsId) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-48 lg:h-56 flex items-end overflow-hidden rounded-[2rem] mx-4 sm:mx-6 lg:mx-8 mt-12 lg:mt-14">
        <div className="absolute inset-0">
          <Image src="/images/hero-forest.jpg" alt="Actualités" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-dronek-green/35 to-black/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium mb-2">
              <Newspaper className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Actualités & Médias' : 'News & Media'}</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 leading-tight uppercase">
              {(lang === 'fr' ? 'Nos dernières nouvelles' : 'Our Latest News').split('').map((char, i) => (
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
            </h1>
            <p className="text-white/90 text-sm lg:text-base max-w-2xl">
              {lang === 'fr' 
                ? 'Suivez les dernières avancées de DRONEK dans la technologie agricole et la gestion forestière durable.'
                : 'Follow DRONEK\'s latest advances in agricultural technology and sustainable forest management.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Layout - Updated as requested */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="activities-grid"
        >
          {allNews.map((item: any, idx: number) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 2) * 0.1 }}
              className="activity-card"
              onClick={() => setSelectedNewsId(item.id || String(idx))}
            >
              <div className="activity-card-image">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="activity-card-actions">
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: item.title,
                          text: item.desc,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Lien copié !');
                      }
                    }}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(window.location.href);
                      alert('Lien copié !');
                    }}
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="activity-card-content">
                <h3 className="activity-card-title">
                  {item.title}
                </h3>
                <p className="activity-card-description">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Médiathèque Section - Moved and Reformatted */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-50">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dronek-green/10 text-dronek-green text-[10px] font-bold uppercase tracking-widest mb-4">
            <ImageIcon className="w-3 h-3" />
            <span>Médiathèque</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-dronek-text">
            {lang === 'fr' ? 'Notre Médiathèque' : 'Our Media Library'}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:auto-rows-[240px]">
          {/* Big Featured Image */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/hero-forest.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Small Block 1 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/project-training.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Small Block 2 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/hero-agriculture.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Wide Block */}
          <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/drone-work.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Medium/Wide Block */}
          <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/project-carbon.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Vertical/Large Block */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/hero-tech.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Last small blocks to fill */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/nursery.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src="/images/nursery-detail.jpg" alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Premium Popup for News */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNewsId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedNewsId(null)}
                className="absolute top-4 right-4 z-50 md:hidden bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg"
              >
                <X className="w-6 h-6 text-dronek-text" />
              </button>

              <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-100">
                <Image src={selectedNews.image} alt={selectedNews.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-dronek-green uppercase tracking-[0.2em]">Actualité</span>
                    {selectedNews.date && <span className="text-xs text-gray-400">| {selectedNews.date}</span>}
                  </div>
                  <button onClick={() => setSelectedNewsId(null)} className="hidden md:block hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-gray-300 hover:text-dronek-text" />
                  </button>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-dronek-text uppercase mb-4 leading-tight">
                  {selectedNews.title}
                </h2>

                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {selectedNews.desc}
                  </p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-xs font-bold text-dronek-text uppercase tracking-widest mb-3">En résumé</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {lang === 'fr' 
                        ? 'DRONEK continue d\'innover pour offrir des solutions technologiques de pointe au service du développement durable en Afrique de l\'Ouest.'
                        : 'DRONEK continues to innovate to offer cutting-edge technological solutions for sustainable development in West Africa.'}
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <Button 
                    onClick={() => setSelectedNewsId(null)}
                    className="w-full rounded-xl bg-dronek-green hover:bg-dronek-dark text-white font-bold py-6 h-auto shadow-lg shadow-dronek-green/20"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Partners />
    </div>
  );
}

