"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Trophy, Lock, Star, Calendar, Medal, 
  Filter, Award, Zap 
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import UserLayout from "@/components/layouts/UserLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";

// --- TYPES ---
type AchievementCategory = 'learning' | 'streak' | 'community' | 'collection' | 'all';

interface AchievementMaster {
  id: string;
  title: string;
  description: string;
  icon_url: string | null;
  category: string;
  xp_reward: number;
  target_value: number;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
}

interface MergedAchievement extends AchievementMaster {
  is_unlocked: boolean;
  unlocked_at: string | null;
}

export default function AchievementScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState<MergedAchievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('all');
  const [stats, setStats] = useState({ total: 0, unlocked: 0 });

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Parallel Fetch: Master Data (Semua list) & User Data (Yang sudah didapat)
        const [masterRes, userRes] = await Promise.all([
          api.get('/achievements'),           // GET /api/achievements (Public/Master)
          api.get('/progress/achievements')   // GET /api/progress/achievements (User Owned)
        ]);

        const masterList: AchievementMaster[] = masterRes.success ? masterRes.data : [];
        const userList: UserAchievement[] = userRes.success ? userRes.data : [];

        // Set User Owned IDs untuk lookup cepat
        const userOwnedMap = new Map(userList.map(u => [u.achievement_id, u.unlocked_at]));

        // Merge Data: Gabungkan Master + Status Unlocked
        const merged: MergedAchievement[] = masterList.map(item => ({
          ...item,
          is_unlocked: userOwnedMap.has(item.id),
          unlocked_at: userOwnedMap.get(item.id) || null
        }));

        setAchievements(merged);
        setStats({
          total: merged.length,
          unlocked: userList.length
        });

      } catch (error) {
        console.error("Gagal memuat achievement:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchData();
  }, []);

  // --- FILTER LOGIC ---
  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const categories: { id: AchievementCategory; label: string; icon: any }[] = [
    { id: 'all', label: 'Semua', icon: Filter },
    { id: 'learning', label: 'Belajar', icon: Zap },
    { id: 'streak', label: 'Streak', icon: Calendar },
    { id: 'collection', label: 'Koleksi', icon: Star },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        
        {/* --- HEADER --- */}
        <div className="bg-white border-b border-slate-200 pt-8 pb-6 px-4 sm:px-6 sticky top-[70px] z-30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <Trophy className="text-yellow-500 fill-yellow-500" /> Pencapaian
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Kumpulkan lencana dengan menyelesaikan misi belajar.
                </p>
              </div>
              
              {/* Stats Card Kecil */}
              <div className="text-right">
                <div className="text-3xl font-black text-indigo-600">
                  {stats.unlocked}<span className="text-slate-300 text-lg">/{stats.total}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Terbuka
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all active:scale-95
                    ${activeCategory === cat.id 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- LIST ACHIEVEMENT --- */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Trophy size={40} />
              </div>
              <p className="text-slate-400 font-medium">Belum ada pencapaian di kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.map((item) => (
                <div 
                  key={item.id}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 group overflow-hidden
                    ${item.is_unlocked 
                      ? "bg-white border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-200" 
                      : "bg-slate-50 border-slate-100 opacity-80 hover:opacity-100 grayscale hover:grayscale-0"
                    }`}
                >
                  {/* Background Decoration if Unlocked */}
                  {item.is_unlocked && (
                    <div className="absolute top-0 right-0 p-10 bg-indigo-50/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
                  )}

                  <div className="flex items-start gap-5 relative z-10">
                    
                    {/* ICON WRAPPER */}
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-inner
                      ${item.is_unlocked 
                        ? "bg-gradient-to-br from-indigo-100 to-white border border-indigo-50" 
                        : "bg-slate-200 border border-slate-300 text-slate-400"
                      }`}
                    >
                      {item.is_unlocked ? (
                        item.icon_url ? (
                          <Image src={item.icon_url} alt={item.title} width={40} height={40} />
                        ) : (
                          <Medal className="text-indigo-500 drop-shadow-sm" size={32} />
                        )
                      ) : (
                        <Lock size={24} />
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold text-lg mb-1 ${item.is_unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                          {item.title}
                        </h3>
                        {item.is_unlocked && (
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md border border-green-200">
                            SELESAI
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-500 leading-relaxed mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-bold">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border
                           ${item.is_unlocked 
                             ? "bg-amber-50 text-amber-600 border-amber-100" 
                             : "bg-slate-200 text-slate-500 border-slate-300"
                           }`}>
                           <Zap size={12} className={item.is_unlocked ? "fill-amber-500" : ""} />
                           +{item.xp_reward} XP
                        </div>

                        {item.is_unlocked && item.unlocked_at && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar size={12} />
                            {format(new Date(item.unlocked_at), "d MMM yyyy", { locale: idLocale })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </UserLayout>
  );
}