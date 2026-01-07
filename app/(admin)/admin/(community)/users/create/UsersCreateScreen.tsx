"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Mail, Lock, Shield, 
  Eye, EyeOff, Save, Loader2, 
  RefreshCw, KeyRound, Type, 
  LayoutGrid, Users, UserPlus, 
  CheckCircle2, AlertCircle, ArrowRight, ShieldCheck
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import Notification from "@/components/ui/Notification";
import { themeColors } from "@/lib/color";
import { api } from "@/lib/api";

export default function CreateUserScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null,
    message: ""
  });

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  const [errors, setErrors] = useState({
    full_name: "",
    username: "",
    email: "",
    password: ""
  });

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
    setErrors({ ...errors, password: "" });
    setShowPassword(true); 
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { full_name: "", username: "", email: "", password: "" };

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Nama wajib diisi";
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email salah";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Min. 8 karakter";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: "" });

    if (!validateForm()) {
      setNotification({ type: 'error', message: "Mohon periksa form anda kembali." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      if (res.success || res.status) {
        setNotification({ type: 'success', message: `User ${formData.username} berhasil dibuat!` });
        setTimeout(() => router.push("/admin/users"), 1500);
      } else {
        throw new Error(res.message || "Gagal membuat user");
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Terjadi kesalahan sistem." });
    } finally {
      setIsLoading(false);
    }
  };

  const oceanGradient = "bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]";
  const oceanText = "text-[#06b6d4]";
  const oceanFocus = "focus:ring-[#06b6d4]/20 group-focus-within:text-[#06b6d4]";
  const oceanBgLight = "bg-[#ecfeff]";

  return (
    <AdminLayout>
      <div className="w-full max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        <PageHeader
          theme={themeColors.ocean}
          title="Registrasi User"
          highlight="Baru"
          description="Tambahkan anggota baru secara manual ke dalam sistem."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "User", href: "/admin/users", icon: Users },
            { label: "Baru", active: true, icon: UserPlus },
          ]}
        />

        {/* Updated Route Link: /admin/users/verify */}
        <Link href="/admin/users/verify" className="block group">
          <div className={`relative overflow-hidden rounded-2xl ${oceanGradient} p-[2px] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300`}>
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 flex items-center justify-between group-hover:bg-white/90 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-[#06b6d4] shadow-inner border border-white">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">Verifikasi Manual</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Gunakan jika user terkendala OTP.</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#06b6d4] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                    <ArrowRight size={16} />
                </div>
            </div>
          </div>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
              <div className={`w-12 h-12 ${oceanBgLight} rounded-2xl ${oceanText} flex items-center justify-center ring-4 ring-white shadow-sm`}>
                  <User size={22} />
              </div>
              <div>
                  <h3 className="font-bold text-slate-800 text-base">Informasi Dasar</h3>
                  <p className="text-xs text-slate-400">Data identitas pengguna</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2 group/input">
                <div className="flex justify-between items-center px-1">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${errors.full_name ? 'text-red-500' : 'text-slate-500'}`}>
                    <Type size={12} /> Nama Lengkap
                  </label>
                  {errors.full_name && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle size={10}/> {errors.full_name}
                    </span>
                  )}
                </div>
                <div className="relative">
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.full_name ? 'text-red-400' : 'text-slate-400'} ${oceanFocus}`}>
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Contoh: Budi Santoso"
                      className={`w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50/50 border outline-none font-bold text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-300 focus:bg-white focus:ring-[3px] focus:shadow-lg focus:shadow-cyan-100/50 ${errors.full_name ? 'border-red-500 focus:ring-red-100' : `border-slate-200 ${oceanFocus}`}`}
                      value={formData.full_name}
                      onChange={(e) => {
                        setFormData({...formData, full_name: e.target.value});
                        if(e.target.value) setErrors({...errors, full_name: ""});
                      }}
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 group/input">
                    <div className="flex justify-between items-center px-1">
                        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${errors.username ? 'text-red-500' : 'text-slate-500'}`}>Username</label>
                        {errors.username && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle size={10}/> Wajib</span>}
                    </div>
                    <div className="relative">
                        <div className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-base transition-colors ${errors.username ? 'text-red-400' : 'text-slate-400'} ${oceanFocus}`}>@</div>
                        <input 
                        type="text" 
                        placeholder="budisantoso"
                        className={`w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50/50 border outline-none font-bold text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-300 focus:bg-white focus:ring-[3px] focus:shadow-lg focus:shadow-cyan-100/50 ${errors.username ? 'border-red-500 focus:ring-red-100' : `border-slate-200 ${oceanFocus}`}`}
                        value={formData.username}
                        onChange={(e) => {
                            setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')});
                            if(e.target.value) setErrors({...errors, username: ""});
                        }}
                        />
                    </div>
                </div>

                <div className="space-y-2 group/input">
                    <div className="flex justify-between items-center px-1">
                        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${errors.email ? 'text-red-500' : 'text-slate-500'}`}>Email</label>
                        {errors.email && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle size={10}/> Invalid</span>}
                    </div>
                    <div className="relative">
                        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400'} ${oceanFocus}`}><Mail size={18} /></div>
                        <input 
                        type="email" 
                        placeholder="email@domain.com"
                        className={`w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50/50 border outline-none font-bold text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-300 focus:bg-white focus:ring-[3px] focus:shadow-lg focus:shadow-cyan-100/50 ${errors.email ? 'border-red-500 focus:ring-red-100' : `border-slate-200 ${oceanFocus}`}`}
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if(e.target.value) setErrors({...errors, email: ""});
                        }}
                        />
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <div className="space-y-5 border-b border-slate-50 pb-6">
               <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${oceanBgLight} ${oceanText} flex items-center justify-center ring-4 ring-white shadow-sm`}>
                         <Lock size={18} />
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-800 text-sm">Keamanan</h3>
                         <p className="text-[10px] text-slate-400">Password akun</p>
                      </div>
                  </div>
                  <button type="button" onClick={generatePassword} className={`text-[10px] font-bold ${oceanText} bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-all flex items-center gap-1.5`}>
                    <RefreshCw size={12} /> Auto Generate
                  </button>
               </div>
               
               <div className="space-y-2">
                 <div className="relative group/pass">
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-400'} ${oceanFocus}`}><KeyRound size={18} /></div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Minimal 8 karakter..."
                      className={`w-full h-12 pl-12 pr-12 rounded-2xl bg-slate-50/50 border outline-none font-bold text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-300 focus:bg-white focus:ring-[3px] focus:shadow-lg focus:shadow-cyan-100/50 ${errors.password ? 'border-red-500 focus:ring-red-100' : `border-slate-200 ${oceanFocus}`}`}
                      value={formData.password}
                      onChange={(e) => {
                          setFormData({...formData, password: e.target.value});
                          if(e.target.value) setErrors({...errors, password: ""});
                      }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
                 {errors.password && (
                    <div className="flex items-center gap-1.5 px-2">
                       <AlertCircle size={12} className="text-red-500" />
                       <p className="text-[10px] font-bold text-red-500">{errors.password}</p>
                    </div>
                 )}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 px-1 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${oceanBgLight} ${oceanText} flex items-center justify-center ring-4 ring-white shadow-sm`}>
                     <Shield size={18} />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 text-sm">Role Akun</h3>
                     <p className="text-[10px] text-slate-400">Tingkat akses pengguna</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.role === 'user' ? `border-[#06b6d4] bg-cyan-50/30` : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                    <input type="radio" name="role" value="user" className="hidden" checked={formData.role === 'user'} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors ${formData.role === 'user' ? 'bg-[#06b6d4] text-white shadow-md shadow-cyan-300' : 'bg-slate-100 text-slate-400'}`}>
                        <User size={20} />
                    </div>
                    <div className="flex-1">
                      <span className={`block text-sm font-bold ${formData.role === 'user' ? 'text-[#0e7490]' : 'text-slate-600'}`}>User Biasa</span>
                      <span className="text-[10px] text-slate-400">Akses standar</span>
                    </div>
                    {formData.role === 'user' && <CheckCircle2 size={20} className="text-[#06b6d4]" />}
                  </label>

                  <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.role === 'admin' ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                    <input type="radio" name="role" value="admin" className="hidden" checked={formData.role === 'admin'} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors ${formData.role === 'admin' ? 'bg-slate-800 text-white shadow-md shadow-slate-300' : 'bg-slate-100 text-slate-400'}`}>
                        <Shield size={20} />
                    </div>
                    <div className="flex-1">
                      <span className={`block text-sm font-bold ${formData.role === 'admin' ? 'text-slate-900' : 'text-slate-600'}`}>Admin</span>
                      <span className="text-[10px] text-slate-400">Full akses</span>
                    </div>
                    {formData.role === 'admin' && <CheckCircle2 size={20} className="text-slate-800" />}
                  </label>
               </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-5 rounded-2xl ${oceanGradient} text-white font-bold text-lg shadow-xl shadow-[#06b6d4]/30 hover:shadow-[#06b6d4]/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:transform-none`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
              <> <Save size={22} /> Simpan Data User </>
            )}
          </button>

        </form>
      </div>
    </AdminLayout>
  );
}