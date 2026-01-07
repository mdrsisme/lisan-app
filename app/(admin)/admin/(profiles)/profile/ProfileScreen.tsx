"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User, Mail, AtSign, Save, Loader2, Camera, 
  ShieldCheck, LayoutGrid, CheckCircle2, Crown 
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification"; 
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userData, setUserData] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    role: "",
    avatar_url: "",
    is_verified: false,
    is_premium: false
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // 1. Ambil ID dari LocalStorage saat load
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.id) {
          fetchProfile(userObj.id);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // 2. Fetch ke /users/:id
  const fetchProfile = async (userId: string) => {
    try {
      const res = await api.get(`/users/${userId}`); 
      if (res.success && res.data) {
        const user = res.data;
        setUserData({
          id: user.id,
          full_name: user.full_name || "",
          username: user.username || "",
          email: user.email || "",
          role: user.role || "user",
          avatar_url: user.avatar_url || "",
          is_verified: user.is_verified,
          is_premium: user.is_premium
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 3. Update ke /users/:id (PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    // Pastikan ID ada sebelum update
    if (!userData.id) {
        setNotification({ type: "error", message: "ID User tidak ditemukan." });
        setIsLoading(false);
        return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", userData.full_name);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Request ke /users/:id
      const res = await fetch(`${baseUrl}/users/${userData.id}`, {
        method: "PUT",
        headers: {
           "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      const response = await res.json();

      if (res.ok) {
        // Update data di local storage agar sinkron
        const updatedUser = { ...userData, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setNotification({
            type: "success",
            message: "Profil berhasil diperbarui!"
        });
        
        // Refresh data tampilan
        fetchProfile(userData.id);

      } else {
        throw new Error(response.message || "Gagal update profile");
      }

    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "Gagal memperbarui profil."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20 px-6">
        
        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        <PageHeader
            theme={themeColors.midnight} 
            title="Profil Saya"
            highlight="Akun"
            description="Kelola informasi pribadi dan preferensi akun Anda."
            breadcrumbs={[
                { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
                { label: "Profil", active: true, icon: User },
            ]}
        />

        <div className="relative w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            
            {/* Banner Modern */}
            <div className="h-52 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                
                {/* Dekorasi Abstrak */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[60px] -ml-20 -mb-20"></div>
                
                {/* Badges di Banner */}
                <div className="absolute top-6 right-6 flex gap-2">
                    {userData.is_premium && (
                        <div className="px-3 py-1.5 bg-amber-400/20 backdrop-blur-md border border-amber-400/30 rounded-full shadow-lg flex items-center gap-2">
                            <Crown size={14} className="text-amber-200 fill-amber-200" />
                            <span className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">Premium</span>
                        </div>
                    )}
                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-300" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{userData.role}</span>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-12">
                <div className="relative flex flex-col md:flex-row gap-10 items-start">
                    
                    {/* Avatar Section */}
                    <div className="-mt-24 relative shrink-0 mx-auto md:mx-0 group">
                        <div className="w-44 h-44 rounded-[2.5rem] p-1.5 bg-white shadow-2xl shadow-indigo-900/20 ring-1 ring-slate-100 relative z-10 transition-transform duration-300 group-hover:-translate-y-2">
                             <div 
                                className="w-full h-full rounded-[2.2rem] bg-slate-50 overflow-hidden relative cursor-pointer"
                                onClick={triggerFileInput}
                            >
                                {(previewImage || userData.avatar_url) ? (
                                    <img 
                                        src={previewImage || userData.avatar_url} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-300 text-6xl font-black">
                                        {(userData.full_name || "U").charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Overlay untuk Upload */}
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                                    <Camera size={32} className="mb-2 drop-shadow-md" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Ganti Foto</span>
                                </div>
                             </div>
                             
                             {userData.is_verified && (
                                 <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-xl border-[4px] border-white shadow-sm" title="Terverifikasi">
                                    <CheckCircle2 size={18} />
                                 </div>
                             )}
                        </div>
                        
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>

                    {/* Form Section */}
                    <div className="flex-1 w-full pt-6">
                        <div className="mb-8 text-center md:text-left">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{userData.full_name}</h1>
                            <p className="text-slate-400 text-sm font-medium">@{userData.username} • User ID: {userData.id.substring(0, 8)}...</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="space-y-3 group">
                                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors">Nama Lengkap</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input 
                                            type="text"
                                            value={userData.full_name}
                                            onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                                            placeholder="Nama Lengkap"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 group">
                                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Username</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <AtSign size={20} />
                                        </div>
                                        <input 
                                            type="text"
                                            value={userData.username}
                                            onChange={(e) => setUserData({...userData, username: e.target.value})}
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                                            placeholder="Username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 group md:col-span-2">
                                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-violet-500 transition-colors">Alamat Email</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input 
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex items-center justify-end">
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative overflow-hidden w-full md:w-auto px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    <span>Simpan Perubahan</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}