"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { LayoutGrid, Trophy, Crown, Medal, RefreshCw, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Import Type sesuai permintaan
import type { LeaderboardEntry } from "@/types/leaderboard"; 

export default function LeaderboardScreen() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    if (leaderboardData.length === 0) setLoading(true);
    else setIsRefreshing(true);

    try {
      // Endpoint sesuai request
      const res = await api.get(`/gamification/leaderboard?limit=50`);
      
      if (res.success) {
        // Backend mengembalikan array LeaderboardEntry langsung di res.data
        // Kita tambahkan properti 'rank' manual berdasarkan index jika backend belum menyediakan
        const mappedData = (res.data || []).map((entry: LeaderboardEntry, index: number) => ({
            ...entry,
            rank: index + 1
        }));
        setLeaderboardData(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setIsRefreshing(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const EmptyPodium = ({ rank, heightClass }: { rank: number, heightClass: string }) => (
    <div className={`relative flex flex-col items-center justify-center p-4 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 ${heightClass} order-${rank === 2 ? 1 : 3} md:order-${rank === 2 ? 1 : 3}`}>
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <UserIcon className="text-slate-300" size={24} />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posisi #{rank}</span>
        <span className="text-[10px] text-slate-300 mt-1">Belum terisi</span>
    </div>
  );

  // Komponen Card untuk Podium (Top 3)
  const RankCard = ({ entry, rank }: { entry: LeaderboardEntry, rank: number }) => {
    const isFirst = rank === 1;
    const orderClass = isFirst ? "order-1 md:order-2" : rank === 2 ? "order-2 md:order-1" : "order-3 md:order-3";
    const scaleClass = isFirst ? "scale-105 z-10" : "scale-100 z-0";
    
    // Data user diambil dari nested object 'user'
    const userData = entry.user;
    
    let bgStyle = "bg-white border-slate-100";
    let icon = null;

    if (rank === 1) {
        bgStyle = "bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200 text-amber-800 shadow-xl shadow-amber-500/10";
        icon = <Crown size={28} className="text-amber-500 fill-amber-500 animate-bounce" />;
    } else if (rank === 2) {
        bgStyle = "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 text-slate-700 shadow-lg shadow-slate-500/10";
        icon = <Medal size={24} className="text-slate-400 fill-slate-300" />;
    } else {
        bgStyle = "bg-gradient-to-br from-orange-50 to-rose-50 border-orange-200 text-orange-800 shadow-lg shadow-orange-500/10";
        icon = <Medal size={24} className="text-orange-400 fill-orange-300" />;
    }

    return (
        <div className={`relative flex flex-col items-center p-6 rounded-[2rem] border-2 ${bgStyle} ${orderClass} ${scaleClass} transition-transform duration-300`}>
            <div className={`absolute ${isFirst ? '-top-7' : '-top-5'}`}>
                {icon}
            </div>

            <div className={`${isFirst ? 'w-20 h-20' : 'w-16 h-16'} rounded-[1.2rem] border-4 border-white shadow-md overflow-hidden mb-3 mt-2 relative bg-white ${isFirst ? '-rotate-3' : rank === 2 ? 'rotate-3' : '-rotate-2'}`}>
                {userData?.avatar_url ? (
                    <Image src={userData.avatar_url} alt={userData.username || 'User'} fill className="object-cover" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${rank === 1 ? 'bg-amber-100 text-amber-400' : 'bg-slate-200 text-slate-400'} font-bold text-xl`}>
                        {userData?.full_name?.charAt(0) || '?'}
                    </div>
                )}
            </div>

            <h3 className={`${isFirst ? 'text-lg' : 'text-base'} font-black text-center leading-tight mb-0.5 truncate w-full`}>
                {userData?.full_name || 'Tanpa Nama'}
            </h3>
            <p className="text-[10px] font-bold opacity-60 mb-3">@{userData?.username || 'user'}</p>
            
            <div className="flex items-center gap-2 text-xs font-bold bg-white/60 px-3 py-1 rounded-xl backdrop-blur-sm shadow-sm border border-white/50">
                {/* Menggunakan xp_snapshot sesuai interface */}
                <span>{entry.xp_snapshot?.toLocaleString() || 0} XP</span>
            </div>
        </div>
    );
  };

  return (
    <AdminLayout>
      {loading && <LoadingSpinner />}
      
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-20 px-4">
        
        <PageHeader
          theme={themeColors.ocean}
          title="Global Leaderboard"
          highlight="Top 50"
          description="Peringkat pengguna terbaik berdasarkan XP."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Leaderboard", active: true, icon: Trophy },
          ]}
        />

        {!loading && (
            <>
                {/* Podium Section (Top 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end pt-6 px-2 md:px-12">
                    {leaderboardData[1] ? (
                        <RankCard entry={leaderboardData[1]} rank={2} />
                    ) : (
                        <EmptyPodium rank={2} heightClass="h-48" />
                    )}
                    
                    {leaderboardData[0] ? (
                        <RankCard entry={leaderboardData[0]} rank={1} />
                    ) : (
                        <EmptyPodium rank={1} heightClass="h-56" />
                    )}

                    {leaderboardData[2] ? (
                        <RankCard entry={leaderboardData[2]} rank={3} />
                    ) : (
                        <EmptyPodium rank={3} heightClass="h-48" />
                    )}
                </div>

                {/* Table Section (Rank 4+) */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center w-16">#</th>
                                    <th className="px-4 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pengguna</th>
                                    <th className="px-4 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Level</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span>Total XP</span>
                                            <button 
                                                onClick={fetchLeaderboard}
                                                disabled={isRefreshing}
                                                className={`p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-indigo-600 transition-all ${isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                title="Refresh Data"
                                            >
                                                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {leaderboardData.slice(3).map((entry, index) => (
                                    <tr key={entry.id || index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 text-center">
                                            {/* Rank dihitung manual: index + 1 (basis 0) + 3 (karena 3 teratas sudah di podium) */}
                                            <span className="text-sm font-black text-slate-300">#{index + 4}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-100 shadow-sm">
                                                    {entry.user?.avatar_url ? (
                                                        <Image src={entry.user.avatar_url} alt={entry.user.username || 'User'} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs">
                                                            {entry.user?.full_name?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{entry.user?.full_name || 'Tanpa Nama'}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">@{entry.user?.username || 'user'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                                                {/* Menggunakan level_snapshot */}
                                                Lvl {entry.level_snapshot}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <span className="font-black text-slate-700 text-sm">
                                                {/* Menggunakan xp_snapshot */}
                                                {entry.xp_snapshot?.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {leaderboardData.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Trophy size={24} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Belum ada data leaderboard tersedia.</p>
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
    </AdminLayout>
  );
}