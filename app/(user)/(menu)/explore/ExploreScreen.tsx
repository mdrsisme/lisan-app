"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Compass, Sparkles, Rocket, Telescope } from "lucide-react";
import { api } from "@/lib/api";
import CourseCard, { CourseType } from "@/components/ui/CourseCard";
import UserLayout from "@/components/layouts/UserLayout";

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
    <UserLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/15 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="min-h-screen pb-20">
        
        <div className="relative pt-12 pb-16 px-4"> 
           <div className="max-w-4xl mx-auto text-center relative z-10">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                  <Rocket size={12} className="animate-bounce" /> Jelajahi Kursus
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-5 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Temukan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">Potensi</span> <br/>
                  <span className="relative inline-block">
                    Terbaikmu
                    <svg className="absolute w-full h-2.5 -bottom-0.5 left-0 text-fuchsia-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
              </h1>

              <p className="text-slate-500 text-base md:text-lg font-medium mb-10 max-w-lg mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                  Akses ribuan materi pembelajaran berkualitas tinggi untuk meningkatkan keahlian Anda ke level berikutnya.
              </p>

              <div className="max-w-xl mx-auto relative group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 rounded-[1.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-white rounded-[1.3rem] shadow-xl shadow-indigo-500/10 flex items-center p-1.5 ring-1 ring-slate-100">
                      <div className="pl-5 flex items-center justify-center pointer-events-none">
                          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                          type="text"
                          className="block w-full px-4 py-3 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-base font-bold outline-none"
                          placeholder="Cari topik yang ingin dipelajari..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="pr-1.5 hidden sm:block">
                          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              CARI
                          </div>
                      </div>
                  </div>
              </div>

           </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {isLoading ? (
               <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
                  <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-[5px] border-slate-100" />
                      <div className="absolute inset-0 rounded-full border-[5px] border-t-indigo-600 animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={28} />
                  </div>
                  <p className="text-slate-400 font-bold mt-6 tracking-wide text-xs uppercase">Memuat Kursus...</p>
               </div>
          ) : filteredCourses.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-6 px-1 animate-in fade-in duration-700">
                    <Telescope size={18} className="text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-800">
                        Hasil Pencarian <span className="text-slate-400 font-medium ml-1">({filteredCourses.length})</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    {filteredCourses.map((course, index) => (
                        <div key={course.id} className="h-full transform hover:-translate-y-1.5 transition-transform duration-300">
                            <CourseCard course={course} index={index} />
                        </div>
                    ))}
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 text-center shadow-xl shadow-slate-200/40 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner border border-slate-100 rotate-12">
                      <Compass size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Belum Ada Kursus</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed text-sm">
                      {searchQuery 
                          ? <>Tidak ada hasil untuk <span className="text-indigo-600 font-bold decoration-wavy underline">"{searchQuery}"</span>.<br/>Coba kata kunci yang lebih umum.</>
                          : "Saat ini belum ada kursus yang tersedia. Cek kembali nanti ya!"}
                  </p>
                  {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        Reset Pencarian
                      </button>
                  )}
              </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}