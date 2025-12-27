"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, UploadCloud, Sparkles, Crown
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import UserNavbar from "@/components/ui/UserNavbar";

export default function ProfileScreen() {
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
    avatar_url: "",
    is_premium: false
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
          avatar_url: res.data.avatar_url || "",
          is_premium: res.data.is_premium || false
        });
      }
    } catch (error) {
      console.error(error);
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
         method: 'PUT',
         body: formData,
      });

      const response = await res.json();

      if (res.ok) {
        setNotification({ type: 'success', message: "Profil berhasil diperbarui!" });
        const updatedUser = { ...userData, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
      } else {
        throw new Error(response.message || "Gagal update profil");
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Terjadi kesalahan." });
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = userData.is_premium;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <UserNavbar />
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <main className="flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="relative w-full max-w-2xl">
            <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                
                <div className="h-48 w-full relative bg-slate-950 overflow-hidden">
                    <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/40 rounded-full blur-[80px] animate-pulse-slow" />
                    <div className="absolute bottom-[-50%] right-[-10%] w-[350px] h-[350px] bg-fuchsia-500/40 rounded-full blur-[80px] animate-pulse-slow" />
                    <div className="absolute top-[20%] right-[30%] w-[200px] h-[200px] bg-amber-400/30 rounded-full blur-[60px]" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.08]" />
                    
                    <Link 
                        href="/dashboard" 
                        className="absolute top-8 left-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 transition-all font-bold text-sm backdrop-blur-md z-10 hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft size={18} /> Kembali
                    </Link>
                </div>

                <div className="px-8 pb-12 relative z-10">
                    
                    <div className="relative -mt-24 mb-10 flex flex-col items-center">
                        <div 
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-40 h-40 rounded-[2.5rem] p-1.5 bg-white shadow-2xl transform group-hover:scale-105 transition-all duration-300">
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
                            
                            <div className="absolute bottom-2 -right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-lg border-4 border-white group-hover:rotate-12 transition-transform duration-300">
                                <Camera size={18} />
                            </div>

                            <div className={`absolute top-0 -right-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white border-4 border-white shadow-lg flex items-center gap-1 ${isPremium ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-slate-500'}`}>
                                {isPremium ? <Crown size={12} fill="currentColor" /> : <User size={12} />}
                                {isPremium ? "PRO" : "FREE"}
                            </div>

                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>

                        <div className="mt-5 text-center">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{userData.full_name || "User Lisan"}</h1>
                            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest mt-2">
                                <Sparkles size={12} className="text-indigo-500" /> {userData.role}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6 max-w-lg mx-auto">
                        <div className="grid grid-cols-1 gap-6">
                            
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        className="w-full h-16 pl-14 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800 outline-none placeholder:text-slate-300 text-lg"
                                        value={userData.full_name}
                                        onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative group">
                                    <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fuchsia-600 transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        className="w-full h-16 pl-14 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-fuchsia-500/10 transition-all font-bold text-slate-800 outline-none placeholder:text-slate-300 text-lg"
                                        value={userData.username}
                                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        className="w-full h-16 pl-14 pr-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold text-slate-800 outline-none placeholder:text-slate-300 text-lg"
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
                                className="w-full py-5 rounded-2xl bg-slate-950 text-white font-bold text-lg shadow-xl shadow-slate-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                            >
                                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

                                <span className="relative flex items-center gap-2 z-10">
                                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
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