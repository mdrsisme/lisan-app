"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, LayoutGrid } from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import CourseCard, { CourseType } from "@/components/ui/CourseCard";

export default function ExplorePage() {
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
      console.error("Gagal memuat kursus:", error);
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <UserNavbar />
      
      <div className="relative bg-white border-b border-slate-100 overflow-hidden pb-12 pt-10">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -mr-20 -mt-20 opacity-60 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -ml-20 -mb-20 opacity-60 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight">
                Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ilmu Tanpa Batas</span>
            </h1>

            <div className="max-w-xl mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-xl shadow-slate-200/40 outline-none font-medium"
                    placeholder="Cari kursus apa hari ini..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Memuat kursus terbaik...</p>
             </div>
        ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                    <div key={course.id} className="h-full">
                        <CourseCard course={course} index={index} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <LayoutGrid size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Tidak ada kursus ditemukan</h3>
                <p className="text-slate-500 mt-2 max-w-md">
                    {searchQuery 
                        ? `Tidak ada hasil untuk pencarian "${searchQuery}".` 
                        : "Belum ada kursus yang dipublikasikan saat ini."}
                </p>
            </div>
        )}
      </div>
    </div>
  );
}