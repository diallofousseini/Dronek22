'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Search, Zap, Briefcase, FileText, Users, MessageSquare, Globe } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { collection, query, orderBy, deleteDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from '@/components/dronek/LanguageProvider';

interface DashboardItem {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('services');
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Helper to format date based on language
  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
  };

  const tabs = [
    { id: 'all', label: lang === 'fr' ? 'Service' : 'Service', icon: Zap },
    { id: 'projets', label: t.admin.tabs.projects, icon: Briefcase },
    { id: 'actualites', label: t.admin.tabs.news, icon: FileText },
    { id: 'equipe', label: t.admin.tabs.team, icon: Users },
    { id: 'contacts', label: t.admin.tabs.contacts, icon: MessageSquare },
    { id: 'production_sites', label: t.admin.tabs.production_sites, icon: Globe },
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
    if (!db) return;
    
    setLoading(true);
    
    const collectionsToFetch = activeTab === 'all' 
      ? ['projects', 'news', 'team', 'contacts', 'production_sites', 'services']
      : [activeTab === 'projets' ? 'projects' : 
         activeTab === 'actualites' ? 'news' : 
         activeTab === 'equipe' ? 'team' : 
         activeTab === 'contacts' ? 'contacts' : 
         activeTab === 'production_sites' ? 'production_sites' : 'services'];

    let allUnsubscribes: any[] = [];
    let combinedItems: any[] = [];

    const fetchCollection = (name: string) => {
      const q = query(collection(db, name), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const colItems = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || doc.data().name || (lang === 'fr' ? 'Sans titre' : 'Untitled'),
          category: doc.data().category || doc.data().type || doc.data().badge || name,
          status: doc.data().status || (lang === 'fr' ? 'Publié' : 'Published'),
          date: formatDate(doc.data().createdAt),
          collection: name,
          rawDate: doc.data().createdAt?.toDate?.() || new Date()
        }));

        // Replace items from this collection in combinedItems
        combinedItems = [
          ...combinedItems.filter(item => item.collection !== name),
          ...colItems
        ].sort((a, b) => b.rawDate - a.rawDate);

        setItems(combinedItems);
        setLoading(false);
      }, (error) => {
        console.error(`Error listening to ${name}:`, error);
      });
    };

    allUnsubscribes = collectionsToFetch.map(name => fetchCollection(name));

    return () => allUnsubscribes.forEach(unsub => unsub());
  }, [activeTab, lang]);

  const handleLogout = async () => {
    localStorage.removeItem('dronek_mock_auth');
    if (auth) {
      await signOut(auth);
    }
    window.location.href = '/admin/login';
  };

  const handleDelete = async (id: string, title: string, collectionName: string) => {
    if (!db) return;
    if (confirm(t.admin.actions.confirmDelete.replace('{title}', title))) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error("Error deleting item:", error);
        alert(t.admin.actions.deleteError);
      }
    }
  };

  const handleToggleStatus = async (item: any) => {
    if (!db) return;
    const newStatus = item.status === 'Publié' || item.status === 'Published' 
      ? (lang === 'fr' ? 'Brouillon' : 'Draft')
      : (lang === 'fr' ? 'Publié' : 'Published');
    
    try {
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, item.collection, item.id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = (id: string, collectionName: string) => {
    const typeMap: any = {
      'projects': 'projet',
      'news': 'actualite',
      'team': 'membre',
      'contacts': 'contact',
      'production_sites': 'production_site',
      'services': 'service'
    };
    const type = typeMap[collectionName] || 'service';
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

        <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <div className="relative h-12 flex items-center">
              <Image src="/Typographie/logoV.png" alt="DRONEK Logo" width={200} height={50} className="h-[60px] w-auto object-contain" priority />
            </div>
            <div className="h-10 w-[1px] bg-gray-200 mx-2 hidden sm:block" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight uppercase">
                {t.admin.dashboard} <span className="text-[#149655]">DRONEK</span>
              </h1>
              <p className="text-sm text-gray-500 font-medium">{t.admin.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={`/admin/services/new?type=${activeTab === 'projets' ? 'projet' : activeTab === 'actualites' ? 'actualite' : activeTab === 'equipe' ? 'membre' : activeTab === 'contacts' ? 'contact' : activeTab === 'production_sites' ? 'production_site' : 'service'}`}
              className="flex items-center gap-2 bg-[#149655] hover:bg-[#0b3b24] text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-[#149655]/20 uppercase text-sm"
            >
              <Plus className="w-5 h-5 stroke-[3px]" />
              {t.admin.add} {
                activeTab === 'all' ? (lang === 'fr' ? 'Service' : 'Service') : 
                activeTab === 'projets' ? t.admin.tabs.projects.slice(0, -1) : 
                activeTab === 'actualites' ? t.admin.tabs.news.slice(0, -1) : 
                activeTab === 'equipe' ? t.admin.tabs.team : 
                activeTab === 'production_sites' ? (lang === 'fr' ? 'Site' : 'Site') :
                t.admin.tabs.contacts.slice(0, -1) && activeTab === 'contacts' ? t.admin.tabs.contacts.slice(0, -1) : (lang === 'fr' ? 'Service' : 'Service')
              }
            </Link>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-6 py-3 rounded-xl font-medium transition-all group text-sm"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
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
                  activeTab === 'all' ? (lang === 'fr' ? 'Service' : 'Service') : 
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">{t.admin.table.item}</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">{t.admin.table.category}</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">{t.admin.table.status}</th>
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
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <span className="font-bold text-gray-900 group-hover:text-[#149655] transition-colors text-lg uppercase tracking-tight">{item.title}</span>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-600 font-medium uppercase">{item.category}</td>
                      <td className="px-6 py-6">
                        <button 
                          onClick={() => handleToggleStatus(item)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95",
                            (item.status === 'Publié' || item.status === 'Published') 
                              ? "bg-green-50 text-green-700 border border-green-100" 
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          )}
                        >
                           <div className={cn("w-2 h-2 rounded-full", (item.status === 'Publié' || item.status === 'Published') ? "bg-green-500" : "bg-amber-400")} />
                           <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                         </button>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500 font-normal">{item.date}</td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleEdit(item.id, item.collection)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#149655] hover:bg-[#149655]/10 rounded-xl transition-all" title={t.admin.actions.edit}><Edit2 className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(item.id, item.title, item.collection)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title={t.admin.actions.delete}><Trash2 className="w-5 h-5" /></button>
                          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title={t.admin.actions.view}><ExternalLink className="w-5 h-5" /></button>
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
          </div>
        </div>
      </main>
    </div>
  );
}
