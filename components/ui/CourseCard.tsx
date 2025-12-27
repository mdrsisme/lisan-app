"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Lock, Crown } from "lucide-react";

export interface CourseType {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  level: string;
  is_published: boolean;
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
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsPremiumUser(user.is_premium === true);
    }
  }, []);

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden relative"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${activeGradient} rounded-full blur-[60px] opacity-60 animate-pulse`} />
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl ${activeGradient} rounded-full blur-[60px] opacity-60`} />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.08]" />
            
            <div className="relative z-10 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <PlayCircle size={28} />
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
          {course.level}
        </div>

        {/* --- PREMIUM ACCESS INDICATOR --- */}
        <div className="absolute top-4 right-4">
            {isPremiumUser ? (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-in zoom-in duration-300">
                    <Crown size={16} fill="currentColor" />
                </div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-lg">
                    <Lock size={14} />
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1 mb-6">
          <h3 className="text-lg font-black text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">
            {course.description || "Belajar materi ini untuk meningkatkan keahlian Anda ke level berikutnya."}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <span className={`text-xs font-bold px-4 py-2 rounded-xl transition-all
             ${isPremiumUser 
                ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' 
                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
             }
          `}>
            {isPremiumUser ? "Mulai Belajar" : "Lihat Detail"}
          </span>
        </div>
      </div>
    </Link>
  );
}