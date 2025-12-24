"use client";

import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Shield, 
  Zap, 
  Code, 
  ChevronRight, 
  Server,
  Database,
  Lock,
  Copy,
  Check
} from "lucide-react";

const DOC_CATEGORIES = [
  {
    id: "start",
    title: "Memulai (Getting Started)",
    desc: "Panduan instalasi, konfigurasi awal, dan pengenalan antarmuka.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    id: "guide",
    title: "Panduan Pengguna",
    desc: "Tutorial langkah demi langkah menggunakan fitur utama LISAN.",
    icon: BookOpen,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  },
  {
    id: "security",
    title: "Keamanan & Privasi",
    desc: "Bagaimana kami melindungi data Anda dan kebijakan privasi.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    id: "troubleshoot",
    title: "Pemecahan Masalah",
    desc: "Solusi untuk kendala umum dan FAQ teknis.",
    icon: FileText,
    color: "text-rose-500",
    bg: "bg-rose-50"
  }
];

const API_ENDPOINTS = [
  { method: "GET", path: "/api/v1/users", desc: "Mengambil daftar semua pengguna", type: "blue" },
  { method: "POST", path: "/api/v1/auth/login", desc: "Otentikasi pengguna dan dapatkan token", type: "green" },
  { method: "GET", path: "/api/v1/courses", desc: "Mendapatkan katalog kursus tersedia", type: "blue" },
  { method: "PUT", path: "/api/v1/users/profile", desc: "Memperbarui informasi profil pengguna", type: "orange" },
  { method: "DELETE", path: "/api/v1/announcements/:id", desc: "Menghapus pengumuman (Admin only)", type: "red" },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'docs' | 'api'>('docs');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("Authorization: Bearer <your_token>");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="relative rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest mb-3 text-indigo-200">
                <BookOpen size={14} /> Knowledge Base
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">Pusat Bantuan & API</h1>
              <p className="text-slate-400 max-w-lg">Temukan panduan penggunaan atau dokumentasi teknis untuk integrasi sistem.</p>
            </div>

            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'docs' 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen size={18} /> Dokumentasi
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'api' 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Code size={18} /> API Reference
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'docs' ? (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari artikel, tutorial, atau panduan..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="text-indigo-500" size={20} /> Kategori Bantuan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {DOC_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <cat.icon size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{cat.title}</h4>
                    <p className="text-sm text-slate-500 mb-4">{cat.desc}</p>
                    <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                      Lihat Artikel <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-emerald-500" /> Otentikasi
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    Semua request API harus menyertakan header otentikasi menggunakan <strong>Bearer Token</strong>. Anda bisa mendapatkan token melalui endpoint Login.
                  </p>
                  <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between group">
                    <code className="text-xs md:text-sm font-mono text-emerald-400">
                      Authorization: Bearer &lt;your_token&gt;
                    </code>
                    <button 
                      onClick={handleCopy}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Server size={20} className="text-indigo-500" /> Endpoint Tersedia
                  </h3>
                  
                  <div className="space-y-3">
                    {API_ENDPOINTS.map((api, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all group">
                        <div className={`
                          px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider w-fit
                          ${api.type === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                          ${api.type === 'green' ? 'bg-emerald-50 text-emerald-600' : ''}
                          ${api.type === 'orange' ? 'bg-amber-50 text-amber-600' : ''}
                          ${api.type === 'red' ? 'bg-rose-50 text-rose-600' : ''}
                        `}>
                          {api.method}
                        </div>
                        <code className="font-mono text-sm text-slate-700 font-semibold">{api.path}</code>
                        <span className="text-xs font-medium text-slate-400 md:ml-auto">{api.desc}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 hidden md:block" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                    <Database size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Status Server</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-indigo-100">Semua sistem normal</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-indigo-200 mb-1">
                        <span>Uptime</span>
                        <span>99.9%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="w-[99%] h-full bg-emerald-400 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-indigo-200 mb-1">
                        <span>Latency</span>
                        <span>24ms</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="w-[80%] h-full bg-blue-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                   <h4 className="font-bold text-slate-800 mb-2">Butuh Akses Khusus?</h4>
                   <p className="text-sm text-slate-500 mb-4">
                     Untuk integrasi enterprise atau limit API yang lebih besar, silakan hubungi tim developer.
                   </p>
                   <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors">
                     Request API Key
                   </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}