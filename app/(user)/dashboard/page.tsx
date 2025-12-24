"use client";

import { useEffect, useState } from "react";
import UserNavbar from "@/components/ui/UserNavbar";
import { 
  PlayCircle, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Megaphone,
  Calendar,
  MoreHorizontal
} from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Pemeliharaan Sistem",
    desc: "Sistem akan update nanti malam pukul 23:00 WIB. Fitur baru akan hadir!",
    date: "24 Des 2025",
    color: "bg-gradient-to-r from-indigo-600 to-blue-600"
  },
  {
    id: 2,
    title: "Webinar Bahasa Isyarat",
    desc: "Bergabunglah dengan komunitas tuli pada hari Sabtu ini via Zoom.",
    date: "26 Des 2025",
    color: "bg-gradient-to-r from-orange-500 to-amber-500"
  },
  {
    id: 3,
    title: "Modul Baru Dirilis",
    desc: "Modul 'Ekspresi Wajah' kini tersedia untuk level Intermediate.",
    date: "28 Des 2025",
    color: "bg-gradient-to-r from-emerald-500 to-teal-500"
  }
];

const COURSES = [
  { id: 1, title: "Dasar BISINDO", total: 12, done: 8, color: "indigo" },
  { id: 2, title: "Percakapan Harian", total: 10, done: 2, color: "emerald" },
  { id: 3, title: "Angka & Matematika", total: 15, done: 0, color: "rose" },
  { id: 4, title: "Emosi & Ekspresi", total: 8, done: 0, color: "amber" },
];

export default function UserDashboard() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    document.title = "Dashboard - LISAN";
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserData(JSON.parse(userStr));
    }
  }, []);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4 px-1">
                <Megaphone size={20} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Papan Pengumuman</h2>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide">
                {ANNOUNCEMENTS.map((item) => (
                  <div 
                    key={item.id} 
                    className={`shrink-0 w-[85%] sm:w-[350px] snap-center rounded-3xl p-6 text-white shadow-lg shadow-slate-200/50 relative overflow-hidden group cursor-pointer ${item.color}`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm">
                            Info Terbaru
                          </span>
                          <span className="text-[10px] font-medium opacity-80">{item.date}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 leading-tight">{item.title}</h3>
                        <p className="text-sm opacity-90 leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                        Baca Selengkapnya <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen size={20} className="text-slate-600" />
                  Materi Belajar
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COURSES.map((course) => (
                  <div key={course.id} className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer group flex items-center gap-4">
                    {/* Icon Box */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-${course.color}-50 text-${course.color}-600 group-hover:scale-110 transition-transform`}>
                      <PlayCircle size={28} fill="currentColor" className="text-white/0 group-hover:text-white/20 transition-colors" />
                      <div className="absolute"><PlayCircle size={28} /></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">
                        {course.done}/{course.total} Pelajaran Selesai
                      </p>

                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${course.color}-500 rounded-full`} 
                          style={{ width: `${(course.done / course.total) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-slate-600 border-4 border-slate-50">
                {userData.full_name?.charAt(0)}
              </div>
              <h3 className="font-bold text-lg text-slate-800">{userData.full_name}</h3>
              <p className="text-sm text-slate-500 mb-6">Student Member</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-2xl p-3">
                  <span className="block text-2xl font-black text-slate-800">850</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">XP Poin</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3">
                  <span className="block text-2xl font-black text-slate-800">12</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Modul</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Aktivitas</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20}/></button>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Kuis Huruf A-Z", time: "Baru saja", icon: "📝" },
                  { title: "Video Angka", time: "2 jam lalu", icon: "📺" },
                  { title: "Login Harian", time: "Hari ini", icon: "🔥" },
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
                      {act.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{act.title}</p>
                      <p className="text-xs text-slate-400">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}