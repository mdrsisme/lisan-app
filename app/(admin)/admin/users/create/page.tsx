"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Mail, Lock, Shield, 
  Eye, EyeOff, Save, Loader2, 
  RefreshCw, KeyRound, Type, 
  LayoutGrid, Users, UserPlus, 
  CheckCircle2, AlertCircle, ShieldCheck, ArrowRight
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import Notification from "@/components/ui/Notification";
import { themeColors } from "@/lib/color";
import { api } from "@/lib/api";

export default function CreateUserPage() {
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

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
    setShowPassword(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const res = await api.post("/auth/register", formData);

      if (res.success || res.status) {
        setNotification({ type: 'success', message: `User ${formData.username} berhasil dibuat!` });
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
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
  const oceanBorder = "border-[#06b6d4]";
  const oceanBgLight = "bg-[#ecfeff]";

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
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
            { label: "Pengguna", href: "/admin/users", icon: Users },
            { label: "Buat Baru", active: true, icon: UserPlus },
          ]}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden group hover:border-[#06b6d4]/30 transition-colors duration-300">
              
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className={`w-12 h-12 ${oceanBgLight} rounded-2xl ${oceanText} flex items-center justify-center shadow-sm`}>
                    <User size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Informasi Dasar</h3>
                    <p className="text-slate-400 text-sm">Identitas & kontak pengguna</p>
                </div>
              </div>

              <div className="space-y-6">

                <div className="space-y-2 group/input">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Type size={14} /> Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${oceanFocus}`}>
                        <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Budi Santoso"
                      className={`w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 ${oceanFocus.split(' ')[0]}`}
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group/input">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                        Username
                    </label>
                    <div className="relative">
                        <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors font-black text-lg ${oceanFocus}`}>
                            @
                        </div>
                        <input 
                        type="text" 
                        required
                        placeholder="budisantoso"
                        className={`w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 ${oceanFocus.split(' ')[0]}`}
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                        />
                    </div>
                  </div>

                  <div className="space-y-2 group/input">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                      Alamat Email
                    </label>
                    <div className="relative">
                        <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${oceanFocus}`}>
                            <Mail size={18} />
                        </div>
                        <input 
                        type="email" 
                        required
                        placeholder="email@domain.com"
                        className={`w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 ${oceanFocus.split(' ')[0]}`}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="space-y-6">

            <div className={`p-6 rounded-[2rem] ${oceanGradient} text-white shadow-xl shadow-[#06b6d4]/20 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide bg-black/20 px-2 py-1 rounded-lg backdrop-blur-md">Admin Tool</span>
                </div>
                
                <h3 className="font-bold text-lg leading-tight mb-2">Verifikasi Manual?</h3>
                <p className="text-white/90 text-xs mb-5 leading-relaxed font-medium">
                  Gunakan fitur ini jika pengguna terkendala menerima OTP saat pendaftaran mandiri.
                </p>

                <Link 
                  href="/admin/users/create/verify"
                  className={`w-full py-3 rounded-xl bg-white ${oceanText} font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#ecfeff] transition-all shadow-sm active:scale-95`}
                >
                  Buka Tools <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 group hover:border-[#06b6d4]/30 transition-colors">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className={`p-2 ${oceanBgLight} rounded-lg ${oceanText}`}>
                    <Lock size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Keamanan</h3>
              </div>

              <div className="space-y-3 group/input">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <button 
                    type="button" 
                    onClick={generatePassword}
                    className={`text-[10px] font-bold ${oceanText} hover:text-[#0891b2] ${oceanBgLight} px-2 py-1 rounded-md hover:bg-cyan-100 transition-all flex items-center gap-1`}
                  >
                    <RefreshCw size={10} /> Generate
                  </button>
                </div>
                
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${oceanFocus}`}>
                    <KeyRound size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Min. 8 karakter..."
                    className={`w-full pl-12 pr-12 h-14 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 ${oceanFocus.split(' ')[0]}`}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${
                            formData.password.length === 0 ? 'w-0' :
                            formData.password.length < 8 ? 'w-1/3 bg-rose-400' :
                            'w-full bg-[#10b981]' // Emerald Green for strong
                        }`} 
                    />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-5 group hover:border-[#06b6d4]/30 transition-colors">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className={`p-2 ${oceanBgLight} rounded-lg ${oceanText}`}>
                    <Shield size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Hak Akses</h3>
              </div>

              <div className="space-y-3">
                <label className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group/opt ${
                    formData.role === 'user' 
                    ? `border-[#06b6d4] ${oceanBgLight}` 
                    : 'border-slate-100 hover:border-slate-300'
                  }`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="user" 
                    className="hidden" 
                    checked={formData.role === 'user'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${formData.role === 'user' ? 'bg-[#06b6d4] text-white' : 'bg-slate-100 text-slate-400'}`}>
                     <User size={20} />
                  </div>
                  <div className="flex-1">
                    <span className={`block text-sm font-bold ${formData.role === 'user' ? 'text-[#0e7490]' : 'text-slate-600'}`}>User Biasa</span>
                    <span className="block text-[10px] text-slate-400 font-medium">Akses pembelajaran standar</span>
                  </div>
                  {formData.role === 'user' && <CheckCircle2 size={20} className="text-[#06b6d4]" />}
                </label>

                <label className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group/opt ${
                    formData.role === 'admin' 
                    ? 'border-slate-800 bg-slate-50' 
                    : 'border-slate-100 hover:border-slate-300'
                  }`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="admin" 
                    className="hidden" 
                    checked={formData.role === 'admin'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${formData.role === 'admin' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                     <Shield size={20} />
                  </div>
                  <div className="flex-1">
                    <span className={`block text-sm font-bold ${formData.role === 'admin' ? 'text-slate-900' : 'text-slate-600'}`}>Administrator</span>
                    <span className="block text-[10px] text-slate-400 font-medium">Kontrol sistem penuh</span>
                  </div>
                  {formData.role === 'admin' && <CheckCircle2 size={20} className="text-slate-800" />}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl ${oceanGradient} text-white font-bold text-lg shadow-lg shadow-[#06b6d4]/30 hover:shadow-[#06b6d4]/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <Save size={20} />
                  Simpan Data User
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </AdminLayout>
  );
}