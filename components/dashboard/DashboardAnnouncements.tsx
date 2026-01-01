"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Loader2, Megaphone } from "lucide-react";
import { Announcement } from "@/types";

const ANNOUNCE_GRADIENTS = [
  "from-violet-600 via-fuchsia-600 to-pink-600",
  "from-blue-600 via-cyan-600 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-orange-500 via-amber-500 to-yellow-500",
];

export default function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get("/announcements/active");
        if (response.success) {
          setAnnouncements(response.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateString));
  };

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % announcements.length);
  const handlePrev = () => setActiveIdx((prev) => (prev - 1 + announcements.length) % announcements.length);

  const current = announcements[activeIdx];
  const gradient = ANNOUNCE_GRADIENTS[activeIdx % ANNOUNCE_GRADIENTS.length];
  const hasMedia = current?.video_url || current?.image_url;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
            <Megaphone size={18} />
          </div>
          Info Terbaru
        </h2>
        <div className="flex items-center gap-2">
          {announcements.length > 1 && (
            <div className="flex gap-1.5">
              <button onClick={handlePrev} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNext} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="w-full h-[200px] bg-white/50 backdrop-blur-sm border border-slate-100 rounded-[2rem] animate-pulse flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={24} />
        </div>
      ) : announcements.length > 0 ? (
        <div className="relative w-full group h-auto md:h-[220px]">
          <div className={`absolute -top-4 -right-4 w-[200px] h-[200px] bg-gradient-to-br ${gradient} blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse`} />
          <div className="relative w-full h-full rounded-[2rem] bg-[#020617] border border-white/10 shadow-2xl shadow-indigo-900/10 overflow-hidden flex flex-col md:flex-row gap-0 items-stretch">
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('/noise.png')] pointer-events-none mix-blend-overlay" />
            
            <div className="flex-1 p-6 md:p-8 relative z-10 flex flex-col justify-center order-2 md:order-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  <Calendar size={10} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-300 tracking-wide">{formatDate(current.created_at)}</span>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 leading-tight line-clamp-2">
                {current.title}
              </h3>
              <div className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 mb-5 max-w-lg" dangerouslySetInnerHTML={{ __html: current.content }} />
              <Link href={`/announcement/${current.id}`} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-bold text-xs group/link transition-colors">
                <span>Baca Selengkapnya</span>
                <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {hasMedia && (
               <div className="w-full md:w-[40%] h-[180px] md:h-full relative shrink-0 order-1 md:order-2 overflow-hidden bg-slate-900 border-b md:border-b-0 md:border-l border-white/10">
                  {current.video_url ? (
                    <video 
                      src={current.video_url} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    current.image_url && <img src={current.image_url} alt="Media" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-transparent to-[#020617]/80" />
               </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-[120px] bg-white border-2 border-slate-100 border-dashed rounded-[2rem] flex items-center justify-center gap-3 text-slate-400">
           <Megaphone size={20} className="opacity-50"/>
           <span className="font-bold text-sm">Tidak ada info baru.</span>
        </div>
      )}
    </section>
  );
}