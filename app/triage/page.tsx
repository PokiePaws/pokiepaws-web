'use client';

import { useState } from 'react';
import { useLanguageStore } from '../../store/use-language-store';
import { translations } from '../../lib/translations';
import { Sparkles, Send, AlertTriangle, Info, ArrowLeft, Heart, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

export default function SmartTriagePage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
    const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; content: string }[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [finalResult, setFinalResult] = useState<{ urgency: string; advice: string } | null>(null);

    const startQuiz = async () => {
        setStep('quiz');
        setIsThinking(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Start a veterinary triage quiz in ${language === 'pl' ? 'Polish' : 'English'}. Ask the first question to the pet owner (e.g., "What kind of pet do you have and what is the main concern today?").`,
                config: {
                    systemInstruction: `You are a helpful veterinary triage assistant. You conduct a short quiz (3-4 questions) to determine the urgency of a pet's health issue. Ask one question at a time in ${language === 'pl' ? 'Polish' : 'English'}.`
                }
            });
            setMessages([{ role: 'assistant', content: response.text || "Hello! What kind of pet do you have and what is the main concern today?" }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages([{ role: 'assistant', content: "Error starting quiz. Please try again." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentInput.trim() || isThinking) return;

        const newMessages = [...messages, { role: 'user' as const, content: currentInput }];
        setMessages(newMessages);
        setCurrentInput('');
        setIsThinking(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

            // If we have enough info (e.g., 3 user answers), ask for final advice
            const userMessageCount = newMessages.filter(m => m.role === 'user').length;

            if (userMessageCount >= 3) {
                const response = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: `Based on the following conversation, provide a final triage assessment in ${language === 'pl' ? 'Polish' : 'English'}:
          ${newMessages.map(m => `${m.role}: ${m.content}`).join('\n')}
          
          Format the response as JSON with keys "urgency" (Critical, High, Medium, or Low) and "advice" (concise medical advice).`,
                    config: {
                        responseMimeType: "application/json",
                        systemInstruction: `You are a veterinary triage assistant. Provide final advice in ${language === 'pl' ? 'Polish' : 'English'}.`
                    }
                });

                const data = JSON.parse(response.text || '{}');
                setFinalResult({
                    urgency: data.urgency || 'Medium',
                    advice: data.advice || 'Please consult a vet.'
                });
                setStep('result');
            } else {
                const response = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: `Continue the triage quiz in ${language === 'pl' ? 'Polish' : 'English'}. Ask the next relevant follow-up question based on the history:
          ${newMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
                    config: {
                        systemInstruction: `You are a veterinary triage assistant. Ask one follow-up question at a time in ${language === 'pl' ? 'Polish' : 'English'}.`
                    }
                });
                setMessages([...newMessages, { role: 'assistant', content: response.text || "Next question..." }]);
            }
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsThinking(false);
        }
    };

    const getUrgencyColor = (urgency: string) => {
        const u = urgency.toLowerCase();
        if (u.includes('critical')) return 'bg-red-100 text-red-700 border-red-200';
        if (u.includes('high')) return 'bg-orange-100 text-orange-700 border-orange-200';
        if (u.includes('medium')) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    const getUrgencyLabel = (urgency: string) => {
        const u = urgency.toLowerCase();
        if (u.includes('critical')) return t.triage.levels.critical;
        if (u.includes('high')) return t.triage.levels.high;
        if (u.includes('medium')) return t.triage.levels.medium;
        return t.triage.levels.low;
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Navbar />

            <main className="flex-grow py-12 md:py-20 px-4">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold uppercase tracking-wider">
                            <Sparkles className="h-4 w-4" />
                            AI Quiz
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-stone-900">{t.triage.title}</h1>
                        <p className="text-stone-500 text-lg max-w-xl mx-auto">{t.triage.subtitle}</p>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 min-h-[400px] flex flex-col">
                        {step === 'intro' && (
                            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 py-12">
                                <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-12 w-12 text-emerald-600" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-stone-900">Ready to start?</h2>
                                    <p className="text-stone-500">The AI will ask you 3-4 questions to assess the situation.</p>
                                </div>
                                <button
                                    onClick={startQuiz}
                                    className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                >
                                    {t.triage.startQuiz}
                                </button>
                            </div>
                        )}

                        {step === 'quiz' && (
                            <div className="flex-grow flex flex-col space-y-8">
                                <div className="flex-grow space-y-6">
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: msg.role === 'assistant' ? -20 : 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[80%] p-6 rounded-3xl font-medium text-lg ${
                                                msg.role === 'assistant'
                                                    ? 'bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100'
                                                    : 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-100'
                                            }`}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isThinking && (
                                        <div className="flex justify-start">
                                            <div className="bg-stone-50 p-6 rounded-3xl rounded-tl-none border border-stone-100 flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                                <span className="text-stone-400 text-sm font-bold uppercase tracking-widest">{t.triage.thinking}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleNext} className="relative mt-auto">
                                    <input
                                        type="text"
                                        value={currentInput}
                                        onChange={(e) => setCurrentInput(e.target.value)}
                                        placeholder={t.triage.typeAnswer}
                                        disabled={isThinking}
                                        className="w-full pl-6 pr-16 py-5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-stone-800 text-lg"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!currentInput.trim() || isThinking}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all"
                                    >
                                        <Send className="h-6 w-6" />
                                    </button>
                                </form>
                            </div>
                        )}

                        {step === 'result' && finalResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-grow space-y-10 py-4"
                            >
                                <div className="text-center space-y-4">
                                    <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                        <ShieldAlert className="h-10 w-10 text-emerald-600" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-stone-900">{t.triage.finalAdvice}</h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            {t.triage.urgency}
                                        </h3>
                                        <div className={`px-8 py-5 rounded-2xl border font-bold text-2xl inline-block ${getUrgencyColor(finalResult.urgency)}`}>
                                            {getUrgencyLabel(finalResult.urgency)}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            {t.triage.advice}
                                        </h3>
                                        <div className="prose prose-stone max-w-none bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100">
                                            <div className="text-stone-700 text-lg leading-relaxed">
                                                <ReactMarkdown>
                                                    {finalResult.advice}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4 items-start">
                                        <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                                        <p className="text-sm text-amber-800 leading-relaxed">
                                            {t.triage.disclaimer}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setStep('intro');
                                        setMessages([]);
                                        setFinalResult(null);
                                    }}
                                    className="w-full py-5 bg-stone-100 text-stone-600 rounded-2xl font-bold text-lg hover:bg-stone-200 transition-all"
                                >
                                    {t.triage.restart}
                                </button>
                            </motion.div>
                        )}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-stone-400 hover:text-emerald-600 font-bold transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-stone-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
                    <div className="flex justify-center items-center gap-2">
                        <Heart className="h-5 w-5 text-emerald-600 fill-emerald-600" />
                        <span className="font-display font-bold text-stone-900">VetClinic Network</span>
                    </div>
                    <p className="text-stone-400 text-sm">© 2024 Caring for your pets with AI and Love.</p>
                </div>
            </footer>
        </div>
    );
}
