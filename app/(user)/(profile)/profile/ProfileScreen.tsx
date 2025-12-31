"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, UploadCloud, Sparkles, Crown
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import UserLayout from "@/components/layouts/UserLayout";

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
         headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
         }
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
    <UserLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-indigo-400 blur-[120px] opacity-30 animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 blur-[120px] opacity-30 animate-pulse-slow animation-delay-2000" />
           <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-amber-300 via-orange-300 to-red-300 blur-[100px] opacity-20 animate-pulse-slow animation-delay-4000" />
      </div>

      <div className="min-h-screen font-sans pb-20 relative z-10">
        
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification({ type: null, message: "" })} 
        />

        <main className="flex items-center justify-center px-4 py-12">

          <div className="relative w-full max-w-[45rem]"> 
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden ring-1 ring-slate-950/5">
                  <div className="h-40 w-full relative bg-slate-900/5 overflow-hidden">
                      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent blur-3xl" />
                      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-fuchsia-500/20 to-transparent blur-3xl" />
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.06]" />
                      
                      <Link 
                          href="/dashboard" 
                          className="absolute top-6 left-6 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/40 text-slate-700 border border-white/30 transition-all font-bold text-sm backdrop-blur-md z-10 hover:scale-105 active:scale-95 shadow-sm"
                      >
                          <ArrowLeft size={16} /> Kembali
                      </Link>
                  </div>

                  <div className="px-8 pb-10 relative z-10">
                      
                      {/* Avatar Section */}
                      <div className="relative -mt-20 mb-8 flex flex-col items-center">
                          {/* Glow behind avatar */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/30 blur-[50px] rounded-full pointer-events-none -z-10" />

                          <div 
                              className="relative group cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                          >
                              <div className="w-32 h-32 rounded-[2rem] p-1.5 bg-white shadow-2xl transform group-hover:scale-105 transition-all duration-300 ring-1 ring-slate-100">
                                  <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-50 relative border border-slate-100">
                                      {(previewImage || userData.avatar_url) ? (
                                          <img src={previewImage || userData.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                                              {userData.full_name?.charAt(0).toUpperCase() || "U"}
                                          </div>
                                      )}

                                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                          <UploadCloud className="text-white drop-shadow-md" size={28} />
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="absolute bottom-1 -right-1 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border-[3px] border-white group-hover:rotate-12 transition-transform duration-300">
                                  <Camera size={16} />
                              </div>

                              <div className={`absolute top-0 -right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white border-[3px] border-white shadow-lg flex items-center gap-1 ${isPremium ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-slate-500'}`}>
                                  {isPremium ? <Crown size={11} fill="currentColor" /> : <User size={11} />}
                                  {isPremium ? "PRO" : "FREE"}
                              </div>

                              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                          </div>

                          <div className="mt-4 text-center">
                              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{userData.full_name || "User Lisan"}</h1>
                              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest mt-2 backdrop-blur-md">
                                  <Sparkles size={12} className="text-indigo-500" /> {userData.role}
                              </div>
                          </div>
                      </div>

                      <form onSubmit={handleSave} className="space-y-5 max-w-md mx-auto">
                          <div className="grid grid-cols-1 gap-5">
                              
                              <div className="space-y-2 group">
                                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                  <div className="relative group">
                                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                      {/* Input lebih tinggi (h-14) */}
                                      <input 
                                          type="text" 
                                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50/80 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800 outline-none placeholder:text-slate-400 text-sm"
                                          value={userData.full_name}
                                          onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                                  <div className="relative group">
                                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fuchsia-600 transition-colors" size={18} />
                                      <input 
                                          type="text" 
                                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50/80 border-transparent focus:bg-white focus:ring-4 focus:ring-fuchsia-500/10 transition-all font-bold text-slate-800 outline-none placeholder:text-slate-400 text-sm"
                                          value={userData.username}
                                          onChange={(e) => setUserData({...userData, username: e.target.value})}
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Alamat Email</label>
                                  <div className="relative group">
                                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors" size={18} />
                                      <input 
                                          type="email" 
                                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50/80 border-transparent focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold text-slate-800 outline-none placeholder:text-slate-400 text-sm"
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
                                  className="w-full py-4 rounded-2xl bg-slate-950 text-white font-bold text-[15px] shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                              >
                                  <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                  {/* Gradient Button yang lebih kaya */}
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600" />

                                  <span className="relative flex items-center gap-2 z-10">
                                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
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
    </UserLayout>
  );
}