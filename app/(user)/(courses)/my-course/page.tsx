"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, PlayCircle, Clock, 
  Award, Loader2, ArrowRight, Compass
} from "lucide-react";
import { api } from "@/lib/api";
import UserNavbar from "@/components/ui/UserNavbar";

interface Course {
  id: string;
  title: string;
  thumbnail_url: string | null;
  instructor_name: string;
  level: string;
}

interface Enrollment {
  id: string;
  status: 'active' | 'completed' | 'dropped';
  progress_percentage: number;
  courses: Course;
}

export default function MyCoursesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const res = await api.get(`/enrollments/user/${user.id}`);
      
      if (res.success) {
        setEnrollments(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(item => {
    const matchesSearch = item.courses.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-emerald-500";
    if (percent > 50) return "bg-cyan-500";
    return "bg-amber-500";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <UserNavbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pembelajaran Saya</h1>
            <p className="text-slate-500 mt-2">Pantau progres dan lanjutkan materi terakhir.</p>
          </div>
          
          <Link 
            href="/explore" 
            className="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-cyan-200 hover:text-cyan-700 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
          >
            <Compass size={20} className="group-hover:rotate-45 transition-transform duration-500" />
            Jelajahi Kursus Baru
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari di kursus saya..." 
            className="w-full pl-14 pr-6 py-4 bg-white rounded-[2rem] border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-medium text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-cyan-600 mb-4" size={40} />
            <p className="text-slate-500 font-medium animate-pulse">Memuat perpustakaan...</p>
          </div>
        ) : filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEnrollments.map((enrollment) => (
              <div 
                key={enrollment.id}
                className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
                  {enrollment.courses.thumbnail_url ? (
                    <Image
                      src={enrollment.courses.thumbnail_url}
                      alt={enrollment.courses.title}
                      fill
                      className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                      {enrollment.courses.level}
                    </span>
                    {enrollment.status === 'completed' && (
                        <span className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                          <Award size={16} />
                        </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-6 right-6">
                      <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-2">
                        {enrollment.courses.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                         <Clock size={14} />
                         <span>Fleksibel Access</span>
                      </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">

                  <div className="mt-auto">
                    <Link 
                      href={`/learning/${enrollment.courses.id}`}
                      className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group-hover:gap-4 text-sm
                        ${enrollment.status === 'completed' 
                           ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100' 
                           : 'bg-slate-900 text-white hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30'
                        }`}
                    >
                      {enrollment.progress_percentage === 0 ? "Mulai Belajar" : "Lanjutkan"}
                      {enrollment.status === 'completed' ? <Award size={18} /> : <ArrowRight size={18} />}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                {searchQuery ? <Search size={40} /> : <PlayCircle size={40} />}
             </div>
             
             {searchQuery ? (
               <>
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Tidak ditemukan</h3>
                 <p className="text-slate-500 max-w-md mx-auto mb-8">
                   Tidak ada kursus milikmu yang cocok dengan pencarian "{searchQuery}".
                 </p>
                 <Link href="/explore" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors">
                    Cari di Explore <Compass size={18} />
                 </Link>
               </>
             ) : (
               <>
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Belum ada kursus</h3>
                 <p className="text-slate-500 max-w-md mx-auto mb-8">
                   Anda belum mendaftar di kursus manapun. Mulai perjalanan belajar Anda sekarang.
                 </p>
                 <Link href="/explore" className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
                    Jelajahi Katalog <ArrowRight size={18} />
                 </Link>
               </>
             )}
          </div>
        )}
      </main>
    </div>
  );
}