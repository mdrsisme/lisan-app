"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, UploadCloud, Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import { themeColors } from "@/lib/color"; // Pastikan path ini benar

export default function UserProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  const [userData, setUserData] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    role: "user",
    avatar_url: ""
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const localUser = JSON.parse(userStr);
      fetchProfile(localUser.id);
    }
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const res = await api.get(`/users/${id}`);
      if (res.success && res.data) {
        setUserData({
          id: res.data.id,
          full_name: res.data.full_name || "",
          username: res.data.username || "",
          email: res.data.email || "",
          role: res.data.role || "user",
          avatar_url: res.data.avatar_url || ""
        });
      }
    } catch (error) {
      console.error("Gagal load profile");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("user_id", userData.id);
      formData.append("full_name", userData.full_name);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const res = await api.put("/users/me", formData);

      if (res.success && res.data) {
        setNotification({ type: 'success', message: "Profil berhasil diperbarui!" });
        const updatedUser = { ...userData, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
      } else {
        throw new Error(res.message || "Gagal update profil");
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Terjadi kesalahan." });
    } finally {
      setIsLoading(false);
    }
  };

  // Menggunakan tema 'Ocean' dan 'Aurora' untuk nuansa Nature
  const activeTheme = themeColors.ocean; 
  const secondaryTheme = themeColors.aurora;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-6 font-sans">
      
      {/* Background Orbs (Warna Warni tapi Soft) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 animate-pulse-slow ${activeTheme.gradient}`} />
        <div className={`absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 animate-pulse-slower ${secondaryTheme.gradient}`} />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-15 bg-emerald-400" />
      </div>

      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
        
        {/* Tombol Kembali */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 hover:bg-white text-slate-600 hover:text-emerald-600 border border-slate-200/60 shadow-sm transition-all font-bold text-sm backdrop-blur-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali
          </Link>
        </div>

        {/* Card Profil */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
          
          {/* Header Banner (Nature Gradient) */}
          <div className={`h-36 ${activeTheme.gradient} relative`}>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-white/90 to-transparent" />
          </div>

          <div className="px-8 pb-12">
            
            {/* Avatar Section */}
            <div className="relative -mt-20 mb-8 flex flex-col items-center">
               <div 
                 className="relative group cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}
               >
                 {/* Bingkai Avatar */}
                 <div className="w-36 h-36 rounded-[2.5rem] p-1.5 bg-white shadow-2xl shadow-emerald-500/20 transform group-hover:scale-105 transition-all duration-300">
                   <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-50 relative border border-slate-100">
                       {(previewImage || userData.avatar_url) ? (
                           <img src={previewImage || userData.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                       ) : (
                           <div className={`w-full h-full flex items-center justify-center text-5xl font-black text-transparent bg-clip-text ${activeTheme.gradient}`}>
                               {userData.full_name?.charAt(0).toUpperCase() || "U"}
                           </div>
                       )}
                       
                       <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                           <UploadCloud className="text-white drop-shadow-md" size={32} />
                       </div>
                   </div>
                 </div>
                 
                 {/* Ikon Kamera */}
                 <div className="absolute bottom-1 -right-1 p-3 bg-white rounded-2xl shadow-lg text-emerald-600 border border-slate-100 group-hover:rotate-12 transition-transform duration-300">
                   <Camera size={18} />
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
               </div>

               <div className="mt-4 text-center">
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight">{userData.full_name || "User Lisan"}</h1>
                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 ${activeTheme.primary} text-xs font-extrabold uppercase tracking-widest border border-emerald-100 mt-2`}>
                   <Sparkles size={12} /> {userData.role}
                 </span>
               </div>
            </div>

            {/* Form Input Grid */}
            <form onSubmit={handleSave} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 
                 {/* Input: Nama */}
                 <div className="space-y-2">
                   <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                   <div className="relative group">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                       <input 
                         type="text" 
                         className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
                         value={userData.full_name}
                         onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                       />
                   </div>
                 </div>

                 {/* Input: Username */}
                 <div className="space-y-2">
                   <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                   <div className="relative group">
                       <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                       <input 
                         type="text" 
                         className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
                         value={userData.username}
                         onChange={(e) => setUserData({...userData, username: e.target.value})}
                       />
                   </div>
                 </div>

                 {/* Input: Email (Full Width) */}
                 <div className="space-y-2 md:col-span-2">
                   <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                   <div className="relative group">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                       <input 
                         type="email" 
                         className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
                         value={userData.email}
                         onChange={(e) => setUserData({...userData, email: e.target.value})}
                       />
                   </div>
                 </div>
               </div>

               <div className="pt-8">
                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className={`w-full py-4 rounded-2xl ${activeTheme.gradient} text-white font-bold text-lg ${activeTheme.shadow} hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                   Simpan Perubahan
                 </button>
               </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}