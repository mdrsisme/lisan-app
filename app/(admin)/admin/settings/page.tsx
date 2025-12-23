"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Save,
  Loader2,
  Shield,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Notification from "@/components/ui/Notification";

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
    if (!passwords.oldPassword || !passwords.newPassword) {
      setNotification({
        type: "error",
        message: "Semua kolom sandi wajib diisi.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.put("/users/password", passwords);
      if (res.success) {
        setNotification({
          type: "success",
          message: "Kata sandi berhasil diperbarui.",
        });
        setPasswords({ oldPassword: "", newPassword: "" });
      } else {
        throw new Error(res.message);
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
    setIsLoading(true);
    try {
      await api.delete("/users/account");
      localStorage.clear();
      router.push("/login");
    } catch {
      setNotification({
        type: "error",
        message: "Gagal menghapus akun.",
      });
      setIsDeleteOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f6f8ff] overflow-hidden flex items-center justify-center">

      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: null, message: "" })}
      />

      {/* Dreamy Orbs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-indigo-400/30 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] -right-40 w-[700px] h-[700px] bg-fuchsia-400/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-30%] left-[20%] w-[600px] h-[600px] bg-cyan-400/25 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.35] mix-blend-soft-light" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-5xl h-[85vh] bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.8rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] p-10 flex flex-col">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800">Pengaturan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Keamanan akun{" "}
            <span className="font-semibold text-indigo-600">
              {user?.full_name}
            </span>
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

          {/* Sidebar */}
          <aside className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 p-6 flex flex-col shadow-lg">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-lg">
              <Lock size={18} />
              Keamanan
            </div>

            <div className="mt-auto p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex gap-3">
                <Shield className="text-blue-600 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-blue-900">
                    Perlindungan Aktif
                  </p>
                  <p className="text-[11px] text-blue-700 mt-1 leading-relaxed">
                    Sistem keamanan terenkripsi & terlindungi
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex flex-col gap-10 justify-center">

            {/* Change Password */}
            <section className="bg-white/60 border border-white/60 rounded-3xl p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Lock size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Ubah Kata Sandi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Demi keamanan, gunakan sandi kuat
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    Sandi Lama
                  </label>
                  <input
                    type="password"
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, oldPassword: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    Sandi Baru
                  </label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-indigo-600 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    Simpan
                  </button>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="relative overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-8 shadow-lg">

              <div className="absolute -top-24 -right-24 w-[300px] h-[300px] bg-red-300/30 rounded-full blur-[100px]" />

              <div className="relative z-10 flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Trash2 size={24} />
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-bold text-red-600">
                    Zona Berbahaya
                  </h4>
                  <p className="text-sm text-red-500 mt-1 max-w-md">
                    Menghapus akun akan menghilangkan seluruh data secara
                    permanen dan tidak dapat dipulihkan.
                  </p>
                </div>

                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="shrink-0 px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                >
                  Hapus Akun
                </button>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsDeleteOpen(false)}
          />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-white text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Hapus Akun?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
