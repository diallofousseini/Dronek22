'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';

interface BlogPageProps {
  onNavigate: (page: PageView) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const gradients = [
  'from-dronek-green to-emerald-600',
  'from-dronek-dark to-dronek-green',
  'from-dronek-gold to-amber-600',
  'from-emerald-700 to-teal-600',
  'from-green-700 to-dronek-dark',
];

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const { t, lang } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [...new Set(t.blog.articles.map((a) => a.category))];
  const allTags = [...new Set(t.blog.articles.flatMap((a) => a.tags))];

  const featuredArticle = t.blog.articles[0];
  const otherArticles = t.blog.articles.slice(1);

  // Article Detail View
  if (selectedArticle !== null) {
    const article = t.blog.articles[selectedArticle];
    return (
      <div>
        <section className="relative h-64 sm:h-72 lg:h-80 flex items-center overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[selectedArticle % gradients.length]}`} />
          <div className="absolute inset-0 pattern-dots-light opacity-20" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <Badge className="bg-white/15 text-white backdrop-blur-md border-white/20 mb-4">{article.category}</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{article.tags[0]}</span>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Button variant="ghost" onClick={() => { setSelectedArticle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mb-8 text-dronek-green hover:text-dronek-dark">
              ← {lang === 'fr' ? 'Retour aux articles' : 'Back to articles'}
            </Button>
            <article className="space-y-8">
              <p className="text-dronek-medium leading-relaxed text-lg font-light">{article.excerpt}</p>
              <Separator />
              <p className="text-dronek-text leading-relaxed text-base">{article.content}</p>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-dronek-green border-dronek-green/30 hover:bg-dronek-light cursor-pointer transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-80 sm:h-96 lg:h-[28rem] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dronek-dark via-dronek-green to-dronek-dark" />
        <div className="absolute inset-0 pattern-dots-light opacity-15" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>DRONEK Blog</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-3xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.blog.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl">{t.blog.subtitle}</motion.p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured article */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
              >
                <div
                  className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
                  onClick={() => { setSelectedArticle(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[0]}`} />
                    <div className="absolute inset-0 pattern-dots-light opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-20 h-20 text-white/15" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/15 text-white backdrop-blur-md border-white/20">{featuredArticle.category}</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex items-center gap-2 text-white/70 text-xs mb-2">
                        <Calendar className="w-3 h-3" />
                        {featuredArticle.date}
                      </div>
                      <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-dronek-gold transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {featuredArticle.title}
                      </h2>
                      <p className="text-white/70 text-sm line-clamp-2">{featuredArticle.excerpt}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Other articles grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {otherArticles.map((article, idx) => (
                  <motion.div key={idx} variants={scaleIn}>
                    <Card
                      className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden bg-white hover:-translate-y-1 h-full rounded-2xl"
                      onClick={() => { setSelectedArticle(idx + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      <div className={`relative h-40 bg-gradient-to-br ${gradients[(idx + 1) % gradients.length]} flex items-center justify-center overflow-hidden`}>
                        <BookOpen className="w-12 h-12 text-white/20" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/15 text-white text-xs backdrop-blur-md border-white/20">{article.category}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-xs text-dronek-light-text mb-3">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </div>
                        <h3 className="text-base font-bold text-dronek-text mb-2 line-clamp-2 group-hover:text-dronek-green transition-colors">{article.title}</h3>
                        <p className="text-dronek-medium text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
                        <span className="text-dronek-green font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          {t.blog.readMore}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Search */}
              <Card className="border-0 shadow-md bg-white rounded-2xl">
                <CardContent className="p-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dronek-light-text" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={lang === 'fr' ? 'Rechercher...' : 'Search...'}
                      className="pl-9 rounded-xl border-gray-200 focus:border-dronek-green"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="border-0 shadow-md bg-white rounded-2xl">
                <CardContent className="p-5">
                  <h3 className="font-bold text-dronek-text mb-4 text-sm uppercase tracking-wider">{t.blog.categories}</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer group">
                        <span className="text-sm text-dronek-medium group-hover:text-dronek-green transition-colors">{cat}</span>
                        <Badge variant="secondary" className="text-xs bg-dronek-light text-dronek-green rounded-full">{t.blog.articles.filter((a) => a.category === cat).length}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-0 shadow-md bg-white rounded-2xl">
                <CardContent className="p-5">
                  <h3 className="font-bold text-dronek-text mb-4 text-sm uppercase tracking-wider">{t.blog.tags}</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs text-dronek-green border-dronek-green/20 hover:bg-dronek-light cursor-pointer transition-colors rounded-full">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card className="border-0 shadow-md bg-white rounded-2xl">
                <CardContent className="p-5">
                  <h3 className="font-bold text-dronek-text mb-4 text-sm uppercase tracking-wider">{t.blog.recentPosts}</h3>
                  <div className="space-y-4">
                    {t.blog.articles.slice(0, 3).map((article, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => { setSelectedArticle(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[idx % gradients.length]} shrink-0 flex items-center justify-center overflow-hidden`}>
                          <BookOpen className="w-5 h-5 text-white/50" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-dronek-text line-clamp-2 group-hover:text-dronek-green transition-colors">{article.title}</h4>
                          <p className="text-xs text-dronek-light-text mt-1">{article.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter mini-form */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-dronek-green to-dronek-dark rounded-2xl overflow-hidden">
                <CardContent className="p-5 text-white">
                  <h3 className="font-bold mb-2">{lang === 'fr' ? 'Newsletter' : 'Newsletter'}</h3>
                  <p className="text-white/70 text-sm mb-4">{lang === 'fr' ? 'Recevez nos derniers articles' : 'Receive our latest articles'}</p>
                  {subscribed ? (
                    <p className="text-dronek-gold text-sm font-medium">✓ {lang === 'fr' ? 'Merci pour votre inscription !' : 'Thank you for subscribing!'}</p>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl text-sm focus:border-white/40"
                      />
                      <Button
                        onClick={() => { if (newsletterEmail) { setSubscribed(true); setNewsletterEmail(''); } }}
                        size="sm"
                        className="bg-white text-dronek-dark hover:bg-white/90 rounded-xl font-semibold shrink-0"
                      >
                        OK
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
