"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import Notification from "@/components/ui/Notification"; // Pastikan path import sesuai
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Mail, Lock, Shield, 
  Eye, EyeOff, Save, Loader2, 
  RefreshCw, KeyRound, Type, ShieldCheck, 
  ArrowRight, LayoutGrid, Users, UserPlus 
} from "lucide-react";
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
    role: "user" // default
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
    // Reset notifikasi sebentar agar animasi bisa re-trigger jika tipe sama
    setNotification({ type: null, message: "" });

    try {
      const res = await api.post("/users", formData);

      if (res.success) {
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

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          theme="rose"
          title="Registrasi"
          highlight="Pengguna Baru"
          description="Tambahkan anggota baru secara manual ke dalam ekosistem."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Komunitas", href: "/admin/users", icon: Users },
            { label: "Buat Pengguna", active: true, icon: UserPlus },
          ]}
        />
        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                    <User size={22} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Informasi Dasar</h3>
                    <p className="text-slate-400 text-xs">Identitas utama pengguna</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                      <Type size={18} />
                    </div>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Budi Santoso"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                      <span className="text-sm font-black">@</span>
                    </div>
                    <input 
                      type="text" 
                      required
                      placeholder="budisantoso"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="email@domain.com"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                    <Lock size={22} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Keamanan</h3>
                    <p className="text-slate-400 text-xs">Kredensial akses akun</p>
                </div>
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center ml-1 mb-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
                  <button 
                    type="button" 
                    onClick={generatePassword}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={12} /> Generate Random
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                    <KeyRound size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Minimal 8 karakter..."
                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-200/50 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                    <div className="h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${formData.password.length > 8 ? 'w-full bg-emerald-500' : formData.password.length > 0 ? 'w-1/2 bg-amber-400' : 'w-0'}`} />
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide bg-black/20 px-2 py-1 rounded-lg backdrop-blur-md">Admin Tool</span>
                </div>
                
                <h3 className="font-bold text-lg leading-tight mb-2">Verifikasi Manual?</h3>
                <p className="text-emerald-50 text-xs mb-5 leading-relaxed font-medium">
                  Gunakan fitur ini jika pengguna terkendala menerima OTP saat pendaftaran mandiri.
                </p>

                <Link 
                  href="/admin/users/create/verify"
                  className="w-full py-3 rounded-xl bg-white text-emerald-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
                >
                  Buka Tools <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                    <Shield size={22} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Hak Akses</h3>
                    <p className="text-slate-400 text-xs">Level otorisasi pengguna</p>
                </div>
              </div>

              <div className="space-y-3">
                <label 
                  className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.role === 'user' 
                    ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/20' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    value="user" 
                    className="hidden" 
                    checked={formData.role === 'user'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${formData.role === 'user' ? 'border-rose-500' : 'border-slate-300'}`}>
                    {formData.role === 'user' && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-in zoom-in" />}
                  </div>
                  <div>
                    <span className={`block text-sm font-bold ${formData.role === 'user' ? 'text-rose-900' : 'text-slate-700'}`}>User Biasa</span>
                    <span className="block text-xs text-slate-500">Akses member standard</span>
                  </div>
                </label>

                <label 
                  className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.role === 'admin' 
                    ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800/20' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    value="admin" 
                    className="hidden" 
                    checked={formData.role === 'admin'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${formData.role === 'admin' ? 'border-slate-800' : 'border-slate-300'}`}>
                    {formData.role === 'admin' && <div className="w-2.5 h-2.5 rounded-full bg-slate-800 animate-in zoom-in" />}
                  </div>
                  <div>
                    <span className={`block text-sm font-bold ${formData.role === 'admin' ? 'text-slate-900' : 'text-slate-700'}`}>Administrator</span>
                    <span className="block text-xs text-slate-500">Full Access Dashboard</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <Save size={20} />
                    Simpan Data
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}