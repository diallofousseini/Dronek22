'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Search, Zap, Briefcase, FileText, Users, MessageSquare, Globe, Loader2, Edit2, Trash2, ExternalLink, LayoutGrid, ChevronRight, Image as ImageIcon, AlertTriangle, X, Eye, Menu, Folder, Calendar, SlidersHorizontal, ChevronLeft, ChevronDown } from 'lucide-react';
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
  service_type?: string;
}

const StatusToggle = ({ item, onToggle, lang }: { item: DashboardItem, onToggle: (item: DashboardItem) => void, lang: string }) => {
  const isPublished = item.status === 'Publié' || item.status === 'Published' || item.status === 'publie';

  return (
    <div className="relative select-none flex items-center justify-center">
      <div 
        onClick={() => onToggle(item)}
        className={cn(
          "px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs cursor-pointer border transition-colors w-[125px] justify-between shadow-sm",
          isPublished 
            ? "bg-[#dcfce7]/40 text-[#14532d] border-[#14532d]/10 hover:bg-[#dcfce7]/60" 
            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", isPublished ? "bg-[#14532d]" : "bg-gray-400")} />
          <span>{isPublished ? (lang === 'fr' ? 'Publié' : 'Published') : (lang === 'fr' ? 'Brouillon' : 'Draft')}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'publie' && (item.status === 'Publié' || item.status === 'Published' || item.status === 'publie')) ||
      (selectedStatus === 'brouillon' && (item.status === 'Brouillon' || item.status === 'Draft' || item.status === 'brouillon'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getDescription = (item: any) => {
    return item.description || item.message || item.sujet || item.content || (lang === 'fr' ? "Aucune description" : "No description");
  };

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
    { id: 'all', label: t.admin.tabs.all, icon: LayoutGrid },
    { id: 'services', label: t.admin.tabs.services, icon: Zap },
    { id: 'projets', label: t.admin.tabs.projects, icon: Briefcase },
    { id: 'actualites', label: t.admin.tabs.news, icon: FileText },
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
      ? ['projets', 'actualites', 'contacts', 'production_sites', 'services']
      : activeTab === 'mediatheque' ? ['contacts'] : [activeTab];

    const fetchData = async () => {
      let combined: any[] = [];
      let fetchFailed = false;
      let lastErrorMessage = '';

      try {
        const { data: configRes } = await supabase.from('contacts').select('*').eq('sujet', 'MainServices').maybeSingle();
        let mainIds: string[] = [];
        if (configRes && configRes.message) {
          try { mainIds = JSON.parse(configRes.message); } catch (e) {}
        }

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
            combined = [...combined, ...data.map(item => {
              let categoryVal = item.sujet === 'Mediatheque' ? 'Média' : (item.categorie || item.category || table);
              if (table === 'services') {
                const isDomain = item.service_type === 'domain' || mainIds.includes(item.id);
                categoryVal = isDomain 
                  ? (lang === 'fr' ? "Domaine d'expertise" : "Domain of expertise")
                  : (lang === 'fr' ? "Service" : "Service");
              }
              return {
                ...item,
                id: item.id,
                title: item.prenom || item.nom ? `${item.prenom || ''} ${item.nom || ''}`.trim() : (item.sujet || item.titre || item.name || item.title || (lang === 'fr' ? 'Sans titre' : 'Untitled')),
                category: categoryVal,
                status: item.statut || item.status || (lang === 'fr' ? 'Publié' : 'Published'),
                date: formatDate(item.created_at),
                table: table,
                url: item.url || item.image_url || item.photo_url || item.image || item.photo,
                rawDate: new Date(item.created_at)
              };
            })];
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
    const isDomain = tableName === 'services' && (
      item?.service_type === 'domain' || 
      item?.category === "Domaine d'expertise" || 
      item?.category === "Domain of expertise"
    );
    const modeParam = isDomain ? '&mode=featured' : '';
    router.push(`/admin/services/new?type=${type}&id=${id}${modeParam}`);
  };

return (
  <div className="min-h-screen flex bg-[#f7fbf8] text-gray-800 font-sans relative overflow-hidden">
    
    {/* Decorative background vectors */}
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#14532d]/5 blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#14532d]/5 blur-[120px] pointer-events-none" />

    {/* Sidebar - Desktop uniquement */}
    <aside className="hidden md:flex flex-col w-64 bg-[#14532d] min-h-screen text-white p-6 relative overflow-hidden flex-shrink-0 border-r border-white/5 shadow-2xl">
      {/* Subtle corner watermark on green sidebar */}
      <div className="absolute top-[-40px] right-[-40px] w-48 h-48 opacity-[0.05] pointer-events-none">
        <Image 
          src="/images/dronek_image3-removebg-preview.png" 
          alt="" 
          fill 
          className="object-contain invert brightness-0 rotate-12"
        />
      </div>

      {/* Logo */}
      <div className="mb-10 pl-2 relative z-10 flex items-center h-12">
        <Image 
          src="/logo.png" 
          alt="DRONEK" 
          width={140} 
          height={40} 
          className="w-auto h-8 object-contain brightness-0 invert" 
          priority 
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 relative z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
                isActive 
                  ? "bg-[#dcfce7] text-[#14532d] shadow-md shadow-black/5" 
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>

    {/* Mobile Drawer Sidebar */}
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-50 bg-[#0b261a]/60 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#14532d] text-white p-6 flex flex-col md:hidden shadow-2xl border-r border-white/5"
          >
            {/* Close button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="mb-10 pl-2 flex items-center h-12">
              <Image 
                src="/logo.png" 
                alt="DRONEK" 
                width={140} 
                height={40} 
                className="w-auto h-8 object-contain brightness-0 invert" 
                priority 
              />
            </div>

            {/* Menu list */}
            <nav className="flex-1 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
                      isActive 
                        ? "bg-[#dcfce7] text-[#14532d] shadow-md" 
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>

    {/* Main Area */}
    <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-y-auto">
      
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 transition-all duration-300 bg-white/80 backdrop-blur-xl",
        isScrolled ? "shadow-sm border-b border-gray-100" : "shadow-none"
      )}>
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100/30 overflow-hidden">
          <motion.div 
            className="h-full bg-[#14532d] origin-left" 
            style={{ width: `${scrollProgress}%` }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Hamburger Button for Mobile/Tablet */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight uppercase">
                {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold">{t.admin.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'mediatheque' ? (
              <Link 
                href="/admin/services/new?type=mediatheque"
                className="flex items-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-md shadow-[#14532d]/10 uppercase text-xs"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Ajouter Média' : 'Add Media'}</span>
              </Link>
            ) : activeTab === 'contacts' ? (
              <Link 
                href="/admin/services/new?type=contact"
                className="flex items-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-md shadow-[#14532d]/10 uppercase text-xs"
              >
                <Edit2 className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Modifier coordonnées' : 'Edit Coordinates'}</span>
              </Link>
            ) : (
              <Link 
                href={`/admin/services/new?type=${
                  activeTab === 'projets' ? 'projet' : 
                  activeTab === 'actualites' ? 'actualite' : 
                  activeTab === 'equipe' ? 'membre' : 
                  activeTab === 'production_sites' ? 'production_site' : 'service'
                }`}
                className="flex items-center gap-2 bg-[#14532d] hover:bg-[#0d361d] text-white px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-md shadow-[#14532d]/10 uppercase text-xs"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>
                  {t.admin.add} {
                    activeTab === 'all' ? (lang === 'fr' ? 'Service' : 'Service') : 
                    activeTab === 'projets' ? t.admin.tabs.projects.slice(0, -1) : 
                    activeTab === 'actualites' ? t.admin.tabs.news.slice(0, -1) : 
                    activeTab === 'equipe' ? t.admin.tabs.team : 
                    activeTab === 'production_sites' ? (lang === 'fr' ? 'Site' : 'Site') :
                    (lang === 'fr' ? 'Service' : 'Service')
                  }
                </span>
              </Link>
            )}

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-5 py-3 rounded-2xl font-bold transition-all group text-xs shadow-sm"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>{t.admin.logout}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Actualités publiées */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#14532d] flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'fr' ? 'Actualités publiées' : 'Published News'}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">24</h3>
            </div>
          </div>

          {/* Card 2: Catégories */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 flex-shrink-0">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'fr' ? 'Catégories' : 'Categories'}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">5</h3>
            </div>
          </div>

          {/* Card 3: Vues totales */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'fr' ? 'Vues totales' : 'Total Views'}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">1 248</h3>
            </div>
          </div>

          {/* Card 4: Dernière publication */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'fr' ? 'Dernière publication' : 'Last Publication'}
              </p>
              <div className="flex flex-col mt-1">
                <h3 className="text-sm font-extrabold text-gray-900">
                  {items.filter(i => i.table === 'actualites' && (i.status === 'Publié' || i.status === 'Published' || i.status === 'publie'))[0]?.date || '12/06/2026'}
                </h3>
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                  {lang === 'fr' ? "Aujourd'hui" : 'Today'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.admin.searchPlaceholder.replace('{tab}', 
                activeTab === 'all' ? (lang === 'fr' ? 'Élément' : 'Item') : 
                activeTab === 'services' ? (lang === 'fr' ? 'Service' : 'Service') :
                activeTab === 'projets' ? t.admin.tabs.projects : 
                activeTab === 'actualites' ? t.admin.tabs.news : 
                activeTab === 'equipe' ? t.admin.tabs.team : 
                activeTab === 'production_sites' ? (lang === 'fr' ? 'Site' : 'Site') :
                t.admin.tabs.contacts
              )}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] transition-all font-medium text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            {/* Category Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-200 rounded-2xl pl-5 pr-10 py-3.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] cursor-pointer shadow-sm hover:bg-gray-50 transition-colors uppercase tracking-wider"
              >
                <option value="all">{lang === 'fr' ? 'Toutes les catégories' : 'All Categories'}</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-450">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Status Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-200 rounded-2xl pl-5 pr-10 py-3.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] cursor-pointer shadow-sm hover:bg-gray-50 transition-colors uppercase tracking-wider"
              >
                <option value="all">{lang === 'fr' ? 'Tous les statuts' : 'All Statuses'}</option>
                <option value="publie">{lang === 'fr' ? 'Publié' : 'Published'}</option>
                <option value="brouillon">{lang === 'fr' ? 'Brouillon' : 'Draft'}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-450">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Filters Badge */}
            <button className="flex items-center justify-center gap-2 bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#14532d] px-5 py-3.5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-sm uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Filtres' : 'Filters'}</span>
            </button>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-150/40 overflow-hidden">
          {/* Desktop Table View */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-gray-55/60 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-550 uppercase tracking-widest">{lang === 'fr' ? 'Actualité' : 'Item'}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-550 uppercase tracking-widest">{t.admin.table.category}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-550 uppercase tracking-widest text-center">{t.admin.table.status}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-550 uppercase tracking-widest">{t.admin.table.date}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-550 uppercase tracking-widest text-right">{t.admin.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-[#14532d] animate-spin" />
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
                        className="mt-2 bg-[#14532d] hover:bg-[#0d361d] text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 text-xs uppercase tracking-wider shadow-lg shadow-[#14532d]/20"
                      >
                        {lang === 'fr' ? 'Réessayer' : 'Retry'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {item.url && item.url !== "" ? (
                          <div className="w-20 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm">
                            <img src={item.url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 text-base uppercase tracking-tight leading-snug group-hover:text-[#14532d] transition-colors">{item.title}</span>
                          <span className="text-xs text-gray-500 mt-1 line-clamp-1 font-medium max-w-xs">{getDescription(item)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-[#dcfce7] text-[#14532d] border border-[#14532d]/10 uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{item.category}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <StatusToggle item={item} onToggle={handleToggleStatus} lang={lang} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#14532d] opacity-70" />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">{item.date}</span>
                          <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider">{lang === 'fr' ? "Aujourd'hui" : 'Today'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {item.table === 'contacts' ? (
                          <button 
                            onClick={() => {
                              setSelectedContact(item);
                              setShowContactModal(true);
                            }} 
                            className="w-9 h-9 bg-gray-55/60 border border-gray-150 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#14532d] hover:bg-[#dcfce7]/60 transition-all active:scale-90" 
                            title={lang === 'fr' ? 'Visualiser le message' : 'View message'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleEdit(item.id, item.table)} 
                            className="w-9 h-9 bg-gray-55/60 border border-gray-150 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#14532d] hover:bg-[#dcfce7]/60 transition-all active:scale-90" 
                            title={t.admin.actions.edit}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(item.id, item.title, item.table)} 
                          className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-550 hover:bg-red-100 hover:text-red-700 transition-all active:scale-90" 
                          title={t.admin.actions.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-350 ml-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
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
                  <Loader2 className="w-10 h-10 text-[#14532d] animate-spin" />
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
                    className="bg-[#14532d] hover:bg-[#0d361d] text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-xs uppercase tracking-wider w-full"
                  >
                    {lang === 'fr' ? 'Réessayer' : 'Retry'}
                  </button>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="p-4 flex flex-col gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex gap-4">
                    {item.url && item.url !== "" ? (
                      <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-base uppercase tracking-tight truncate">
                        {item.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[9px] font-black uppercase bg-[#dcfce7] text-[#14532d] px-2 py-0.5 rounded-md border border-[#14532d]/5">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-55/60">
                    <div>
                      <StatusToggle item={item} onToggle={handleToggleStatus} lang={lang} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.table === 'contacts' ? (
                        <button 
                          onClick={() => {
                            setSelectedContact(item);
                            setShowContactModal(true);
                          }} 
                          className="w-9 h-9 bg-gray-55/60 border border-gray-150 rounded-xl flex items-center justify-center text-gray-505 hover:text-[#14532d] hover:bg-[#dcfce7]/60 rounded-lg transition-all" 
                          title={lang === 'fr' ? 'Visualiser le message' : 'View message'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleEdit(item.id, item.table)} 
                          className="w-9 h-9 bg-gray-55/60 border border-gray-150 rounded-xl flex items-center justify-center text-gray-505 hover:text-[#14532d] hover:bg-[#dcfce7]/60 rounded-lg transition-all" 
                          title={t.admin.actions.edit}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id, item.title, item.table)} 
                        className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-550 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all" 
                        title={t.admin.actions.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-550 font-bold uppercase tracking-widest text-xs">
                {t.admin.table.noData}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredItems.length > 0 && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-450 uppercase tracking-widest">
                {lang === 'fr' 
                  ? `Affichage 1 à ${filteredItems.length} sur ${filteredItems.length} éléments` 
                  : `Showing 1 to ${filteredItems.length} of ${filteredItems.length} items`}
              </span>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-xl border border-gray-250 bg-white flex items-center justify-center text-gray-400 hover:text-[#14532d] hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-xl bg-[#14532d] flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                  1
                </button>
                <button className="w-8 h-8 rounded-xl border border-gray-250 bg-white flex items-center justify-center text-gray-400 hover:text-[#14532d] hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>

    {/* Premium Delete Confirmation Modal */}
    <AnimatePresence>
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
            className="absolute inset-0 bg-[#0b261a]/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="bg-white rounded-[2.5rem] p-10 lg:p-12 max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden z-10"
          >
            {/* Header Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#14532d]" />
            
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-6 right-6 p-2.5 text-gray-450 hover:text-gray-905 hover:bg-gray-100 rounded-full transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-24 h-24 mx-auto mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="absolute inset-0 bg-[#14532d]/10 rounded-[2.5rem] rotate-12" 
              />
              <div className="absolute inset-0 bg-[#14532d]/5 rounded-[2.5rem] -rotate-6 animate-pulse" />
              <div className="relative h-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-[#14532d]" />
              </div>
            </div>

            <h3 className="text-3xl font-black text-gray-900 text-center mb-4 uppercase tracking-tighter italic">
              {lang === 'fr' ? 'Attention !' : 'Warning !'}
            </h3>
            
            <p className="text-gray-500 text-center mb-10 font-medium leading-relaxed text-sm px-2">
              {lang === 'fr' 
                ? <>Êtes-vous sûr de vouloir supprimer <span className="text-gray-900 font-bold italic">"{itemToDelete?.title}"</span> ? Cette action est définitive.</> 
                : <>Are you sure you want to delete <span className="text-gray-900 font-bold italic">"{itemToDelete?.title}"</span>? This action is permanent.</>}
            </p>

            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-4 px-6 rounded-2xl bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all active:scale-95 border border-gray-200"
              >
                {lang === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-4 px-6 rounded-2xl bg-[#14532d] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#0d361d] transition-all active:scale-95 shadow-xl shadow-[#14532d]/20 flex items-center justify-center gap-3"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{lang === 'fr' ? 'Supprimer' : 'Delete'}</span>
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
                y: [0, 15, 0],
                scale: [1, 1.05, 1],
                rotate: [-3, 3, -3]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="origin-bottom w-[280px] h-[280px] rounded-[2.5rem] overflow-hidden bg-white border-4 border-white shadow-[0_25px_60px_-15px_rgba(20,83,45,0.45)] relative flex items-center justify-center"
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
            className="absolute inset-0 bg-[#0b261a]/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="bg-white rounded-[2.5rem] p-10 lg:p-12 max-w-2xl w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden z-10"
          >
            {/* Header Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#14532d]" />
            
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-6 right-6 p-2.5 text-gray-450 hover:text-gray-905 hover:bg-gray-100 rounded-full transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#14532d]/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#14532d]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                  {lang === 'fr' ? 'Détails du Message' : 'Message Details'}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">{selectedContact.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{lang === 'fr' ? 'Expéditeur' : 'Sender'}</h4>
                <p className="font-bold text-gray-900 text-lg">{selectedContact.title}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{lang === 'fr' ? 'Sujet / Intérêt' : 'Subject / Interest'}</h4>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#14532d]/10 text-[#14532d] uppercase tracking-wide">
                  {selectedContact.category}
                </span>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email</h4>
                <a href={`mailto:${selectedContact.email}`} className="font-bold text-[#14532d] hover:underline flex items-center gap-1.5 group text-lg break-all">
                  {selectedContact.email}
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{lang === 'fr' ? 'Téléphone' : 'Phone'}</h4>
                {selectedContact.telephone ? (
                  <a href={`tel:${selectedContact.telephone}`} className="font-bold text-gray-900 hover:text-[#14532d] hover:underline flex items-center gap-1.5 group text-lg">
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
                className="flex-1 py-4 px-6 rounded-2xl bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all active:scale-95 border border-gray-200"
              >
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.category}`}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#14532d] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#0d361d] transition-all active:scale-95 shadow-xl shadow-[#14532d]/20 flex items-center justify-center gap-3 text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Répondre' : 'Reply'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>
);
}
