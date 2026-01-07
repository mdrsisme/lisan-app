"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  Search, Filter, ChevronLeft, ChevronRight, 
  ArrowUpDown, ShieldCheck, Crown, Eye, 
  LayoutGrid, Users, List
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminLayout from "@/components/layouts/AdminLayout";

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

// PERBAIKAN 1: Sesuaikan Type Meta dengan JSON response backend
type Meta = {
  page: number;        // Sebelumnya current_page
  limit: number;       // Sebelumnya per_page (Penyebab Error)
  total_data: number;
  total_page: number;  // Sebelumnya total_pages
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const hoverColor = "hover:text-[#06b6d4]";
  const gradientBg = "bg-gradient-to-tl from-[#3b82f6] via-[#06b6d4] to-[#10b981]";
  const focusRing = "focus:ring-[#06b6d4]/20";

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
      
      if (res.success && res.data) {
        // PERBAIKAN 2: Mapping data yang lebih aman
        // Mengambil users dari res.data.users
        setUsers(res.data.users || []);
        // Mengambil meta dari res.data.pagination
        setMeta(res.data.pagination || null);
      } else {
        setUsers([]);
        setMeta(null);
      }
    } catch (error) {
      console.error("Gagal mengambil data user");
      setUsers([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
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
    // AdminLayout dihapus jika di layout.tsx parent sudah ada, 
    // tapi jika structure folder butuh, biarkan saja.
    // Jika double sidebar, hapus <AdminLayout> di sini.
    <> 
      {loading && <LoadingSpinner />}

      <div className="w-full space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <PageHeader
          theme={themeColors.ocean}
          title="Database"
          highlight="Pengguna"
          description="Kelola seluruh data pengguna yang terdaftar."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengguna", href: "/admin/users", icon: Users },
            { label: "Database", active: true, icon: List },
          ]}
        />

        {/* Filter Section */}
        <div className="bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 items-center group/search focus-within:border-[#06b6d4]/50 transition-colors duration-300">
          <div className="relative flex-1 w-full group">
            <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#06b6d4] transition-colors`}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cari user via nama, email, atau username..." 
              className={`w-full h-14 pl-14 pr-4 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 ${focusRing} transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400`}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-48 group">
               <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none group-hover:text-[#06b6d4] transition-colors`}>
                  <Filter size={16} />
               </div>
               <select 
                 className={`w-full h-14 pl-11 pr-10 rounded-2xl bg-white border border-slate-200 hover:border-[#06b6d4]/50 focus:border-[#06b6d4] focus:ring-4 ${focusRing} outline-none font-bold text-slate-600 appearance-none cursor-pointer transition-all`}
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

        {/* Table Section */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th onClick={() => handleSort('full_name')} className={`p-6 pl-8 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer ${hoverColor} transition-colors select-none group`}>
                    <div className="flex items-center gap-2">User Identity <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Role & Badge</th>
                  <th onClick={() => handleSort('level')} className={`p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer ${hoverColor} transition-colors select-none group`}>
                    <div className="flex items-center gap-2">Stats <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th onClick={() => handleSort('created_at')} className={`p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer ${hoverColor} transition-colors select-none group`}>
                    <div className="flex items-center gap-2">Joined Date <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th className="p-6 pr-8 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Manage</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-50">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="group hover:bg-[#ecfeff]/50 transition-all duration-200">
                      <td className="p-6 pl-8">
                        <div className="flex items-center gap-5">
                          <div className="relative shrink-0">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-[1rem] object-cover shadow-sm ring-4 ring-transparent group-hover:ring-white transition-all" />
                            ) : (
                              <div className={`w-12 h-12 rounded-[1rem] ${gradientBg} flex items-center justify-center text-white font-black text-lg shadow-md border border-white group-hover:scale-105 transition-transform duration-300`}>
                                {user.full_name?.charAt(0) || user.username?.charAt(0) || "?"}
                              </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-white rounded-full ${user.is_verified ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          </div>
                          <div>
                            <p className={`font-bold text-slate-800 text-[15px] group-hover:text-[#06b6d4] transition-colors`}>
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
                               <span className="text-[#06b6d4]">{user.xp} XP</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${gradientBg} rounded-full`} 
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
                            <button className="p-2.5 rounded-xl text-slate-500 hover:text-[#06b6d4] hover:bg-[#ecfeff] transition-all" title="Detail Profil">
                              <Eye size={18} />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  !loading && (
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
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                {/* PERBAIKAN 3: Gunakan meta.page dan meta.total_page sesuai Type Meta baru */}
                Page {meta.page} / {meta.total_page}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={meta.page <= 1}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-extrabold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <ChevronLeft size={14} /> Sebelumnya
                </button>
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={meta.page >= meta.total_page}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-extrabold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2 active:scale-95"
                >
                  Berikutnya <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}