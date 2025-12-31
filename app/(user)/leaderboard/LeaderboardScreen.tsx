"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Trophy, Medal, Crown, TrendingUp, Sparkles, Zap, Shield, ArrowUp
} from "lucide-react";
import { api } from "@/lib/api";
import UserLayout from "@/components/layouts/UserLayout";

// Tipe Data
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
  const [period, setPeriod] = useState<'weekly' | 'all_time'>('weekly');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

  // --- Dummy Data Generator (Hapus jika API sudah siap) ---
  const generateMockData = () => {
    const names = ["Sulthan Alif", "Nadia Puteri", "Rizky Ramadhan", "Alya Sarah", "Budi Santoso", "Citra Kirana", "Dedi Mahendra", "Eka Saputra", "Fani Rahma", "Gilang Pratama"];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `user-${i}`,
      full_name: names[i] || `User ${i + 1}`,
      avatar_url: null,
      xp: 15000 - (i * Math.floor(Math.random() * 500 + 300)),
      rank: i + 1,
      is_premium: i % 3 === 0
    }));
  };
  // -----------------------------------------------------

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // Simulasi API call
      setTimeout(() => {
        const mockData = generateMockData();
        setUsers(mockData);
        
        // Simulasi kita ada di ranking 8
        const myUser = { ...mockData[7], full_name: "Anda (Sulthan)" }; 
        setCurrentUser(myUser);
        
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  // Komponen Avatar Helper
  const Avatar = ({ url, name, size = "md", border = "" }: { url: string | null, name: string, size?: "sm"|"md"|"lg"|"xl", border?: string }) => {
    const sizeClass = {
        sm: "w-10 h-10 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-base",
        xl: "w-24 h-24 text-2xl"
    };

    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 ${sizeClass[size]} ${border} bg-slate-100 shadow-sm`}>
        {url ? (
          <Image src={url} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    );
  };

  return (
    <UserLayout>
      {/* Background Ambience - Clean & Modern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="min-h-screen pb-32">
        <main className="max-w-3xl mx-auto px-4 py-8">
          
          {/* Header Section */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
                <Trophy size={12} className="text-amber-500" /> Hall of Fame
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
              Peringkat <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Juara</span>
            </h1>

            {/* Toggle Period - Sleek */}
            <div className="inline-flex bg-slate-100/80 p-1 rounded-2xl shadow-inner relative">
              <button 
                onClick={() => setPeriod('weekly')}
                className={`relative z-10 px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${period === 'weekly' ? 'bg-white text-indigo-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Minggu Ini
              </button>
              <button 
                onClick={() => setPeriod('all_time')}
                className={`relative z-10 px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${period === 'all_time' ? 'bg-white text-indigo-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Semua Waktu
              </button>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
             </div>
          ) : (
            <>
              {/* --- PODIUM SECTION --- */}
              <div className="relative flex justify-center items-end gap-3 md:gap-6 mb-12 px-4 min-h-[300px]">
                
                {/* Rank 2 (Silver) */}
                {topThree[1] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100 z-10 w-1/3 max-w-[120px]">
                    <div className="relative mb-3 group">
                        <Avatar url={topThree[1].avatar_url} name={topThree[1].full_name} size="lg" border="border-[3px] border-slate-300 shadow-xl" />
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-sm">
                            2
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <p className="font-bold text-slate-800 text-xs md:text-sm truncate w-full text-center mb-1">{topThree[1].full_name.split(' ')[0]}</p>
                        <span className="text-slate-500 text-[10px] font-bold">{topThree[1].xp} XP</span>
                    </div>
                    {/* Pedestal 2 */}
                    <div className="w-full h-24 mt-3 bg-gradient-to-b from-slate-200 to-slate-50/20 backdrop-blur-sm rounded-t-2xl border-t border-white/60 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/30" />
                    </div>
                  </div>
                )}

                {/* Rank 1 (Gold) */}
                {topThree[0] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-20 w-1/3 max-w-[140px] -mx-2">
                    <div className="relative mb-3 group">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 animate-bounce-slow">
                            <Crown size={28} className="text-amber-400 fill-amber-400 drop-shadow-md" />
                        </div>
                        <Avatar url={topThree[0].avatar_url} name={topThree[0].full_name} size="xl" border="border-[4px] border-amber-300 ring-4 ring-amber-100 shadow-2xl" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-black px-3 py-0.5 rounded-full border-2 border-white shadow-lg">
                            1
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <p className="font-black text-slate-900 text-sm md:text-base truncate w-full text-center mb-1">{topThree[0].full_name.split(' ')[0]}</p>
                        <span className="text-amber-500 text-xs font-black flex items-center gap-1">
                            <Zap size={10} fill="currentColor" /> {topThree[0].xp} XP
                        </span>
                    </div>
                    {/* Pedestal 1 */}
                    <div className="w-full h-32 mt-3 bg-gradient-to-b from-amber-100 to-amber-50/20 backdrop-blur-md rounded-t-[2rem] border-t border-white/60 relative overflow-hidden shadow-xl shadow-amber-500/10">
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_3s_infinite] skew-y-12" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-amber-900/10 text-6xl font-black">1</div>
                    </div>
                  </div>
                )}

                {/* Rank 3 (Bronze) */}
                {topThree[2] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200 z-10 w-1/3 max-w-[120px]">
                    <div className="relative mb-3 group">
                        <Avatar url={topThree[2].avatar_url} name={topThree[2].full_name} size="lg" border="border-[3px] border-orange-200 shadow-xl" />
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-orange-200 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-sm">
                            3
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <p className="font-bold text-slate-800 text-xs md:text-sm truncate w-full text-center mb-1">{topThree[2].full_name.split(' ')[0]}</p>
                        <span className="text-slate-500 text-[10px] font-bold">{topThree[2].xp} XP</span>
                    </div>
                    {/* Pedestal 3 */}
                    <div className="w-full h-16 mt-3 bg-gradient-to-b from-orange-100 to-orange-50/20 backdrop-blur-sm rounded-t-2xl border-t border-white/60 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/30" />
                    </div>
                  </div>
                )}
              </div>

              {/* --- LIST SECTION --- */}
              <div className="space-y-3 relative z-10">
                 {restUsers.map((user, idx) => (
                   <div 
                     key={user.id} 
                     className="flex items-center gap-4 p-3 pr-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 group"
                   >
                      <div className="w-8 text-center font-bold text-slate-400 text-sm">{user.rank}</div>
                      
                      <Avatar url={user.avatar_url} name={user.full_name} size="sm" />
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                             <p className="font-bold text-slate-800 truncate text-sm">{user.full_name}</p>
                             {user.is_premium && <Sparkles size={12} className="text-amber-500 fill-amber-500" />}
                         </div>
                      </div>

                      <div className="text-right flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover:border-indigo-50 transition-colors">
                         <Zap size={12} className="text-indigo-400" />
                         <span className="font-bold text-slate-700 text-sm">{user.xp}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </>
          )}
        </main>

        {/* --- STICKY USER BAR (Modern Floating) --- */}
        {currentUser && (
            <div className="fixed bottom-6 left-0 right-0 px-4 z-40 flex justify-center animate-in slide-in-from-bottom-10 duration-700 delay-500">
                <div className="w-full max-w-lg bg-[#0F172A]/90 backdrop-blur-xl text-white rounded-3xl p-2 pl-4 pr-5 shadow-2xl shadow-slate-900/20 border border-slate-700/50 flex items-center gap-4 relative overflow-hidden group">
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center justify-center w-8 h-8 bg-slate-700 rounded-full font-bold text-sm shrink-0">
                        {currentUser.rank}
                    </div>

                    <div className="relative shrink-0">
                        <Avatar url={currentUser.avatar_url} name={currentUser.full_name} size="sm" border="border-2 border-slate-600" />
                    </div>

                    <div className="flex-1 min-w-0 relative">
                        <p className="font-bold text-sm text-white truncate">Kamu ({currentUser.full_name.split(' ')[0]})</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <ArrowUp size={10} className="text-emerald-400" /> Naik 2 peringkat
                        </p>
                    </div>

                    <div className="relative text-right">
                        <div className="flex items-center gap-1.5">
                            <Zap size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
                            <span className="font-black text-white text-base">{currentUser.xp}</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total XP</span>
                    </div>
                </div>
            </div>
        )}

      </div>
    </UserLayout>
  );
}