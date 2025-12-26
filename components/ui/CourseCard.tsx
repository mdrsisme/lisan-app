"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, Clock, Star, PlayCircle 
} from "lucide-react";

export interface CourseType {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  level: string;
  author?: {
    full_name: string;
    avatar_url: string | null;
  };
  stats?: {
    rating: number;
    students: number;
    lessons: number;
    duration: string;
  };
}

const GRADIENTS = [
  "from-violet-600 to-indigo-600",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-fuchsia-600 to-purple-600",
];

interface CourseCardProps {
  course: CourseType;
  index: number;
}

export default function CourseCard({ course, index }: CourseCardProps) {
  const activeGradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <Link 
      href={`/courses/${course.id}`}
      className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden"
    >

      <div className="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden">
        {course.thumbnail_url ? (
          <div className="relative w-full h-full">
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${activeGradient} rounded-full blur-[50px] opacity-60 animate-pulse`} />
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl ${activeGradient} rounded-full blur-[50px] opacity-60`} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <PlayCircle size={24} />
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
          {course.level}
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex-1 mb-4">
            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {course.title}
            </h3>
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {course.description || "Belajar hal baru dan tingkatkan skill Anda."}
            </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1">
                <BookOpen size={12} className="text-indigo-500" />
                {course.stats?.lessons || 10} Modul
            </div>
            <div className="flex items-center gap-1">
                <Clock size={12} className="text-indigo-500" />
                {course.stats?.duration || "Video"}
            </div>
            <div className="flex items-center gap-1 ml-auto">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                {course.stats?.rating || 5.0}
            </div>
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative">
                    {course.author?.avatar_url ? (
                        <Image src={course.author.avatar_url} alt="Author" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 text-[9px] font-bold">
                            {course.author?.full_name?.charAt(0) || "A"}
                        </div>
                    )}
                </div>
                <span className="text-xs font-bold text-slate-600 truncate max-w-[90px]">
                    {course.author?.full_name || "Admin"}
                </span>
            </div>

            <span className="text-indigo-600 font-bold text-xs bg-indigo-50 px-3 py-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Detail
            </span>
        </div>
      </div>
    </Link>
  );
}