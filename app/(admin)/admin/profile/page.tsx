"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, MapPin 
} from "lucide-react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    full_name: "",
    username: "",
    email: "",
    role: "",
    initial: "",
    bio: "Bergabung dengan LISAN untuk menciptakan dunia yang lebih inklusif."
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData(prev => ({
        ...prev,
        full_name: user.full_name || "",
        username: user.username || "",
        email: user.email || "",
        role: user.role || "User",
        initial: (user.full_name || "A").charAt(0).toUpperCase()
      }));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Profil berhasil diperbarui!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-600 font-sans relative overflow-x-hidden flex items-center justify-center p-6">

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#6B4FD3]/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F062C0]/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.4] mix-blend-soft-light" />
      </div>

      <div className="relative z-10 w-full max-w-4xl animate-fade-in-up">

        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/admin/dashboard" 
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 text-slate-600 font-semibold text-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        </div>
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">

          <div className="h-32 bg-gradient-to-r from-[#6ECFF6]/30 via-[#6B4FD3]/20 to-[#F062C0]/20 relative">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.2]" />
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8">

              <div className="-mt-12 flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#6B4FD3] to-[#F062C0] flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                      {userData.initial}
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 rounded-full bg-white text-slate-600 shadow-lg border border-slate-100 hover:text-[#6B4FD3] transition-colors">
                    <Camera size={18} />
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold text-slate-800">{userData.full_name}</h2>
                  <p className="text-sm font-medium text-[#6B4FD3] bg-[#6B4FD3]/10 px-3 py-1 rounded-full inline-block mt-1">
                    {userData.role}
                  </p>
                </div>
              </div>

              <div className="flex-1 pt-4 md:pt-8">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <User size={16} className="text-[#6B4FD3]" /> Nama Lengkap
                      </label>
                      <input 
                        type="text" 
                        className="w-full h-12 px-4 rounded-xl bg-white/50 border border-slate-200 focus:bg-white focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10 outline-none transition-all text-slate-700 font-medium"
                        value={userData.full_name}
                        onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <AtSign size={16} className="text-[#6B4FD3]" /> Username
                      </label>
                      <input 
                        type="text" 
                        className="w-full h-12 px-4 rounded-xl bg-white/50 border border-slate-200 focus:bg-white focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10 outline-none transition-all text-slate-700 font-medium"
                        value={userData.username}
                        readOnly
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Mail size={16} className="text-[#6B4FD3]" /> Email
                      </label>
                      <input 
                        type="email" 
                        className="w-full h-12 px-4 rounded-xl bg-white/50 border border-slate-200 focus:bg-white focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10 outline-none transition-all text-slate-700 font-medium"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <MapPin size={16} className="text-[#6B4FD3]" /> Bio
                      </label>
                      <textarea 
                        rows={3}
                        className="w-full p-4 rounded-xl bg-white/50 border border-slate-200 focus:bg-white focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10 outline-none transition-all text-slate-700 font-medium resize-none"
                        value={userData.bio}
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-[#6B4FD3] hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}