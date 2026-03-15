'use client';

import Navbar from '../../components/navbar';
import { useLanguageStore } from '../../store/use-language-store';
import { translations } from '../../lib/translations';
import { ChevronRight, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    const posts = [
        {
            id: '1',
            title: language === 'en' ? 'How to Keep Your Pet Cool in Summer' : 'Jak zapewnić psu chłód w lecie',
            excerpt: language === 'en' ? 'Summer heat can be dangerous for pets. Learn how to prevent heatstroke and keep your furry friends comfortable.' : 'Letnie upały mogą być niebezpieczne dla zwierząt. Dowiedz się, jak zapobiegać udarowi cieplnemu.',
            author: 'Dr. Sarah Smith',
            date: 'May 10, 2024',
            category: language === 'en' ? 'Pet Care' : 'Opieka',
            image: 'https://picsum.photos/seed/summer-pet/800/600',
        },
        {
            id: '2',
            title: language === 'en' ? 'The Importance of Regular Dental Checkups' : 'Znaczenie regularnych przeglądów dentystycznych',
            excerpt: language === 'en' ? 'Dental health is often overlooked in pets, but it is crucial for their overall well-being. Here is why you should book a cleaning.' : 'Zdrowie zębów jest często pomijane u zwierząt, ale jest kluczowe dla ich ogólnego samopoczucia.',
            author: 'Dr. Mark Wilson',
            date: 'May 5, 2024',
            category: language === 'en' ? 'Health' : 'Zdrowie',
            image: 'https://picsum.photos/seed/pet-dental/800/600',
        },
        {
            id: '3',
            title: language === 'en' ? 'Understanding Your Cat\'s Body Language' : 'Zrozumienie mowy ciała Twojego kota',
            excerpt: language === 'en' ? 'Cats communicate in subtle ways. Learn how to decode your cat\'s tail movements, ear positions, and purrs.' : 'Koty komunikują się w subtelny sposób. Dowiedz się, jak odczytywać ruchy ogona i uszu kota.',
            author: 'Dr. Emily Chen',
            date: 'April 28, 2024',
            category: language === 'en' ? 'Behavior' : 'Zachowanie',
            image: 'https://picsum.photos/seed/cat-behavior/800/600',
        },
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <header className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl font-display font-bold text-stone-900 mb-6">{t.blog.title}</h1>
                    <p className="text-lg text-stone-600">{t.blog.subtitle}</p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map((post) => (
                        <article key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="aspect-[16/10] relative overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex items-center gap-4 text-xs text-stone-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {post.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" /> {post.author}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-display font-bold text-stone-900 leading-tight group-hover:text-emerald-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm pt-4 group/link">
                                    {t.blog.readMore}
                                    <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
