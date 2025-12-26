"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, UploadCloud, Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import UserNavbar from "@/components/ui/UserNavbar";

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <UserNavbar />
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <main className="flex items-center justify-center px-4 sm:px-6 py-12">
        
        <div className="relative w-full max-w-2xl group">

            <div className="absolute -top-6 -left-6 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-20 animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-pink-500 rounded-full blur-[60px] opacity-20 animate-pulse" />

            <div className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                
                <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                    {/* Header Orbs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full blur-[80px] opacity-60 mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-[80px] opacity-50 mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    
                    <Link 
                        href="/dashboard" 
                        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 transition-all font-bold text-sm backdrop-blur-md z-10 hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft size={16} /> Kembali
                    </Link>
                </div>

                <div className="px-8 pb-12 relative z-10">
                    
                    <div className="relative -mt-20 mb-10 flex flex-col items-center">
                        <div 
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >

                            <div className="w-36 h-36 rounded-[2.5rem] p-1.5 bg-white shadow-xl transform group-hover:scale-105 transition-all duration-300">
                                <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-50 relative border border-slate-100">
                                    {(previewImage || userData.avatar_url) ? (
                                        <img src={previewImage || userData.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                                            {userData.full_name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <UploadCloud className="text-white drop-shadow-md" size={32} />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg text-indigo-600 border border-slate-100 group-hover:rotate-12 transition-transform duration-300">
                                <Camera size={18} />
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>

                        <div className="mt-4 text-center">
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{userData.full_name || "User Lisan"}</h1>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest mt-2">
                                <Sparkles size={12} className="text-indigo-500" /> {userData.role}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6 max-w-lg mx-auto">
                        <div className="grid grid-cols-1 gap-5">
                            
                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
                                        value={userData.full_name}
                                        onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative group">
                                    <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
                                        value={userData.username}
                                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        type="email" 
                                        className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
                                        value={userData.email}
                                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                            >

                                <div className="absolute -top-32 -left-32 w-[420px] h-[420px]
    bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
    rounded-full blur-3xl opacity-40 animate-pulse" />
                                
                                <span className="relative flex items-center gap-2 z-10">
                                    {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                                    Simpan Perubahan
                                </span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}