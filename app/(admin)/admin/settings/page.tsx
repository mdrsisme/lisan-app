"use client";

import { useState } from "react";
import { 
  User, Lock, Bell, Globe, Camera, Save, 
  ShieldCheck, Smartphone, Mail, Loader2 
} from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailNotif: true,
    pushNotif: false,
    maintenanceMode: false
  });

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
        activeTab === id 
          ? "bg-[#6B4FD3] text-white shadow-lg shadow-purple-500/25" 
          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto">

      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Pengaturan</h1>
        <p className="text-slate-400 text-sm">Kelola preferensi akun dan konfigurasi sistem LISAN.</p>
      </div>

      <div className="flex flex-wrap gap-3 pb-2 border-b border-white/5">
        <TabButton id="profile" label="Profil Saya" icon={User} />
        <TabButton id="security" label="Keamanan" icon={Lock} />
        <TabButton id="notifications" label="Notifikasi" icon={Bell} />
        <TabButton id="system" label="Sistem" icon={Globe} />
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/5 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6ECFF6]/10 blur-[80px] rounded-full pointer-events-none" />

        {activeTab === "profile" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#6B4FD3] to-[#F062C0] p-[3px]">
                   <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      <span className="text-3xl font-bold text-white">A</span>
                   </div>
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Foto Profil</h3>
                <p className="text-slate-400 text-sm mb-3">Format yang didukung: JPG, PNG. Maks 2MB.</p>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors">
                  Unggah Foto Baru
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Nama Lengkap</label>
                <input type="text" defaultValue="Admin LISAN" className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#6B4FD3] focus:ring-1 focus:ring-[#6B4FD3] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Username</label>
                <input type="text" defaultValue="admin_lisan" className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#6B4FD3] focus:ring-1 focus:ring-[#6B4FD3] outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-400">Email</label>
                <input type="email" defaultValue="admin@lisan.app" className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#6B4FD3] focus:ring-1 focus:ring-[#6B4FD3] outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-400">Bio Singkat</label>
                <textarea rows={3} defaultValue="Administrator sistem LISAN." className="w-full p-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#6B4FD3] focus:ring-1 focus:ring-[#6B4FD3] outline-none transition-all resize-none" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#6ECFF6]" />
                Ubah Kata Sandi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-black/20 border border-white/5">
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-400">Kata Sandi Saat Ini</label>
                   <input type="password" placeholder="••••••••" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#6B4FD3] outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-400">Kata Sandi Baru</label>
                   <input type="password" placeholder="••••••••" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#6B4FD3] outline-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5">
              <div className="max-w-md">
                <h4 className="text-white font-bold mb-1">Autentikasi Dua Faktor (2FA)</h4>
                <p className="text-slate-400 text-sm">Tambahkan lapisan keamanan ekstra dengan kode verifikasi via email.</p>
              </div>
              <button 
                onClick={() => toggleSwitch('twoFactor')}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${toggles.twoFactor ? 'bg-[#6ECFF6]' : 'bg-slate-700'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${toggles.twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Preferensi Notifikasi</h3>
            
            <div className="space-y-4">
              {[
                { key: 'emailNotif', label: 'Notifikasi Email', desc: 'Terima pembaruan penting via email.', icon: Mail },
                { key: 'pushNotif', label: 'Push Notification', desc: 'Notifikasi popup di browser dashboard.', icon: Smartphone }
              ].map((item: any) => (
                <div key={item.key} className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.label}</h4>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSwitch(item.key)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${toggles[item.key as keyof typeof toggles] ? 'bg-[#F062C0]' : 'bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${toggles[item.key as keyof typeof toggles] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "system" && (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-400">Bahasa Dashboard</label>
                   <select className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#6B4FD3] outline-none appearance-none cursor-pointer">
                      <option className="bg-slate-900">Bahasa Indonesia</option>
                      <option className="bg-slate-900">English (US)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-400">Zona Waktu</label>
                   <select className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#6B4FD3] outline-none appearance-none cursor-pointer">
                      <option className="bg-slate-900">(GMT+07:00) Jakarta, Bangkok</option>
                   </select>
                </div>
             </div>

             <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex justify-between items-center">
                <div>
                   <h4 className="text-red-400 font-bold mb-1">Mode Perbaikan (Maintenance)</h4>
                   <p className="text-red-300/60 text-xs max-w-sm">
                      Jika diaktifkan, hanya Admin yang bisa mengakses sistem. Pengguna lain akan melihat halaman Maintenance.
                   </p>
                </div>
                <button 
                  onClick={() => toggleSwitch('maintenanceMode')}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${toggles.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${toggles.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>
        )}
        <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#6B4FD3] to-[#F062C0] text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Simpan Perubahan
          </button>
        </div>

      </div>
    </div>
  );
}