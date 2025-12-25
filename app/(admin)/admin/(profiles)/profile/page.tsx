"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, UploadCloud 
} from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilePage() {
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
      console.error("Gagal mengambil profil", error);
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
      // Gunakan user_id agar sesuai dengan backend updateMyProfile
      formData.append("user_id", userData.id); 
      formData.append("full_name", userData.full_name);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      // Pastikan endpoint benar (sesuai backend router.put('/me'))
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "PUT",
        body: formData,
      });
      
      const response = await res.json();

      if (res.ok) {
        alert("Profil berhasil diperbarui!");
        // Update local storage agar navbar langsung berubah
        const updatedUser = { ...userData, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
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

  const gradientBg = "bg-gradient-to-tl from-[#3b82f6] via-[#06b6d4] to-[#10b981]";
  const textAccent = "text-[#10b981]"; // Emerald
  const borderFocus = "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20";
  const btnGradient = "bg-gradient-to-r from-[#3b82f6] to-[#10b981] hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.4)]";

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-slate-600 font-sans relative overflow-x-hidden flex items-center justify-center p-6">

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#3b82f6]/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.4] mix-blend-soft-light" style={{ backgroundImage: 'url("/noise.png")' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">

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

        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-2xl shadow-cyan-900/5 overflow-hidden">

          <div className={`h-40 ${gradientBg} relative`}>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15]" />
            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white/80 to-transparent" />
          </div>

          <div className="px-8 pb-10">
            <div className="flex flex-col md:flex-row gap-10">

              <div className="-mt-16 flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                  <div className="w-36 h-36 rounded-[2rem] bg-white p-1.5 shadow-xl shadow-cyan-500/20 transform group-hover:scale-105 transition-all duration-300">
                    <div className={`w-full h-full rounded-[1.8rem] overflow-hidden flex items-center justify-center bg-slate-50 relative border border-slate-100`}>
                      {(previewImage || userData.avatar_url) ? (
                        <img 
                          src={previewImage || userData.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`text-4xl font-bold bg-clip-text text-transparent ${gradientBg}`}>
                          {(userData.full_name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <UploadCloud className="text-white" size={32} />
                      </div>
                    </div>
                  </div>
                  
                  <button type="button" className="absolute bottom-2 right-2 p-2.5 rounded-xl bg-white text-slate-600 shadow-lg border border-slate-100 group-hover:text-[#06b6d4] transition-colors">
                    <Camera size={18} />
                  </button>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                
                <div className="mt-5 text-center">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{userData.full_name}</h2>
                  <p className="text-xs font-bold text-[#06b6d4] bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-lg inline-block mt-2 uppercase tracking-wider">
                    {userData.role}
                  </p>
                </div>
              </div>

              <div className="flex-1 pt-2 md:pt-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <User size={14} className={textAccent} /> Nama Lengkap
                      </label>
                      <input 
                        type="text" 
                        className={`w-full h-14 px-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none text-slate-700 font-bold placeholder:text-slate-300 ${borderFocus}`}
                        value={userData.full_name}
                        onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <AtSign size={14} className={textAccent} /> Username
                      </label>
                      <input 
                        type="text" 
                        className={`w-full h-14 px-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none text-slate-700 font-bold placeholder:text-slate-300 ${borderFocus}`}
                        value={userData.username}
                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <Mail size={14} className={textAccent} /> Email Address
                      </label>
                      <input 
                        type="email" 
                        className={`w-full h-14 px-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none text-slate-700 font-bold placeholder:text-slate-300 ${borderFocus}`}
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>

                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-4 rounded-2xl ${btnGradient} text-white font-bold text-lg shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
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
      </div>
    </div>
  );
}