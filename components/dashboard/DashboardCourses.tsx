"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { ArrowRight, Award, BookOpen, PlayCircle, TrendingUp } from "lucide-react";
import { Course } from "@/types";

export default function DashboardCourses({ userId }: { userId: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchMyCourses = async () => {
      try {
        const res = await api.get(`/enrollments/user/${userId}`);
        if (res.success) {
          const mappedCourses = res.data.map((enrollment: any) => ({
            id: enrollment.courses.id,
            title: enrollment.courses.title,
            thumbnail_url: enrollment.courses.thumbnail_url,
            level: enrollment.courses.level || "Beginner",
            total_lessons: enrollment.courses.total_lessons || 0,
            completed_lessons: 0,
            progress_percentage: enrollment.progress_percentage,
            last_accessed: enrollment.updated_at
          }));
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [userId]);

  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
    if (percent > 75) return "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
    if (percent > 40) return "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]";
    return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-5 px-1">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
              <BookOpen size={18} />
            </div>
            Kursus Saya
          </h2>
          <p className="text-xs text-slate-500 font-medium ml-10">Lanjutkan pembelajaran terakhirmu</p>
        </div>
        {courses.length > 0 && (
          <Link href="/my-courses" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group bg-indigo-50 px-3.5 py-2 rounded-full hover:bg-indigo-100 transition-colors shadow-sm">
            Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (<div key={i} className="h-[280px] bg-white/50 border border-slate-100 rounded-[2rem] animate-pulse" />))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 h-full relative">
              <div className="relative h-48 w-full bg-[#020617] overflow-hidden shrink-0">
                {course.thumbnail_url ? (
                  <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-slate-900 flex items-center justify-center"><BookOpen className="text-white/20" size={40} /></div>
                )}
                <div className="absolute top-4 left-4 z-20"><span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase border border-white/20">{course.level}</span></div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col relative z-10">
                <h3 className="text-xl font-bold text-slate-800 leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <div className="mt-auto pt-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><TrendingUp size={14} className="text-indigo-500" /> Progress</span>
                    <span className="text-sm font-black text-slate-800">{course.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner mb-6">
                    <div className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(course.progress_percentage)}`} style={{ width: `${course.progress_percentage}%` }}></div>
                  </div>
                  <Link href={`/learning/${course.id}`} className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm relative overflow-hidden shadow-lg ${course.progress_percentage === 100 ? 'bg-white text-slate-700 border-2 border-slate-100' : 'bg-[#0F172A] text-white'}`}>
                    {course.progress_percentage === 0 ? "Mulai Belajar" : "Lanjutkan"} {course.progress_percentage === 100 ? <Award size={16} /> : <ArrowRight size={16} />}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-16 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-indigo-50/50 rounded-full flex items-center justify-center mb-4 shadow-inner"><BookOpen size={32} className="text-indigo-300" /></div>
          <p className="font-black text-slate-700 text-lg mb-1">Belum ada kursus.</p>
          <Link href="/explore" className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 rounded-full mt-4 flex items-center gap-2"><PlayCircle size={16} /> Jelajahi Katalog</Link>
        </div>
      )}
    </section>
  );
}