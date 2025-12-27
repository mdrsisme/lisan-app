"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Camera, User, Mail, AtSign, Save, Loader2, UploadCloud 
} from "lucide-react";
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
        alert("Profil berhasil diperbarui!");
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

  return (
    <div className="relative w-full min-h-[calc(100vh-100px)] flex flex-col items-center justify-center p-6 bg-slate-50">

      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengaturan Profil</h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden relative">
          
          <div className="h-44 relative overflow-hidden bg-slate-900">
             <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[80px] animate-pulse-slow" />
             <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-500/30 rounded-full blur-[80px]" />
             <div className="absolute top-[20%] right-[30%] w-[200px] h-[200px] bg-cyan-500/20 rounded-full blur-[60px]" />
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05]" />
          </div>

          <div className="px-8 pb-10">
            <div className="flex flex-col md:flex-row gap-10">

              <div className="-mt-20 flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                  <div className="w-40 h-40 rounded-[2rem] bg-white p-2 shadow-2xl shadow-slate-200 transform group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-[1.6rem] overflow-hidden flex items-center justify-center bg-slate-100 relative border border-slate-100">
                      {(previewImage || userData.avatar_url) ? (
                        <img 
                          src={previewImage || userData.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-5xl font-black text-slate-300">
                          {(userData.full_name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <UploadCloud className="text-white" size={32} />
                      </div>
                    </div>
                  </div>
                  
                  <button type="button" className="absolute bottom-2 right-2 p-3 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors border-4 border-white">
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
                
                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{userData.full_name}</h2>
                  <p className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg inline-block mt-2 uppercase tracking-wider">
                    {userData.role}
                  </p>
                </div>
              </div>

              <div className="flex-1 pt-6 md:pt-8">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <User size={14} className="text-indigo-600" /> Nama Lengkap
                      </label>
                      <input 
                        type="text" 
                        className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-400"
                        value={userData.full_name}
                        onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <AtSign size={14} className="text-fuchsia-600" /> Username
                      </label>
                      <input 
                        type="text" 
                        className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-400"
                        value={userData.username}
                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <Mail size={14} className="text-cyan-600" /> Email Address
                      </label>
                      <input 
                        type="email" 
                        className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-400"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>

                  </div>

                  <div className="pt-8 border-t border-slate-100 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center gap-2">
                         {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                         Simpan Perubahan
                      </div>
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