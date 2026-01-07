"use client";

import { useEffect, useState, use } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, BrainCircuit, Medal, Layers, ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DictionaryDetailScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [dictionary, setDictionary] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, learned: 0, percentage: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dictRes = await api.get(`/dictionaries/${id}`);
        if (dictRes.success) setDictionary(dictRes.data);

        const itemsRes = await api.get(`/dictionaries/${id}/items`);
        if (itemsRes.success) {
           const dataItems = itemsRes.data;
           setItems(dataItems);
           
           const total = dataItems.length;
           const learned = dataItems.filter((i: any) => i.is_learned).length;
           const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;
           
           setStats({ total, learned, percentage });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'alphabet': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'word': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'phrase': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'alphabet': return 'Abjad';
      case 'word': return 'Kata';
      case 'phrase': return 'Frasa';
      default: return type;
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (!dictionary) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Kamus tidak ditemukan</h2>
            <Link href="/dictionaries" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                <ArrowLeft size={16} /> Kembali ke List
            </Link>
        </div>
    </div>
  );

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] pb-20 relative overflow-hidden">
        
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Navigasi Balik (Minimalis) */}
            <Link 
                href="/dictionaries" 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group w-fit"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-300 transition-all shadow-sm">
                    <ArrowLeft size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                Kembali ke Katalog
            </Link>

            {/* Dictionary Info Card (Modern Glassmorphism) */}
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 group">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(dictionary.category_type)}`}>
                            {getCategoryLabel(dictionary.category_type)}
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                                {dictionary.title}
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                {dictionary.description || "Tingkatkan kemampuan bahasa isyarat Anda dengan modul ini."}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                    <BrainCircuit size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Item</span>
                                    <span className="text-sm font-black text-slate-700">{stats.total} Materi</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.percentage === 100 ? 'bg-yellow-100 text-yellow-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {stats.percentage === 100 ? <Medal size={18} /> : <Layers size={18} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                                    <span className="text-sm font-black text-slate-700">{stats.percentage}% Selesai</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Circle Visual (Opsional, mempercantik tampilan) */}
                    <div className="hidden md:flex relative w-32 h-32 items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                strokeDasharray={377} 
                                strokeDashoffset={377 - (377 * stats.percentage) / 100} 
                                className="text-indigo-500 transition-all duration-1000 ease-out" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute text-center">
                            <span className="text-2xl font-black text-slate-800">{stats.percentage}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Item Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-indigo-500 rounded-full" />
                        Daftar Materi
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                        {stats.learned} / {stats.total} Selesai
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.length > 0 ? items.map((item, idx) => (
                        <Link 
                            href={`/dictionaries/${id}/${item.id}`} 
                            key={item.id} 
                            className="group relative bg-white hover:bg-slate-50 border border-slate-100 hover:border-indigo-100 rounded-[2rem] p-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 flex items-center gap-5 overflow-hidden"
                        >
                            {/* Number Badge */}
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 shrink-0
                                ${item.is_learned 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                                    : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30'}
                            `}>
                                {item.is_learned ? <CheckCircle2 size={20} strokeWidth={3} /> : idx + 1}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-lg mb-1 truncate transition-colors ${item.is_learned ? 'text-emerald-700' : 'text-slate-800 group-hover:text-indigo-700'}`}>
                                    {item.word}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium truncate">
                                    {item.definition || 'Klik untuk mulai belajar'}
                                </p>
                            </div>
                            
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all shrink-0">
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full py-16 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">Belum ada item materi di modul ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </UserLayout>
  );
}