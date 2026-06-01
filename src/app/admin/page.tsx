'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Search, Zap, Briefcase, FileText, Users, MessageSquare, Globe, Loader2, Edit2, Trash2, ExternalLink, LayoutGrid, ChevronRight, Image as ImageIcon, AlertTriangle, X, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

import { useLanguage } from '@/components/dronek/LanguageProvider';

interface DashboardItem {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  table: string;
  url?: string;
  sujet?: string;
}

const StatusToggle = ({ item, onToggle, lang }: { item: DashboardItem, onToggle: (item: DashboardItem) => void, lang: string }) => {
  const isPublished = item.status === 'Publié' || item.status === 'Published' || item.status === 'publie';
  const x = useMotionValue(isPublished ? 80 : 0);
  const opacityDraft = useTransform(x, [0, 40], [1, 0]);
  const opacityPublished = useTransform(x, [40, 80], [0, 1]);
  const trackBg = useTransform(x, [0, 80], ['#f3f4f6', '#149655']);
  const handleBg = useTransform(x, [0, 80], ['#ffffff', '#ffffff']);
  const iconColor = useTransform(x, [0, 80], ['#9ca3af', '#149655']);

  useEffect(() => {
    x.set(isPublished ? 80 : 0);
  }, [isPublished, x]);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (!isPublished && currentX > 40) {
      onToggle(item);
    } else if (isPublished && currentX < 40) {
      onToggle(item);
    } else {
      x.set(isPublished ? 80 : 0);
    }
  };

  return (
    <div className="relative w-[130px] h-[36px] select-none">
      <motion.div 
        style={{ backgroundColor: trackBg }}
        className="absolute inset-0 rounded-full border border-gray-100 shadow-inner overflow-hidden cursor-pointer"
        onClick={() => onToggle(item)}
      >
        {/* Texts */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.span 
              style={{ opacity: opacityDraft }}
              className="absolute text-[9px] font-black uppercase tracking-widest text-gray-400"
            >
              {lang === 'fr' ? 'Brouillon' : 'Draft'}
            </motion.span>
            <motion.span 
              style={{ opacity: opacityPublished }}
              className="absolute text-[9px] font-black uppercase tracking-widest text-white"
            >
              {lang === 'fr' ? 'Publié' : 'Published'}
            </motion.span>
          </div>
        </div>

        {/* Handle */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 80 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          style={{ x, backgroundColor: handleBg }}
          className="absolute left-1 top-1 w-7 h-7 rounded-full shadow-md flex items-center justify-center z-10 cursor-grab active:cursor-grabbing"
        >
          <motion.div 
            style={{ color: iconColor }}
            className={`transition-transform duration-300 ${isPublished ? 'rotate-180' : ''}`}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, title: string, table: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showThumbsUp, setShowThumbsUp] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Helper to format date based on language
  const formatDate = (date: any) => {
    if (!date) return '-';
    // Utiliser directement new Date() car Supabase renvoie des chaînes ISO ou des dates valides
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
    } catch (e) {
      return '-';
    }
  };

  const tabs = [
    { id: 'all', label: t.admin.tabs.all, icon: Zap },
    { id: 'services', label: t.admin.tabs.services, icon: Zap },
    { id: 'projets', label: t.admin.tabs.projects, icon: Briefcase },
    { id: 'actualites', label: t.admin.tabs.news, icon: FileText },
    { id: 'equipe', label: t.admin.tabs.team, icon: Users },
    { id: 'contacts', label: t.admin.tabs.contacts, icon: MessageSquare },
    { id: 'production_sites', label: t.admin.tabs.production_sites, icon: Globe },
    { id: 'mediatheque', label: t.admin.tabs.mediatheque, icon: ImageIcon },
  ];

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
    setLoading(true);
    setErrorState(null);
    
    const tablesToFetch = activeTab === 'all' 
      ? ['projets', 'actualites', 'equipe', 'contacts', 'production_sites', 'services']
      : activeTab === 'mediatheque' ? ['contacts'] : [activeTab];

    const fetchData = async () => {
      let combined: any[] = [];
      let fetchFailed = false;
      let lastErrorMessage = '';

      try {
        for (const table of tablesToFetch) {
          let query = supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: false });
          
          if (table === 'contacts' && activeTab === 'mediatheque') {
            query = query.eq('sujet', 'Mediatheque');
          } else if (table === 'contacts') {
            // Exclude configuration and media settings from the general contact messages list
            query = query.neq('sujet', 'Configuration').neq('sujet', 'Mediatheque').neq('sujet', 'MainServices');
          }

          const { data, error } = await query;
          
          if (error) {
            console.error(`[Admin Fetch] Error on table "${table}":`, error);
            fetchFailed = true;
            lastErrorMessage = error.message;
            continue;
          }

          if (data) {
            combined = [...combined, ...data.map(item => ({
              ...item,
              id: item.id,
              title: item.prenom || item.nom ? `${item.prenom || ''} ${item.nom || ''}`.trim() : (item.sujet || item.titre || item.name || item.title || (lang === 'fr' ? 'Sans titre' : 'Untitled')),
              category: item.sujet === 'Mediatheque' ? 'Média' : (item.categorie || item.category || table),
              status: item.statut || item.status || (lang === 'fr' ? 'Publié' : 'Published'),
              date: formatDate(item.created_at),
              table: table,
              url: item.url || item.image_url || item.photo_url || item.image || item.photo,
              rawDate: new Date(item.created_at)
            }))];
          }
        }

        if (fetchFailed && combined.length === 0) {
          setErrorState(lastErrorMessage || (lang === 'fr' ? 'Échec de connexion à la base de données' : 'Database connection failed'));
        } else {
          setItems(combined.sort((a, b) => b.rawDate - a.rawDate));
        }
      } catch (err: any) {
        console.error('[Admin Fetch] Request exception:', err);
        setErrorState(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscriptions
    const channels = tablesToFetch.map(table => 
      supabase.channel(`${table}-list-${activeTab}`).on('postgres_changes', { event: '*', schema: 'public', table }, fetchData).subscribe()
    );

    return () => {
      channels.forEach(c => c.unsubscribe());
    };
  }, [activeTab, lang, refreshCount]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('dronek_mock_auth');
    window.location.href = '/admin/login';
  };

  const handleDelete = (id: string, title: string, tableName: string) => {
    setItemToDelete({ id, title, table: tableName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from(itemToDelete.table).delete().eq('id', itemToDelete.id);
      if (error) throw error;
      // Optimistic update
      setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(lang === 'fr' ? "Erreur lors de la suppression" : "Error during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    const isPublished = item.status === 'Publié' || item.status === 'Published' || item.status === 'publie';
    const newStatus = isPublished ? 'brouillon' : 'publie';
    
    if (newStatus === 'publie') {
      setShowThumbsUp(true);
      setTimeout(() => setShowThumbsUp(false), 3000);
    }
    
    // Optimistic update
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));

    try {
      const { error } = await supabase
        .from(item.table)
        .update({ statut: newStatus })
        .eq('id', item.id);
      if (error) {
        // Rollback on error
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: item.status } : i));
        throw error;
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = (id: string, tableName: string) => {
    const item = items.find(i => i.id === id);
    const typeMap: any = {
      'equipe': 'membre',
      'contacts': item?.sujet === 'Mediatheque' ? 'mediatheque' : 'contact',
      'production_sites': 'production_site',
      'services': 'service',
      'projets': 'projet',
      'actualites': 'actualite'
    };
    const type = typeMap[tableName] || 'service';
    router.push(`/admin/services/new?type=${type}&id=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7fbf8] relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#149655]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#149655]/5 blur-[120px] pointer-events-none" />

      {/* Brand Background Image - Optimized */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08]">
        <div className="relative w-[800px] h-[800px]">
          <Image 
            src="/images/dronek_image3-removebg-preview.png" 
            alt="" 
            fill 
            className="object-contain grayscale"
            priority
          />
        </div>
      </div>

      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-xl",
        isScrolled ? "shadow-sm" : "shadow-none"
      )}>
        {/* ✨ Professional Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-100/30 overflow-hidden">
          <motion.div 
            className="h-full bg-[#149655] origin-left" 
            style={{ width: `${scrollProgress}%` }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div className="relative h-12 flex items-center">
              <Image src="/Typographie/logoV.png" alt="DRONEK Logo" width={200} height={50} className="h-[50px] sm:h-[60px] w-auto object-contain" priority />
            </div>
            <div className="h-10 w-[1px] bg-gray-200 mx-2 hidden sm:block" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight tracking-tight uppercase">
                {t.admin.dashboard} <span className="text-[#149655]">DRONEK</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">{t.admin.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto justify-start md:justify-end">
            {activeTab === 'mediatheque' ? (
              <Link 
                href="/admin/services/new?type=mediatheque"
                className="flex items-center gap-2 bg-[#149655] hover:bg-[#0b3b24] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-[#149655]/20 uppercase text-xs sm:text-sm"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {lang === 'fr' ? 'Ajouter Média' : 'Add Media'}
              </Link>
            ) : activeTab === 'contacts' ? (
              <Link 
                href="/admin/services/new?type=contact"
                className="flex items-center gap-2 bg-[#149655] hover:bg-[#0b3b24] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-[#149655]/20 uppercase text-xs sm:text-sm"
              >
                <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {lang === 'fr' ? 'Modifier coordonnées' : 'Edit Coordinates'}
              </Link>
            ) : (
              <Link 
                href={`/admin/services/new?type=${
                  activeTab === 'projets' ? 'projet' : 
                  activeTab === 'actualites' ? 'actualite' : 
                  activeTab === 'equipe' ? 'membre' : 
                  activeTab === 'production_sites' ? 'production_site' : 'service'
                }`}
                className="flex items-center gap-2 bg-[#149655] hover:bg-[#0b3b24] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-[#149655]/20 uppercase text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                {t.admin.add} {
                  activeTab === 'all' ? (lang === 'fr' ? 'Service' : 'Service') : 
                  activeTab === 'projets' ? t.admin.tabs.projects.slice(0, -1) : 
                  activeTab === 'actualites' ? t.admin.tabs.news.slice(0, -1) : 
                  activeTab === 'equipe' ? t.admin.tabs.team : 
                  activeTab === 'production_sites' ? (lang === 'fr' ? 'Site' : 'Site') :
                  (lang === 'fr' ? 'Service' : 'Service')
                }
              </Link>
            )}

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all group text-xs sm:text-sm"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500" />
              {t.admin.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 min-h-[500px]">
          
          <div className="flex items-center gap-8 border-b border-gray-100 mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-1 text-[15px] font-medium transition-colors relative whitespace-nowrap ${
                    isActive ? 'text-[#149655] font-bold' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div 
                      layoutId="admin-nav-underline" 
                      className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#149655] rounded-t-full" 
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t.admin.searchPlaceholder.replace('{tab}', 
                  activeTab === 'all' ? (lang === 'fr' ? 'Élément' : 'Item') : 
                  activeTab === 'services' ? (lang === 'fr' ? 'Service' : 'Service') :
                  activeTab === 'projets' ? t.admin.tabs.projects : 
                  activeTab === 'actualites' ? t.admin.tabs.news : 
                  activeTab === 'equipe' ? t.admin.tabs.team : 
                  activeTab === 'production_sites' ? (lang === 'fr' ? 'Site' : 'Site') :
                  t.admin.tabs.contacts
                )}
                className="w-full pl-12 pr-4 py-3.5 bg-[#f8faf9] border border-transparent rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#149655]/20 focus:border-[#149655] transition-all font-medium"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">{t.admin.table.item}</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">{t.admin.table.category}</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-center">{t.admin.table.status}</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">{t.admin.table.date}</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">{t.admin.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-[#149655] animate-spin" />
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{t.admin.table.loading}</p>
                      </div>
                    </td>
                  </tr>
                ) : errorState ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4 max-w-md mx-auto px-4">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-lg uppercase tracking-tight">
                            {lang === 'fr' ? 'Erreur de Connexion' : 'Connection Error'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                            {lang === 'fr' 
                              ? 'La base de données Supabase est temporairement inactive ou inaccessible. Veuillez essayer de la réveiller.'
                              : 'The Supabase database is temporarily inactive or offline. Please try to wake it up.'}
                          </p>
                          <code className="block bg-gray-50 text-[11px] text-gray-400 p-2.5 rounded-lg border border-gray-100 mt-3 font-mono break-all text-left">
                            {errorState}
                          </code>
                        </div>
                        <button
                          onClick={() => setRefreshCount(prev => prev + 1)}
                          className="mt-2 bg-[#149655] hover:bg-[#0b3b24] text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 text-xs uppercase tracking-wider shadow-lg shadow-[#149655]/20"
                        >
                          {lang === 'fr' ? 'Réessayer' : 'Retry'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          {item.url && item.url !== "" && (
                            <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                              <img src={item.url} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="font-bold text-gray-900 group-hover:text-[#149655] transition-colors text-lg uppercase tracking-tight">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-600 font-medium uppercase">{item.category}</td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <StatusToggle item={item} onToggle={handleToggleStatus} lang={lang} />
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500 font-normal">{item.date}</td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.table === 'contacts' ? (
                            <button 
                              onClick={() => {
                                setSelectedContact(item);
                                setShowContactModal(true);
                              }} 
                              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#149655] hover:bg-[#149655]/10 rounded-xl transition-all" 
                              title={lang === 'fr' ? 'Visualiser le message' : 'View message'}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleEdit(item.id, item.table)} 
                              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#149655] hover:bg-[#149655]/10 rounded-xl transition-all" 
                              title={t.admin.actions.edit}
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(item.id, item.title, item.table)} 
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                            title={t.admin.actions.delete}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-24 text-center text-gray-500 font-bold uppercase tracking-widest">
                      {t.admin.table.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Mobile Card List View */}
            <div className="block md:hidden divide-y divide-gray-100 bg-white">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-[#149655] animate-spin" />
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{t.admin.table.loading}</p>
                  </div>
                </div>
              ) : errorState ? (
                <div className="py-16 text-center px-4">
                  <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg uppercase tracking-tight">
                        {lang === 'fr' ? 'Erreur de Connexion' : 'Connection Error'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {lang === 'fr' 
                          ? 'La base de données Supabase est temporairement inactive.'
                          : 'The Supabase database is temporarily offline.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setRefreshCount(prev => prev + 1)}
                      className="bg-[#149655] hover:bg-[#0b3b24] text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-xs uppercase tracking-wider w-full"
                    >
                      {lang === 'fr' ? 'Réessayer' : 'Retry'}
                    </button>
                  </div>
                </div>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col gap-4 hover:bg-gray-50/50 transition-colors">
                    {/* Item Information Header */}
                    <div className="flex gap-4">
                      {item.url && item.url !== "" && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-base uppercase tracking-tight truncate">
                          {item.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions Section */}
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-50">
                      {/* Status Toggle on Left */}
                      <div>
                        <StatusToggle item={item} onToggle={handleToggleStatus} lang={lang} />
                      </div>

                      {/* Action buttons on Right */}
                      <div className="flex items-center gap-1.5">
                        {item.table === 'contacts' ? (
                          <button 
                            onClick={() => {
                              setSelectedContact(item);
                              setShowContactModal(true);
                            }} 
                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#149655] hover:bg-[#149655]/10 rounded-lg transition-all" 
                            title={lang === 'fr' ? 'Visualiser le message' : 'View message'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleEdit(item.id, item.table)} 
                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#149655] hover:bg-[#149655]/10 rounded-lg transition-all" 
                            title={t.admin.actions.edit}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(item.id, item.title, item.table)} 
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title={t.admin.actions.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                  {t.admin.table.noData}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Premium Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-[#0b261a]/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[2.5rem] p-10 lg:p-12 max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden z-10"
            >
              {/* Header Accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-dronek-green/60 via-dronek-green to-dronek-dark" />
              
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-6 right-6 p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-24 h-24 mx-auto mb-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="absolute inset-0 bg-[#149655]/10 rounded-[2.5rem] rotate-12" 
                />
                <div className="absolute inset-0 bg-[#149655]/5 rounded-[2.5rem] -rotate-6 animate-pulse" />
                <div className="relative h-full flex items-center justify-center">
                  <AlertTriangle className="w-12 h-12 text-[#149655]" />
                </div>
              </div>

              <h3 className="text-3xl font-black text-gray-900 text-center mb-4 uppercase tracking-tighter italic">
                {lang === 'fr' ? 'Attention !' : 'Warning !'}
              </h3>
              
              <p className="text-gray-500 text-center mb-10 font-medium leading-relaxed text-lg px-2">
                {lang === 'fr' 
                  ? <>Êtes-vous sûr de vouloir supprimer <span className="text-gray-900 font-bold italic">"{itemToDelete?.title}"</span> ? Cette action est définitive.</> 
                  : <>Are you sure you want to delete <span className="text-gray-900 font-bold italic">"{itemToDelete?.title}"</span>? This action is permanent.</>}
              </p>

              <div className="grid grid-cols-2 gap-5">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="py-5 px-6 rounded-2xl bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all active:scale-95 border border-gray-200"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="py-5 px-6 rounded-2xl bg-[#149655] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#0b3b24] transition-all active:scale-95 shadow-xl shadow-[#149655]/20 flex items-center justify-center gap-3"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {lang === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThumbsUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center backdrop-blur-[2px] bg-white/10"
          >
            <motion.div
              initial={{ scale: 0, y: 100 }}
              animate={{ 
                scale: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 200, damping: 15 }
              }}
              exit={{ scale: 0, y: -100 }}
            >
              <motion.div
                animate={{
                  y: [0, 15, 0], // Descend doucement puis remonte (effet bounce naturel)
                  scale: [1, 1.05, 1], // Léger zoom
                  rotate: [-3, 3, -3] // Petite rotation subtile
                }}
                transition={{
                  duration: 2.2, // Animation fluide et lente
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="origin-bottom w-[280px] h-[280px] rounded-[2.5rem] overflow-hidden bg-white border-4 border-white shadow-[0_25px_60px_-15px_rgba(20,150,85,0.45)] relative flex items-center justify-center"
              >
                <video
                  src="/images/thumbs-up-green.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ 
                    filter: 'brightness(1.45) contrast(1.15) saturate(1.1)', 
                    transform: 'scale(1.35)',
                    mixBlendMode: 'multiply'
                  }}
                  className="w-full h-full object-cover origin-center"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactModal && selectedContact && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="absolute inset-0 bg-[#0b261a]/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[2.5rem] p-10 lg:p-12 max-w-2xl w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden z-10"
            >
              {/* Header Accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#149655]/60 via-[#149655] to-[#0b3b24]" />
              
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-6 right-6 p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#149655]/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#149655]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    {lang === 'fr' ? 'Détails du Message' : 'Message Details'}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">{selectedContact.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{lang === 'fr' ? 'Expéditeur' : 'Sender'}</h4>
                  <p className="font-bold text-gray-900 text-lg">{selectedContact.title}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{lang === 'fr' ? 'Sujet / Intérêt' : 'Subject / Interest'}</h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#149655]/10 text-[#149655] uppercase tracking-wide">
                    {selectedContact.category}
                  </span>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email</h4>
                  <a href={`mailto:${selectedContact.email}`} className="font-bold text-[#149655] hover:underline flex items-center gap-1.5 group text-lg break-all">
                    {selectedContact.email}
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{lang === 'fr' ? 'Téléphone' : 'Phone'}</h4>
                  {selectedContact.telephone ? (
                    <a href={`tel:${selectedContact.telephone}`} className="font-bold text-gray-900 hover:text-[#149655] hover:underline flex items-center gap-1.5 group text-lg">
                      {selectedContact.telephone}
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <p className="text-gray-400 font-medium italic text-lg">{lang === 'fr' ? 'Non fourni' : 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="mb-10 text-left">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{lang === 'fr' ? 'Message' : 'Message'}</h4>
                <div className="bg-[#f8faf9] border border-gray-100 p-6 rounded-2xl max-h-[250px] overflow-y-auto text-gray-700 leading-relaxed font-medium whitespace-pre-wrap text-left">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-5 px-6 rounded-2xl bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all active:scale-95 border border-gray-200"
                >
                  {lang === 'fr' ? 'Fermer' : 'Close'}
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.category}`}
                  className="flex-1 py-5 px-6 rounded-2xl bg-[#149655] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#0b3b24] transition-all active:scale-95 shadow-xl shadow-[#149655]/20 flex items-center justify-center gap-3 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  {lang === 'fr' ? 'Répondre' : 'Reply'}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
