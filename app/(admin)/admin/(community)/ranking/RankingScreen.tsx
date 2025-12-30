"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { LayoutGrid, Trophy, Crown, Medal, Search, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import Image from "next/image";

export default function RankingScreen() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all_time");

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/rankings?period=${period}&limit=50`);
      if (res.success) {
        setRankings(res.data.leaderboard);
      }
    } catch (error) {
      console.error("Failed to fetch rankings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [period]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-100 to-amber-100 border-amber-200 text-amber-700";
    if (rank === 2) return "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-700";
    if (rank === 3) return "bg-gradient-to-br from-orange-100 to-rose-100 border-orange-200 text-orange-800";
    return "bg-white border-slate-100 text-slate-600 hover:bg-slate-50";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={24} className="text-amber-500 fill-amber-500 animate-bounce" />;
    if (rank === 2) return <Medal size={24} className="text-slate-400 fill-slate-300" />;
    if (rank === 3) return <Medal size={24} className="text-orange-400 fill-orange-300" />;
    return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        
        <PageHeader
          theme={themeColors.ocean}
          title="Global Ranking"
          highlight="Leaderboard"
          description="Peringkat pengguna berdasarkan perolehan XP."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Ranking", active: true, icon: Trophy },
          ]}
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                {['all_time', 'monthly', 'weekly'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                            period === p 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {p.replace('_', ' ')}
                    </button>
                ))}
            </div>
            <button 
                onClick={fetchRankings}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {rankings.slice(0, 3).map((user, idx) => (
                <div key={user.username} className={`relative flex flex-col items-center p-6 rounded-[2rem] border-2 shadow-lg ${getRankStyle(idx + 1)}`}>
                    <div className="absolute -top-5">
                        {getRankIcon(idx + 1)}
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 mt-2 relative bg-white">
                        {user.avatar_url ? (
                            <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-2xl">
                                {user.full_name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg font-black text-slate-800">{user.full_name}</h3>
                    <p className="text-xs font-bold opacity-70 mb-4">@{user.username}</p>
                    <div className="flex items-center gap-4 text-sm font-bold bg-white/60 px-4 py-2 rounded-full">
                        <span className="text-indigo-600">{user.xp.toLocaleString()} XP</span>
                        <span className="w-px h-3 bg-slate-300"></span>
                        <span className="text-slate-600">Lvl {user.level}</span>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pengguna</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Level</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Total XP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-medium">Memuat data...</td>
                            </tr>
                        ) : rankings.slice(3).map((user) => (
                            <tr key={user.username} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                        {user.rank}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                                            {user.avatar_url ? (
                                                <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                                    {user.full_name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{user.full_name}</p>
                                            <p className="text-xs text-slate-400">@{user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                        {user.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-indigo-600">
                                    {user.xp.toLocaleString()} XP
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!loading && rankings.length === 0 && (
                <div className="p-12 text-center text-slate-400 font-medium">Belum ada data ranking.</div>
            )}
        </div>

      </div>
    </AdminLayout>
  );
}