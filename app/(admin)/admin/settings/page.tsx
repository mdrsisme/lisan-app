"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Save,
  Loader2,
  Shield,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  LayoutGrid,
  Settings
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Notification from "@/components/ui/Notification";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChangePassword = async () => {
    if (!user?.id) return;
    
    if (!passwords.newPassword) {
      setNotification({
        type: "error",
        message: "Password baru wajib diisi.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.put("/users/me", {
        password: passwords.newPassword
      });

      if (res.success || res.data) {
        setNotification({
          type: "success",
          message: "Kata sandi berhasil diperbarui.",
        });
        setPasswords({ oldPassword: "", newPassword: "" });
      } else {
        throw new Error(res.message || "Gagal update password");
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Gagal memperbarui sandi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: user.id })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.clear();
        router.push("/login");
      } else {
        throw new Error(data.message || "Gagal menghapus akun");
      }

    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "Gagal menghapus akun.",
      });
      setIsDeleteOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f6f8ff] overflow-hidden flex items-center justify-center p-6">

      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: null, message: "" })}
      />

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-indigo-400/30 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-40 w-[700px] h-[700px] bg-fuchsia-400/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-30%] left-[20%] w-[600px] h-[600px] bg-cyan-400/25 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.35] mix-blend-soft-light" />
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.8rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] p-8 md:p-12 flex flex-col animate-in fade-in zoom-in-95 duration-500">

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <Link href="/admin/dashboard" className="p-2 rounded-xl bg-white/50 hover:bg-white text-slate-500 hover:text-indigo-600 transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-black text-slate-800">Pengaturan</h1>
            </div>
            <p className="text-sm text-slate-500 ml-1">
              Kelola preferensi dan keamanan akun{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                {user?.full_name}
              </span>
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

          <aside className="h-fit bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 p-6 flex flex-col gap-2 shadow-lg">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              <Lock size={18} />
              Keamanan
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-blue-50/80 border border-blue-100/50">
              <div className="flex gap-3">
                <Shield className="text-blue-600 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-blue-900">
                    Status Akun
                  </p>
                  <p className="text-[11px] text-blue-700 mt-1 leading-relaxed">
                    Akun Anda terlindungi dengan enkripsi standar. Jangan bagikan password kepada siapapun.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex flex-col gap-8">
            <section className="bg-white/60 border border-white/60 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Ubah Kata Sandi
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pastikan password baru Anda kuat dan unik.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm font-bold text-slate-700 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 mt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-gradient-to-br from-white to-red-50 p-8 shadow-sm group">

              <div className="absolute -top-24 -right-24 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-red-500/10 transition-colors" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center shrink-0 border border-red-200">
                    <Trash2 size={24} />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-red-600">
                      Zona Berbahaya
                    </h4>
                    <p className="text-sm text-red-400/80 mt-1 max-w-md leading-relaxed">
                      Menghapus akun akan menghilangkan seluruh data profil, riwayat, dan akses Anda secara <strong>permanen</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="shrink-0 px-6 py-3 rounded-2xl bg-white border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm hover:shadow-red-500/20 transition-all active:scale-95"
                >
                  Hapus Akun Saya
                </button>
              </div>
            </section>

          </main>
        </div>
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDeleteOpen(false)}
          />
          <div className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl shadow-red-900/20 border border-white animate-in zoom-in-95 duration-300">
            
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-50 flex items-center justify-center border border-red-100 shadow-inner">
              <AlertTriangle className="text-red-500" size={36} />
            </div>
            
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 mb-2">
                Hapus Akun?
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                Tindakan ini bersifat <strong>permanen</strong> dan tidak dapat dibatalkan. Apakah Anda yakin?
                </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold text-base hover:bg-red-600 shadow-lg shadow-red-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Ya, Hapus Permanen"
                )}
              </button>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="w-full h-14 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold text-base hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}