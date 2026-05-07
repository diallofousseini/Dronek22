'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ImagePlus, Send, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type NewsPost = {
  id: string;
  title: string;
  content: string;
  image?: string | null;
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
        }),
      });

      if (!response.ok) return;

      setText('');
      setTitle('');
      setImage(null);
      await loadPosts();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-dronek-dark via-dronek-green to-[#0e4f37] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] border border-white/15">Admin</p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Publier une actualité en style Facebook</h1>
            <p className="text-white/85 text-lg max-w-2xl">
              Ajoutez un texte, une image optionnelle et publiez instantanément vers le fil d’actualité public.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-8 items-start">
          <motion.div initial="hidden" animate="visible" variants={composerStyle}>
            <Card className="rounded-3xl border-0 shadow-[0_18px_50px_rgba(0,0,0,0.08)] overflow-hidden">
              <CardContent className="p-6 lg:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-dronek-green text-white flex items-center justify-center">
                    <UserCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dronek-text">DRONEK Admin</h2>
                    <p className="text-sm text-dronek-medium">Composer une publication</p>
                  </div>
                </div>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Titre court de l’actualité"
                  className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 outline-none focus:border-dronek-green"
                />

                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Écrire une nouvelle actualité..."
                  className="min-h-[200px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-dronek-green resize-none"
                />

                <label className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-dronek-green/35 bg-dronek-light px-4 py-4 text-dronek-green cursor-pointer hover:bg-dronek-green/5 transition-colors">
                  <ImagePlus className="w-5 h-5" />
                  <span className="font-semibold">Image optionnelle</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>

                {image && (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                    <img src={image} alt="Prévisualisation" className="w-full max-h-72 object-cover" />
                  </div>
                )}

                <Button
                  onClick={handlePublish}
                  disabled={publishing || !text.trim()}
                  className="w-full rounded-full bg-dronek-green hover:bg-dronek-dark text-white text-base font-semibold py-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {publishing ? 'Publication...' : 'Publier l’actualité'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4 lg:space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl lg:text-3xl font-bold text-dronek-text">Fil d’actualité public</h2>
              <span className="text-sm text-dronek-medium flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Publication automatique</span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center text-dronek-medium">Chargement...</div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Card className="rounded-3xl border-0 shadow-[0_14px_35px_rgba(0,0,0,0.08)] overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 px-5 pt-5">
                          <div className="w-12 h-12 rounded-full bg-dronek-green text-white flex items-center justify-center font-bold overflow-hidden shrink-0">
                            <img src="/logo.svg" alt="DRONEK" className="w-7 h-7 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-dronek-text">DRONEK</span>
                              <span className="text-xs text-dronek-medium">{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4">
                          <p className="text-dronek-text leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {post.image && (
                          <div className="px-5 pb-5">
                            <div className="rounded-2xl overflow-hidden bg-dronek-light">
                              <img src={post.image} alt={post.title} className="w-full max-h-[28rem] object-cover" />
                            </div>
                          </div>
                        )}
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
