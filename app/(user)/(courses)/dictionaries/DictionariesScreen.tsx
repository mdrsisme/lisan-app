"use client";

import { useState, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Search, BookOpen, BarChart3, ArrowRight, Layers } from "lucide-react";

export default function DictionariesPage() {
  const [dictionaries, setDictionaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dictionaries");
        if (res.success) setDictionaries(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = dictionaries.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : d.category_type === filter;
    return matchSearch && matchFilter;
  });

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'alphabet': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'word': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'phrase': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-600';
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

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        {/* Hero Header */}
        <div className="bg-slate-900 pt-24 pb-32 px-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
           <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]" />
           <div className="max-w-6xl mx-auto relative z-10 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">
                Pustaka Belajar
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Kamus Bahasa Isyarat
              </h1>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                Pilih modul pembelajaran dan mulai tingkatkan kemampuan Bisindo Anda.
              </p>
           </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
           {/* Filters */}
           <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4 items-center mb-10">
              <div className="relative flex-1 w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                    type="text" 
                    placeholder="Cari topik kamus..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-medium transition-all" 
                 />
              </div>
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                 {['all', 'alphabet', 'word', 'phrase'].map((cat) => (
                    <button 
                        key={cat} 
                        onClick={() => setFilter(cat)} 
                        className={`px-5 py-3 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all border ${filter === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {cat === 'all' ? 'Semua' : getCategoryLabel(cat)}
                    </button>
                 ))}
              </div>
           </div>

           {/* Content Grid */}
           {loading ? <LoadingSpinner /> : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.length > 0 ? filteredData.map((dict) => (
                   <Link href={`/dictionaries/${dict.id}`} key={dict.id} className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="h-48 bg-slate-100 relative overflow-hidden">
                         {dict.thumbnail_url ? (
                            <Image src={dict.thumbnail_url} alt={dict.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 text-slate-300">
                                <BookOpen size={48} />
                            </div>
                         )}
                         <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getCategoryColor(dict.category_type)}`}>
                                {getCategoryLabel(dict.category_type)}
                            </span>
                         </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                         <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {dict.title}
                         </h3>
                         <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                            {dict.description || "Tidak ada deskripsi."}
                         </p>
                         
                         <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                {dict.user_progress ? (
                                    <>
                                        <Layers size={14} className="text-emerald-500" />
                                        <span className="text-emerald-600">{dict.user_progress.progress_percentage}% Selesai</span>
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 size={14} />
                                        <span>Mulai Belajar</span>
                                    </>
                                )}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <ArrowRight size={16} />
                            </div>
                         </div>
                      </div>
                   </Link>
                )) : (
                    <div className="col-span-full py-20 text-center text-slate-400">
                        <p className="font-medium">Tidak ada kamus yang ditemukan.</p>
                    </div>
                )}
             </div>
           )}
        </div>
      </div>
    </UserLayout>
  );
}