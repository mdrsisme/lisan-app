"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  Search, Filter, ChevronLeft, ChevronRight, 
  ArrowUpDown, ShieldCheck, Sparkles, 
  Download, Trash2, Eye, LayoutGrid, Users, List,
  MoreHorizontal, Crown, CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PageHeader from "@/components/ui/PageHeader";

type User = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  is_verified: boolean;
  is_premium: boolean;
  level: number;
  xp: number;
  created_at: string;
};

type Meta = {
  total_data: number;
  current_page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500); 
    return () => clearTimeout(timer);
  }, [search, role, sortBy, order, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy,
        order,
      });

      if (search) queryParams.append("search", search);
      if (role) queryParams.append("role", role);

      const res = await api.get(`/users?${queryParams.toString()}`);
      if (res.success) {
        setUsers(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <PageHeader
          theme="rose"
          title="Database"
          highlight="Pengguna"
          description="Kelola seluruh data pengguna yang terdaftar."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Komunitas", href: "/admin/users", icon: Users },
            { label: "Database", active: true, icon: List },
          ]}
        />

        <div className="bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 items-center">
          <div className="relative flex-1 w-full group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cari user via nama, email, atau username..." 
              className="w-full h-14 pl-14 pr-4 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-48 group">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none group-hover:text-rose-500 transition-colors">
                  <Filter size={16} />
               </div>
               <select 
                 className="w-full h-14 pl-11 pr-10 rounded-2xl bg-white border border-slate-200 hover:border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none font-bold text-slate-600 appearance-none cursor-pointer transition-all"
                 value={role}
                 onChange={(e) => { setRole(e.target.value); setPage(1); }}
               >
                 <option value="">Semua Role</option>
                 <option value="user">User Biasa</option>
                 <option value="admin">Administrator</option>
               </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden relative">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th onClick={() => handleSort('full_name')} className="p-6 pl-8 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-rose-500 transition-colors select-none group">
                    <div className="flex items-center gap-2">User Identity <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Role & Badge</th>
                  <th onClick={() => handleSort('level')} className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-rose-500 transition-colors select-none group">
                    <div className="flex items-center gap-2">Stats <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th onClick={() => handleSort('created_at')} className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-rose-500 transition-colors select-none group">
                    <div className="flex items-center gap-2">Joined Date <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th className="p-6 pr-8 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Manage</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-6 pl-8"><div className="flex gap-4"><div className="w-12 h-12 bg-slate-100 rounded-2xl" /><div className="space-y-2"><div className="h-4 w-32 bg-slate-100 rounded-full" /><div className="h-3 w-20 bg-slate-100 rounded-full" /></div></div></td>
                      <td className="p-6"><div className="h-8 w-24 bg-slate-100 rounded-full" /></td>
                      <td className="p-6"><div className="h-4 w-full bg-slate-100 rounded-full" /></td>
                      <td className="p-6"><div className="h-4 w-28 bg-slate-100 rounded-full" /></td>
                      <td className="p-6 pr-8 text-right"><div className="h-8 w-8 bg-slate-100 rounded-full inline-block" /></td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                      <td className="p-6 pl-8">
                        <div className="flex items-center gap-5">
                          <div className="relative shrink-0">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-[1rem] object-cover shadow-sm ring-4 ring-transparent group-hover:ring-white transition-all" />
                            ) : (
                              <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-rose-100 to-indigo-100 flex items-center justify-center text-rose-600 font-black text-lg shadow-sm border border-white">
                                {user.full_name?.charAt(0) || user.username?.charAt(0) || "?"}
                              </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-white rounded-full ${user.is_verified ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[15px] group-hover:text-rose-600 transition-colors">
                              {user.full_name || "Tanpa Nama"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                              <span className="text-slate-400">@{user.username}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            user.role === 'admin' 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20' 
                            : 'bg-white text-slate-500 border-slate-200'
                          }`}>
                            {user.role}
                          </span>
                          
                          <div className="flex gap-1.5 mt-1">
                            {user.is_verified && (
                               <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold" title="Verified Account">
                                  <ShieldCheck size={12} /> Verified
                               </span>
                            )}
                            {user.is_premium && (
                               <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border border-amber-100 text-[10px] font-bold" title="Premium Member">
                                  <Crown size={12} /> Pro
                               </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                          <div className="w-full max-w-[140px]">
                             <div className="flex justify-between text-xs font-bold mb-2 text-slate-600">
                               <span>Lvl. {user.level}</span>
                               <span className="text-rose-500">{user.xp} XP</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-rose-400 to-indigo-500 rounded-full" 
                                  style={{ width: `${Math.min((user.xp / (user.level * 100)) * 100, 100)}%` }}
                                />
                             </div>
                          </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">
                                {format(new Date(user.created_at), "dd MMM yyyy", { locale: id })}
                            </span>
                            <span className="text-xs text-slate-400 font-medium mt-0.5">
                                {format(new Date(user.created_at), "HH:mm")} WIB
                            </span>
                        </div>
                      </td>

                      <td className="p-6 pr-8 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/users/${user.id}`}>
                            <button className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="Detail Profil">
                              <Eye size={18} />
                            </button>
                          </Link>
                          
                          <button className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all" title="Hapus User">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                           <Search size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Tidak ada hasil ditemukan</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                          Kami tidak dapat menemukan pengguna dengan kata kunci atau filter tersebut. Coba ubah pencarian Anda.
                        </p>
                        <button 
                          onClick={() => { setSearch(""); setRole(""); }}
                          className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:-translate-y-1"
                        >
                          Reset Filter
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                Page {meta.current_page} / {meta.total_pages}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={!meta.has_prev}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-extrabold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <ChevronLeft size={14} /> Sebelumnya
                </button>
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={!meta.has_next}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-extrabold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2 active:scale-95"
                >
                  Berikutnya <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}