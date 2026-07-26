'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ImagePlus, Send, UserCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type NewsPost = {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  gallery?: string | null;
  customDate?: string | null;
  createdAt: string;
};

const composerStyle = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AdminPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    return localToday.toISOString().split('T')[0];
  });
  const [gallery, setGallery] = useState<string[]>([]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/actualites', { cache: 'no-store' });
      const data = await response.json();
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const p = new Promise<string>((resolve) => {
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      });
      reader.readAsDataURL(file);
      const res = await p;
      if (res) newImages.push(res);
    }
    setGallery((prev) => [...prev, ...newImages]);
  };

  const handlePublish = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setPublishing(true);
    try {
      const response = await fetch('/api/actualites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || trimmedText.slice(0, 60),
          content: trimmedText,
          image,
          gallery: gallery.length > 0 ? JSON.stringify(gallery) : null,
          customDate: customDate || new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) return;

      setText('');
      setTitle('');
      setImage(null);
      setGallery([]);
      setCustomDate(new Date().toISOString().split('T')[0]);
      await loadPosts();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-12">
      <section className="relative overflow-hidden bg-gradient-to-br from-dronek-dark via-dronek-green to-[#0e4f37] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] border border-white/15">Admin</p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Gestion des articles</h1>
            <p className="text-white/85 text-lg max-w-2xl">
              Publiez et gérez les actualités avec titre, date, image principale, description complète et galerie photo.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-8 items-start">
          <motion.div initial="hidden" animate="visible" variants={composerStyle}>
            <Card className="rounded-3xl border-0 shadow-[0_18px_50px_rgba(0,0,0,0.08)] overflow-hidden bg-white">
              <CardContent className="p-6 lg:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-dronek-green text-white flex items-center justify-center">
                    <UserCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dronek-text">DRONEK Admin</h2>
                    <p className="text-sm text-dronek-medium">Créer un nouvel article</p>
                  </div>
                </div>

                {/* Titre */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800 ml-1">Titre de l'article</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Titre de l’actualité"
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 outline-none focus:border-dronek-green text-sm font-medium"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800 ml-1">Date de l'article</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(event) => setCustomDate(event.target.value)}
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 outline-none focus:border-dronek-green text-sm font-medium"
                  />
                </div>

                {/* Image 1 (principale) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800 ml-1">Image principale (Image 1)</label>
                  <label className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-dronek-green/35 bg-dronek-light px-4 py-4 text-dronek-green cursor-pointer hover:bg-dronek-green/5 transition-colors">
                    <ImagePlus className="w-5 h-5" />
                    <span className="font-semibold">Sélecteur d'image principale</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>

                  {image && (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white mt-2 group">
                      <img src={image} alt="Prévisualisation principale" className="w-full max-h-56 object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800 ml-1">Description / Contenu</label>
                  <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Écrire le contenu ou la description de l'article..."
                    className="min-h-[160px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-dronek-green resize-none text-sm font-medium"
                  />
                </div>

                {/* Images de Galerie (multiple) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800 ml-1">Galerie d'images supplémentaires</label>
                  <label className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-dronek-green/35 bg-dronek-light px-4 py-4 text-dronek-green cursor-pointer hover:bg-dronek-green/5 transition-colors">
                    <ImagePlus className="w-5 h-5" />
                    <span className="font-semibold">Ajouter des photos à la galerie</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
                  </label>

                  {gallery.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                      {gallery.map((imgUrl, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white group">
                          <img src={imgUrl} alt={`Galerie Preview ${index}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGallery((prev) => prev.filter((_, idx) => idx !== index))}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-90 hover:scale-110 transition-all shadow-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handlePublish}
                  disabled={publishing || !text.trim() || !title.trim()}
                  className="w-full rounded-full bg-dronek-green hover:bg-dronek-dark text-white text-base font-semibold py-6 mt-4"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {publishing ? 'Publication...' : 'Publier l’article'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fil d'actualité public */}
          <div className="space-y-4 lg:space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl lg:text-3xl font-bold text-dronek-text">Articles enregistrés</h2>
              <span className="text-sm text-dronek-medium flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> En direct
              </span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center text-dronek-medium">Chargement...</div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Card className="rounded-3xl border-0 shadow-[0_14px_35px_rgba(0,0,0,0.08)] overflow-hidden bg-white">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 px-5 pt-5">
                          <div className="w-12 h-12 rounded-full bg-dronek-green text-white flex items-center justify-center font-bold overflow-hidden shrink-0">
                            <img src="/logo.svg" alt="DRONEK" className="w-7 h-7 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-dronek-text">DRONEK</span>
                              <span className="text-xs text-dronek-medium">
                                {(() => {
                                  if (post.customDate) {
                                    try {
                                      return new Date(post.customDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                                    } catch (e) {
                                      return post.customDate;
                                    }
                                  }
                                  return new Date(post.createdAt).toLocaleDateString('fr-FR');
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4">
                          <h3 className="font-extrabold text-dronek-dark text-lg mb-2">{post.title}</h3>
                          <p className="text-dronek-text leading-relaxed whitespace-pre-wrap text-sm">{post.content}</p>
                        </div>

                        {post.image && (
                          <div className="px-5 pb-5">
                            <div className="rounded-2xl overflow-hidden bg-dronek-light border border-gray-100">
                              <img src={post.image} alt={post.title} className="w-full max-h-[28rem] object-cover" />
                            </div>
                          </div>
                        )}

                        {post.gallery && (() => {
                          try {
                            const imgs = JSON.parse(post.gallery);
                            if (Array.isArray(imgs) && imgs.length > 0) {
                              return (
                                <div className="px-5 pb-5">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Galerie Photos</p>
                                  <div className="grid grid-cols-4 gap-2">
                                    {imgs.map((img: string, idx: number) => (
                                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
                                        <img src={img} alt={`Galerie ${idx}`} className="w-full h-full object-cover" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                          } catch (e) {
                            console.error(e);
                          }
                          return null;
                        })()}
                      </CardContent>
                    </Card>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
