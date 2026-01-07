"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Trophy, Medal, Crown, Sparkles, Zap, User as UserIcon
} from "lucide-react";
import { api } from "@/lib/api";
import UserLayout from "@/components/layouts/UserLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner"; 

interface LeaderboardUser {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  xp: number;
  rank: number;
  is_premium?: boolean;
}

export default function LeaderboardScreen() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    // Ambil ID user dari localStorage untuk highlight posisi sendiri
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            const userData = JSON.parse(userStr);
            setMyId(userData.id);
        } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [myId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // Endpoint public/user untuk leaderboard
      const response = await api.get(`/gamification/leaderboard?limit=50`);

      if (response.success) {
        // Asumsi response.data adalah array user
        // Kita map ulang untuk memastikan ada rank jika backend tidak mengirimnya
        const data = (response.data || []).map((u: any, idx: number) => ({
            ...u,
            rank: idx + 1, // Generate rank berdasarkan urutan array
            // Pastikan mapping field sesuai response backend (xp vs xp_snapshot)
            xp: u.xp || u.total_xp || 0 
        }));

        setUsers(data);

        // Cari data diri sendiri untuk sticky bar bawah
        if (myId) {
            const me = data.find((u: LeaderboardUser) => u.id === myId);
            if (me) setCurrentUser(me);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const Avatar = ({ url, name, size = "md", border = "" }: { url: string | null, name: string, size?: "sm"|"md"|"lg"|"xl"|"2xl", border?: string }) => {
    const sizeClass = {
        sm: "w-10 h-10 text-xs",
        md: "w-14 h-14 text-base",
        lg: "w-20 h-20 text-xl",
        xl: "w-24 h-24 text-2xl",
        "2xl": "w-28 h-28 text-3xl md:w-32 md:h-32"
    };

    return (
      <div className={`relative rounded-2xl overflow-hidden shrink-0 ${sizeClass[size]} ${border} bg-slate-100 shadow-lg flex items-center justify-center transform transition-transform`}>
        {url ? (
          <Image src={url} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold">
            {name ? name.charAt(0).toUpperCase() : <UserIcon size={24} />}
          </div>
        )}
      </div>
    );
  };

  const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Crown size={24} className="fill-amber-100 text-amber-100 animate-pulse" />;
    if (rank === 2) return <Medal size={24} className="fill-slate-200 text-slate-200" />;
    if (rank === 3) return <Medal size={24} className="fill-orange-200 text-orange-200" />;
    return <span className="font-black text-lg text-white">#{rank}</span>;
  };

  const EmptyPodium = ({ rank, heightClass }: { rank: number, heightClass: string }) => (
    <div className={`flex flex-col items-center w-1/3 max-w-[140px] opacity-30 grayscale ${rank === 1 ? 'order-2' : rank === 2 ? 'order-1' : 'order-3'}`}>
        <div className="relative mb-4">
            <div className={`rounded-2xl bg-slate-100 border-4 border-dashed border-slate-300 flex items-center justify-center ${rank === 1 ? 'w-28 h-28' : 'w-20 h-20'}`}>
                <UserIcon className="text-slate-300" size={rank === 1 ? 40 : 32} />
            </div>
        </div>
        <div className={`w-full ${heightClass} bg-slate-100/50 rounded-t-3xl border-t-2 border-slate-200 border-dashed relative`}></div>
    </div>
  );

  return (
    <UserLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#F8FAFC]">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="min-h-screen pb-40 pt-8">
        <main className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
                <Trophy size={12} /> Hall of Fame
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Leaderboard</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-md mx-auto">
                Bersaing dengan pelajar lain dan buktikan konsistensimu dalam belajar bahasa isyarat.
            </p>
          </div>

          {loading ? (
             <div className="flex justify-center py-24 min-h-[400px] items-center">
                <LoadingSpinner />
             </div>
          ) : (
            <>
              {/* --- PODIUM SECTION (TOP 3) --- */}
              <div className="relative flex justify-center items-end gap-3 md:gap-6 mb-12 px-2 min-h-[350px]">
                
                {/* JUARA 2 */}
                {users[1] ? (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100 z-10 w-1/3 max-w-[160px] order-1">
                    <div className="relative mb-3 group">
                        <Avatar url={users[1].avatar_url} name={users[1].full_name} size="lg" border="border-4 border-slate-300 ring-4 ring-slate-50 rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg border-2 border-white shadow-lg">
                            #2
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center mb-2 text-center">
                        <p className="font-bold text-slate-700 text-sm truncate w-full px-2">{users[1].full_name.split(' ')[0]}</p>
                        <p className="text-[10px] font-bold text-slate-400 bg-white/50 px-2 rounded-md">{users[1].xp.toLocaleString()} XP</p>
                    </div>
                    <div className="w-full h-32 mt-1 bg-gradient-to-b from-slate-200 via-slate-100 to-transparent rounded-t-[2rem] border-t border-white shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/60 to-transparent" />
                    </div>
                  </div>
                ) : <EmptyPodium rank={2} heightClass="h-32" />}

                {/* JUARA 1 */}
                {users[0] ? (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-20 w-1/3 max-w-[180px] -mx-2 pb-2 order-2">
                    <div className="relative mb-5 group">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                            <Crown size={36} className="text-amber-400 fill-amber-400 drop-shadow-lg" />
                        </div>
                        <Avatar url={users[0].avatar_url} name={users[0].full_name} size="2xl" border="border-4 border-amber-400 ring-4 ring-amber-100 shadow-xl" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-black px-4 py-1 rounded-lg border-2 border-white shadow-lg whitespace-nowrap">
                            #1 JUARA
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center mb-2 text-center">
                        <p className="font-black text-slate-800 text-base truncate w-full px-2">{users[0].full_name}</p>
                        <span className="text-amber-600 bg-amber-50 text-[10px] font-black flex items-center gap-1 px-2 py-0.5 rounded-md border border-amber-100 mt-1">
                            <Zap size={10} fill="currentColor" /> {users[0].xp.toLocaleString()} XP
                        </span>
                    </div>
                    <div className="w-full h-44 mt-1 bg-gradient-to-b from-amber-200 via-amber-100 to-transparent rounded-t-[2.5rem] border-t border-white shadow-lg shadow-amber-500/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/40 animate-[shimmer_2s_infinite] skew-y-12" />
                    </div>
                  </div>
                ) : <EmptyPodium rank={1} heightClass="h-44" />}

                {/* JUARA 3 */}
                {users[2] ? (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200 z-10 w-1/3 max-w-[160px] order-3">
                    <div className="relative mb-3 group">
                        <Avatar url={users[2].avatar_url} name={users[2].full_name} size="lg" border="border-4 border-orange-300 ring-4 ring-orange-50 -rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs font-black px-2.5 py-0.5 rounded-lg border-2 border-white shadow-lg">
                            #3
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center mb-2 text-center">
                        <p className="font-bold text-slate-700 text-sm truncate w-full px-2">{users[2].full_name.split(' ')[0]}</p>
                        <p className="text-[10px] font-bold text-slate-400 bg-white/50 px-2 rounded-md">{users[2].xp.toLocaleString()} XP</p>
                    </div>
                    <div className="w-full h-24 mt-1 bg-gradient-to-b from-orange-100 via-orange-50 to-transparent rounded-t-[2rem] border-t border-white shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/60 to-transparent" />
                    </div>
                  </div>
                ) : <EmptyPodium rank={3} heightClass="h-24" />}
              </div>

              {/* --- LIST SECTION (RANK 4+) --- */}
              <div className="space-y-3 relative z-10 pb-20">
                 {users.slice(3).map((user, index) => (
                   <div 
                     key={`${user.id}-${index}`} 
                     className={`flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 group ${
                        user.id === myId 
                        ? 'bg-indigo-50/90 border-indigo-200 shadow-xl shadow-indigo-200/20 scale-[1.01] z-20' 
                        : 'bg-white/70 border-white/60 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5'
                     }`}
                   >
                      <div className={`w-8 text-center font-black text-sm ${user.id === myId ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {user.rank}
                      </div>
                      
                      <Avatar url={user.avatar_url} name={user.full_name} size="sm" />
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                         <div className="flex items-center gap-2">
                             <p className={`font-bold truncate text-sm md:text-base ${user.id === myId ? 'text-indigo-900' : 'text-slate-700'}`}>
                                {user.full_name}
                             </p>
                             {user.is_premium && <Sparkles size={12} className="text-amber-500 fill-amber-500" />}
                         </div>
                         <p className="text-[10px] text-slate-400 truncate">@{user.username || 'user'}</p>
                      </div>

                      <div className={`text-right flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                          user.id === myId
                          ? 'bg-white border-indigo-100 shadow-sm'
                          : 'bg-slate-50 border-slate-100 group-hover:border-indigo-50'
                      }`}>
                         <Zap size={12} className={user.id === myId ? 'text-indigo-600' : 'text-indigo-400'} fill="currentColor" />
                         <span className={`font-black text-sm ${user.id === myId ? 'text-indigo-700' : 'text-slate-600'}`}>
                           {user.xp.toLocaleString()}
                         </span>
                      </div>
                   </div>
                 ))}
                 
                 {users.length === 0 && (
                     <div className="text-center py-16 text-slate-400 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                         <Trophy size={40} className="mx-auto mb-4 opacity-30" />
                         <p className="text-lg font-medium">Belum ada data ranking.</p>
                     </div>
                 )}
              </div>
            </>
          )}
        </main>

        {/* --- STICKY USER BAR (YOUR RANK) --- */}
        {currentUser && !loading && (
            <div className="fixed bottom-6 left-0 right-0 px-4 z-40 flex justify-center animate-in slide-in-from-bottom-20 duration-700">
                <div className="w-full max-w-xl bg-[#1E293B] text-white rounded-2xl p-3 shadow-2xl shadow-indigo-900/40 border border-slate-700 flex items-center justify-between gap-4 relative overflow-hidden group">
                    
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-[40px] -mr-10 -mt-10" />
                    
                    <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700 font-black text-sm text-slate-300 border border-slate-600">
                            #{currentUser.rank}
                        </div>
                        <Avatar url={currentUser.avatar_url} name={currentUser.full_name} size="sm" border="border-2 border-slate-500" />
                        <div className="flex flex-col min-w-0">
                             <p className="font-bold text-sm text-white truncate">Kamu</p>
                             <p className="text-[10px] text-slate-400 font-medium truncate">Terus tingkatkan XP!</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10 shrink-0 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700">
                         <div className="p-1 rounded-full bg-amber-500/20 text-amber-400">
                            <Zap size={14} fill="currentColor" />
                         </div>
                         <span className="font-black text-sm text-white">{currentUser.xp.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </UserLayout>
  );
}