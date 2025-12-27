"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, LayoutGrid, Compass, Sparkles, Rocket } from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import CourseCard, { CourseType } from "@/components/ui/CourseCard";

export default function ExploreScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/courses/published?limit=100"); 
      
      if (res.success && Array.isArray(res.data.courses)) {
        setCourses(res.data.courses);
      } else {
        setCourses([]); 
      }
    } catch (error) {
      console.error(error);
      setCourses([]); 
    } finally {
        setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04]" />
      </div>

      <div className="relative z-10">
        <UserNavbar />

        <div className="relative border-b border-slate-100/50 overflow-hidden pb-16 pt-12 bg-white/60 backdrop-blur-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                  <Rocket size={16} /> Jelajahi Kursus
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Temukan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600">Potensi Terbaikmu</span> <br/> di Sini
              </h1>

              <div className="max-w-xl mx-auto relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                      <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                      type="text"
                      className="block w-full pl-14 pr-6 py-5 rounded-3xl bg-white border-2 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-xl shadow-indigo-500/5 outline-none font-bold text-lg"
                      placeholder="Cari kursus impianmu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                      <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                  </div>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                  <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-100/50" />
                      <Loader2 className="animate-spin text-indigo-600 absolute inset-0 m-auto" size={40} />
                  </div>
                  <p className="text-slate-500 font-bold mt-6 animate-pulse">Sedang menyiapkan kursus terbaik...</p>
               </div>
          ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {filteredCourses.map((course, index) => (
                      <div key={course.id} className="h-full">
                          <CourseCard course={course} index={index} />
                      </div>
                  ))}
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white/80 backdrop-blur-md rounded-[3rem] border-2 border-slate-200 border-dashed text-center shadow-xl shadow-slate-200/20 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-300 shadow-inner border border-indigo-100">
                      <Compass size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3">Belum Ada Kursus</h3>
                  <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                      {searchQuery 
                          ? <>Tidak ada hasil untuk pencarian <span className="text-indigo-600 font-bold">"{searchQuery}"</span>.<br/>Coba kata kunci lain.</>
                          : "Saat ini belum ada kursus yang tersedia. Cek kembali nanti ya!"}
                  </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}