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
      const response = await api.get(`/rankings?period=all_time&limit=50`);

      if (response.success) {
        const leaderboardData = response.data.leaderboard || [];
        setUsers(leaderboardData);

        if (myId) {
            const me = leaderboardData.find((u: LeaderboardUser) => u.id === myId);
            if (me) setCurrentUser(me);
            else if (response.data.my_rank) setCurrentUser(response.data.my_rank);
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
        lg: "w-24 h-24 text-xl",
        xl: "w-24 h-24 text-2xl",
        "2xl": "w-32 h-32 text-3xl"
    };

    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 ${sizeClass[size]} ${border} bg-slate-100 shadow-lg flex items-center justify-center`}>
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
    if (rank === 1) return <Crown size={24} className="fill-white text-white" />;
    if (rank === 2) return <Medal size={24} className="fill-white text-white" />;
    if (rank === 3) return <Medal size={24} className="fill-white text-white" />;
    return <span className="font-black text-lg text-white">#{rank}</span>;
  };

  const getRightBadgeStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-amber-300 to-amber-500 shadow-amber-500/50 ring-4 ring-amber-200";
    if (rank === 2) return "bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-400/50 ring-4 ring-slate-200";
    if (rank === 3) return "bg-gradient-to-br from-orange-300 to-orange-500 shadow-orange-500/50 ring-4 ring-orange-200";
    return "bg-slate-700 shadow-slate-900/50 ring-4 ring-slate-600";
  };

  const EmptyPodium = ({ rank, heightClass }: { rank: number, heightClass: string }) => (
    <div className="flex flex-col items-center w-1/3 max-w-[140px] opacity-40 grayscale">
        <div className="relative mb-4">
            <div className={`rounded-full bg-slate-100 border-4 border-dashed border-slate-300 flex items-center justify-center ${rank === 1 ? 'w-32 h-32' : 'w-24 h-24'}`}>
                <UserIcon className="text-slate-300" size={rank === 1 ? 40 : 32} />
            </div>
        </div>
        <div className={`w-full ${heightClass} bg-slate-100 rounded-t-3xl border-t-2 border-white/50 relative`}></div>
    </div>
  );

  return (
    <UserLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-[10%] right-[-10%] w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="min-h-screen pb-40 pt-8">
        <main className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-3 drop-shadow-sm">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Ranking</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Para juara terbaik sepanjang masa</p>
          </div>

          {loading ? (
             // 2. Menggunakan Component LoadingSpinner
             <div className="flex justify-center py-24 min-h-[400px] items-center">
                <LoadingSpinner />
             </div>
          ) : (
            <>
              {/* --- PODIUM SECTION --- */}
              <div className="relative flex justify-center items-end gap-4 md:gap-8 mb-16 px-2 min-h-[380px]">
                
                {/* Juara 2 */}
                {users[1] ? (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100 z-10 w-1/3 max-w-[160px]">
                    <div className="relative mb-4 group transform transition-transform hover:-translate-y-2 duration-300">
                        <Avatar url={users[1].avatar_url} name={users[1].full_name} size="lg" border="border-[6px] border-slate-300 shadow-2xl ring-4 ring-slate-100" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-sm font-black px-3 py-1 rounded-full border-4 border-slate-100 shadow-lg">
                            #2
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center mb-2">
                        <p className="font-bold text-slate-800 text-sm md:text-lg truncate w-full text-center mb-1">{users[1].full_name.split(' ')[0]}</p>
                        <span className="text-slate-500 text-xs font-bold bg-slate-100 px-3 py-1 rounded-full">{users[1].xp.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full h-32 mt-2 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-50/20 backdrop-blur-sm rounded-t-[2.5rem] border-t border-white/80 shadow-inner relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/40 to-transparent" />
                    </div>
                  </div>
                ) : <EmptyPodium rank={2} heightClass="h-32" />}

                {/* Juara 1 */}
                {users[0] ? (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-20 w-1/3 max-w-[200px] -mx-4 pb-4">
                    <div className="relative mb-6 group transform transition-transform hover:-translate-y-2 duration-300">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce-slow">
                            <Crown size={42} className="text-amber-400 fill-amber-400 drop-shadow-xl" />
                        </div>
                        <Avatar url={users[0].avatar_url} name={users[0].full_name} size="2xl" border="border-[6px] border-amber-400 shadow-2xl ring-4 ring-amber-100" />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-lg font-black px-5 py-1.5 rounded-full border-4 border-amber-100 shadow-xl">
                            #1
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center mb-2">
                        <p className="font-black text-slate-900 text-lg md:text-xl truncate w-full text-center mb-1">{users[0].full_name.split(' ')[0]}</p>
                        <span className="text-amber-600 bg-amber-50 text-sm font-black flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-amber-100">
                            <Zap size={14} fill="currentColor" /> {users[0].xp.toLocaleString()} XP
                        </span>
                    </div>
                    <div className="w-full h-44 mt-2 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-50/20 backdrop-blur-md rounded-t-[3rem] border-t border-white/60 shadow-xl shadow-amber-500/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_3s_infinite] skew-y-12" />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-900/10 text-8xl font-black">1</div>
                    </div>
                  </div>
                ) : <EmptyPodium rank={1} heightClass="h-44" />}

                {/* Juara 3 */}
                {users[2] ? (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200 z-10 w-1/3 max-w-[160px]">
                    <div className="relative mb-4 group transform transition-transform hover:-translate-y-2 duration-300">
                        <Avatar url={users[2].avatar_url} name={users[2].full_name} size="lg" border="border-[6px] border-orange-300 shadow-2xl ring-4 ring-orange-100" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-sm font-black px-3 py-1 rounded-full border-4 border-orange-100 shadow-lg">
                            #3
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center mb-2">
                        <p className="font-bold text-slate-800 text-sm md:text-lg truncate w-full text-center mb-1">{users[2].full_name.split(' ')[0]}</p>
                        <span className="text-slate-500 text-xs font-bold bg-slate-100 px-3 py-1 rounded-full">{users[2].xp.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full h-24 mt-2 bg-gradient-to-b from-orange-100 via-orange-50 to-orange-50/20 backdrop-blur-sm rounded-t-[2.5rem] border-t border-white/80 shadow-inner relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/40 to-transparent" />
                    </div>
                  </div>
                ) : <EmptyPodium rank={3} heightClass="h-24" />}
              </div>

              {/* --- LIST SECTION --- */}
              <div className="space-y-4 relative z-10 pb-12">
                 {/* 3. FIX ERROR KEY: Tambahkan index sebagai fallback jika user.id duplikat */}
                 {users.slice(3).map((user, index) => (
                   <div 
                     key={`${user.id}-${index}`} // Menggunakan kombinasi ID + index agar unik
                     className={`flex items-center gap-6 p-5 rounded-[1.5rem] backdrop-blur-md border transition-all duration-300 group ${
                        user.id === myId 
                        ? 'bg-indigo-50/90 border-indigo-200 shadow-xl shadow-indigo-200/40 scale-[1.02] z-20' 
                        : 'bg-white/80 border-white/80 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1'
                     }`}
                   >
                      <div className={`w-10 text-center font-black text-lg ${user.id === myId ? 'text-indigo-600' : 'text-slate-300'}`}>
                        {user.rank}
                      </div>
                      
                      <Avatar url={user.avatar_url} name={user.full_name} size="md" />
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                         <div className="flex items-center gap-2 mb-0.5">
                             <p className={`font-bold truncate text-base ${user.id === myId ? 'text-indigo-900' : 'text-slate-800'}`}>
                                {user.full_name}
                             </p>
                             {user.is_premium && <Sparkles size={16} className="text-amber-500 fill-amber-500" />}
                         </div>
                      </div>

                      <div className={`text-right flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                          user.id === myId
                          ? 'bg-white border-indigo-100 shadow-sm'
                          : 'bg-slate-50 border-slate-100 group-hover:border-indigo-50'
                      }`}>
                         <Zap size={16} className={user.id === myId ? 'text-indigo-600' : 'text-indigo-400'} />
                         <span className={`font-black text-base ${user.id === myId ? 'text-indigo-700' : 'text-slate-700'}`}>
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

        {/* --- STICKY USER BAR --- */}
        {currentUser && (
            <div className="fixed bottom-6 left-0 right-0 px-4 z-40 flex justify-center animate-in slide-in-from-bottom-10 duration-700 delay-500">
                <div className="w-full max-w-2xl bg-[#0F172A]/95 backdrop-blur-2xl text-white rounded-[2rem] p-4 shadow-2xl shadow-slate-900/50 border border-slate-700/50 flex items-center justify-between gap-5 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
                        <div className="relative shrink-0">
                             <Avatar url={currentUser.avatar_url} name={currentUser.full_name} size="md" border="border-[3px] border-slate-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                             <div className="flex items-center gap-3">
                                <p className="font-bold text-lg text-white truncate">{currentUser.full_name.split(' ')[0]}</p>
                             </div>
                             <p className="text-xs text-slate-400 font-medium">Keep grinding for top #1!</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 relative z-10 shrink-0">
                        <div className="text-right hidden sm:block">
                             <div className="flex items-center justify-end gap-2">
                                 <Zap size={18} className="text-amber-400 fill-amber-400" />
                                 <span className="font-black text-white text-xl">{currentUser.xp.toLocaleString()}</span>
                             </div>
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total XP</span>
                        </div>

                        <div className={`relative flex items-center justify-center w-16 h-16 rounded-[1.2rem] shrink-0 border-2 shadow-2xl transform rotate-3 ${getRightBadgeStyle(currentUser.rank)}`}>
                             <RankIcon rank={currentUser.rank} />
                        </div>
                    </div>

                </div>
            </div>
        )}
      </div>
    </UserLayout>
  );
}