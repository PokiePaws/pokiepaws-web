'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {useLanguageStore} from "../../../store/use-language-store";
import {translations} from "../../../lib/translations";
import Navbar from '../../../components/navbar';
import { mockBlog } from '../../../lib/mock-data';
import {ChevronRight,Calendar, User, Tag} from "lucide-react";

export default function BlogPage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <header className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl font-display font-bold text-stone-900 mb-6">{t.blog.title}</h1>
                    <p className="text-lg text-stone-600">{t.blog.subtitle}</p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {mockBlog.map((post) => (
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
                  <span className="bg-white/90 backdrop-blur-sm text-[#68bade] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
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
                                <h2 className="text-2xl font-display font-bold text-stone-900 leading-tight group-hover:text-[#68bade] transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[#68bade] font-bold text-sm pt-4 group/link">
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

