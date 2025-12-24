"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, UploadCloud, Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

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
      if (res.success || res.data) {
        setUserData(res.data);
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

      if (res.success || res.data) {
        setNotification({ type: 'success', message: "Profil berhasil diperbarui!" });
        const updatedUser = { ...userData, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Terjadi kesalahan." });
    } finally {
      setIsLoading(false);
    }
  };

  const cosmicGradient = "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
  const glassPanel = "bg-white/80 backdrop-blur-2xl border border-white/60 shadow-xl";

  return (
    <div className="min-h-screen bg-[#f8faff] relative overflow-hidden flex justify-center p-6">
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 hover:bg-white text-slate-600 hover:text-indigo-600 border border-slate-200/50 transition-all font-bold text-sm shadow-sm"
          >
            <ArrowLeft size={18} /> Kembali ke Dashboard
          </Link>
        </div>

        <div className={`rounded-[2.5rem] overflow-hidden ${glassPanel}`}>
          
          <div className={`h-32 ${cosmicGradient} relative`}>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
          </div>

          <div className="px-8 pb-10">
            
            <div className="relative -mt-16 mb-8 flex justify-center">
               <div 
                 className="relative group cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}
               >
                 <div className="w-32 h-32 rounded-[2rem] p-1.5 bg-white shadow-2xl shadow-indigo-500/20 transform group-hover:scale-105 transition-all">
                    <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-100 relative">
                        {(previewImage || userData.avatar_url) ? (
                            <img src={previewImage || userData.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-4xl font-bold text-white ${cosmicGradient}`}>
                                {userData.full_name?.charAt(0) || "U"}
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <UploadCloud className="text-white" />
                        </div>
                    </div>
                 </div>
                 <div className="absolute bottom-0 right-0 p-2.5 bg-white rounded-xl shadow-lg text-slate-600 border border-slate-100">
                    <Camera size={16} />
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
               </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
               <div className="text-center mb-8">
                  <h1 className="text-2xl font-black text-slate-800">{userData.full_name || "User Lisan"}</h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-100 mt-2">
                    <Sparkles size={12} /> {userData.role}
                  </span>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Lengkap</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                          type="text" 
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-slate-700"
                          value={userData.full_name}
                          onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
                    <div className="relative group">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                          type="text" 
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-slate-700"
                          value={userData.username}
                          onChange={(e) => setUserData({...userData, username: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                          type="email" 
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-slate-700"
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
                   className={`w-full py-4 rounded-xl ${cosmicGradient} text-white font-bold text-lg shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70`}
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
  );
}