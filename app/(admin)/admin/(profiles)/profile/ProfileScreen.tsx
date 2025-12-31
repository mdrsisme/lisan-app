"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, AtSign, Save, Loader2, ImagePlus, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userData, setUserData] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    role: "",
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
        const user = res.data;
        setUserData({
          id: user.id,
          full_name: user.full_name || "",
          username: user.username || "",
          email: user.email || "",
          role: user.role || "user",
          avatar_url: user.avatar_url || ""
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
        method: "PUT",
        body: formData,
        headers: {
           "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      const response = await res.json();

      if (res.ok) {
        const updatedUser = { ...userData, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profil berhasil diperbarui!"); 
      } else {
        throw new Error(response.message || "Gagal update");
      }

    } catch (error: any) {
      alert("Gagal memperbarui profil: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center overflow-hidden">

      <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-700 relative z-10 px-6">
        
        <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Profil</h1>
            <p className="text-slate-500 font-medium">Perbarui informasi akun Anda.</p>
        </div>

        <div className="rounded-[3rem] border border-white/60 shadow-2xl shadow-slate-200/40 overflow-hidden relative bg-white/40 backdrop-blur-xl">
          
          <div className="h-48 relative overflow-hidden bg-slate-900">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/80 to-slate-900/90 z-10" />
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[80px] -mt-40 -mr-20 z-0" />
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-500/40 rounded-full blur-[60px] -mb-20 -ml-20 z-0" />
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15] z-20 mix-blend-overlay" />
             
             <div className="absolute top-8 right-10 z-30 text-white/20">
                <Sparkles size={80} strokeWidth={1} />
             </div>
          </div>

          <form onSubmit={handleSave} className="px-8 md:px-12 pb-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              
              <div className="-mt-20 md:-mt-24 flex flex-col items-center md:items-start shrink-0 relative z-20">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                  <div className="w-44 h-44 rounded-[2.5rem] p-2 bg-white/70 backdrop-blur-xl shadow-2xl ring-2 ring-white transition-transform duration-300 group-hover:scale-105 hover:shadow-indigo-500/20">
                    <div className="w-full h-full rounded-[2rem] overflow-hidden bg-slate-100 relative border border-slate-200/50">
                      {(previewImage || userData.avatar_url) ? (
                        <img 
                          src={previewImage || userData.avatar_url} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-6xl bg-gradient-to-br from-slate-100 to-slate-200">
                          {(userData.full_name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-[3px] text-white gap-2">
                        <ImagePlus className="drop-shadow-md animate-bounce" size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest drop-shadow-md">Ubah Foto</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-xl border-4 border-white/80 backdrop-blur-md shadow-lg uppercase tracking-wider z-30">
                    {userData.role}
                  </div>

                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>

              <div className="flex-1 pt-4 md:pt-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                            <User size={16} className="text-indigo-500" /> Nama Lengkap
                        </label>
                        <input 
                            type="text" 
                            className="w-full h-14 px-6 rounded-[1.2rem] bg-white/50 border border-white/80 backdrop-blur-md focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none text-base font-bold text-slate-800 placeholder:text-slate-400 shadow-sm"
                            value={userData.full_name}
                            onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                            placeholder="Nama lengkap Anda"
                        />
                    </div>

                    <div className="space-y-3 group">
                        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                            <AtSign size={16} className="text-fuchsia-500" /> Username
                        </label>
                        <input 
                            type="text" 
                            className="w-full h-14 px-6 rounded-[1.2rem] bg-white/50 border border-white/80 backdrop-blur-md focus:bg-white focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/20 transition-all outline-none text-base font-bold text-slate-800 placeholder:text-slate-400 shadow-sm"
                            value={userData.username}
                            onChange={(e) => setUserData({...userData, username: e.target.value})}
                            placeholder="Username unik"
                        />
                    </div>
                </div>

                <div className="space-y-3 group">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                        <Mail size={16} className="text-cyan-500" /> Email Address
                    </label>
                    <input 
                        type="email" 
                        className="w-full h-14 px-6 rounded-[1.2rem] bg-white/50 border border-white/80 backdrop-blur-md focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none text-base font-bold text-slate-800 placeholder:text-slate-400 shadow-sm"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        placeholder="Alamat email aktif"
                    />
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-200/30">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold text-base shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-3">
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Simpan Perubahan
                        </div>
                    </button>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}