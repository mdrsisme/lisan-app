"use client";

import { useState, useEffect } from "react";
import { Search, Compass } from "lucide-react";
import { api } from "@/lib/api";
import CourseCard, { CourseType } from "@/components/ui/CourseCard";
import UserLayout from "@/components/layouts/UserLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <UserLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="min-h-screen pb-20 pt-8">
        <main className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
                <Compass size={12} /> Katalog
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Eksplorasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Kursus</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Temukan materi baru untuk dipelajari.</p>
            </div>

            <div className="relative w-full md:w-[320px] group z-10">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur-sm" />
              <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  className="block w-full px-3 py-2.5 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm font-bold outline-none"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {filteredCourses.map((course, index) => (
                <div key={course.id} className="h-full hover:-translate-y-1 transition-transform duration-300">
                  <CourseCard course={course} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/60 text-center shadow-lg shadow-slate-200/50">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-4 text-slate-300 shadow-inner rotate-6">
                <Compass size={36} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">Tidak Ditemukan</h3>
              <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto mb-6">
                {searchQuery
                  ? <>Hasil pencarian untuk <span className="text-indigo-600">"{searchQuery}"</span> kosong.</>
                  : "Belum ada kursus yang tersedia saat ini."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </UserLayout>
  );
}