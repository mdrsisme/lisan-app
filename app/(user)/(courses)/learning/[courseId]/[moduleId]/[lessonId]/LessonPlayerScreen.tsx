"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, 
  Loader2, Zap, AlertCircle 
} from "lucide-react";

// Imports Components & Layouts
import UserLayout from "@/components/layouts/UserLayout"; // Layout Added
import Notification from "@/components/ui/Notification";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";

// Import Sub-Components (Pastikan file ini sudah dibuat sesuai langkah sebelumnya)
import VideoLesson from "@/components/lessons/VideoLesson";
import TextLesson from "@/components/lessons/TextLesson";
import CameraLesson from "@/components/lessons/CameraLesson";

type LessonType = 'video' | 'text' | 'camera_practice';

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  description: string | null;
  content_url: string | null;
  target_gesture: string | null;
  xp_reward: number;
}

export default function LessonPlayerScreen({ 
  courseId, moduleId, lessonId 
}: { 
  courseId: string; moduleId: string; lessonId: string 
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  // --- FETCH DATA ---
  useEffect(() => {
    // Validasi ID sebelum fetch untuk mencegah error 400/500
    if (!lessonId || !moduleId || !courseId) return;

    const initData = async () => {
      try {
        setIsLoading(true);

        // Parallel Fetching
        const [lessonRes, listRes] = await Promise.all([
            api.get(`/lessons/${lessonId}`),
            api.get(`/lessons/published?module_id=${moduleId}&limit=100`)
        ]);

        if (!lessonRes.success) throw new Error("Gagal memuat materi.");
        setLesson(lessonRes.data);

        if (listRes.success) setAllLessons(listRes.data.lessons);

        // Check Progress
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            const progressRes = await api.get(`/progress/${user.id}/${courseId}`);
            if (progressRes.success) {
                const completedIds = progressRes.data.completed_lessons.map((p: any) => p.lesson_id);
                if (completedIds.includes(lessonId)) setIsCompleted(true);
            }
        }
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setNotification({ type: 'error', message: error.message || "Terjadi kesalahan." });
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    initData();
  }, [lessonId, moduleId, courseId]);

  // --- NAVIGATION LOGIC ---
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) { router.push('/login'); return; }
        const user = JSON.parse(userStr);

        const res = await api.post('/progress', {
            user_id: user.id,
            course_id: courseId,
            module_id: moduleId,
            lesson_id: lessonId,
            is_completed: true,
            last_position_seconds: 0
        });

        if (res.success) {
            setIsCompleted(true);
            setNotification({ type: 'success', message: `Hebat! +${lesson?.xp_reward} XP` });
            
            // Auto navigate
            setTimeout(() => {
                if (nextLesson) {
                    router.push(`/learning/${courseId}/${moduleId}/${nextLesson.id}`);
                } else {
                    router.push(`/learning/${courseId}/${moduleId}`);
                }
            }, 1000);
        }
    } catch (error) {
        setNotification({ type: 'error', message: "Gagal menyimpan progress." });
    } finally {
        setIsCompleting(false);
    }
  };

  // --- RENDER CONTENT SWITCHER ---
  const renderContent = () => {
    if (!lesson) return null;
    switch (lesson.type) {
      case 'video':
        return <VideoLesson title={lesson.title} description={lesson.description} contentUrl={lesson.content_url} />;
      case 'text':
        return <TextLesson title={lesson.title} description={lesson.description} />;
      case 'camera_practice':
        return <CameraLesson targetGesture={lesson.target_gesture} />;
      default:
        return null;
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!lesson) {
    return (
      <UserLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 text-rose-500 shadow-lg shadow-rose-100">
                <AlertCircle size={36} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Materi Tidak Ditemukan</h1>
            <Link href={`/learning/${courseId}/${moduleId}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors mt-4">
                Kembali ke Modul
            </Link>
        </div>
      </UserLayout>
    );
  }

  // --- RENDER UTAMA ---
  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
        
        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                <Link href={`/learning/${courseId}/${moduleId}`} className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors border border-slate-200">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </div>
                    <span className="hidden sm:inline">Daftar Materi</span>
                </Link>
                <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-black border border-amber-100 flex items-center gap-1.5 uppercase tracking-widest shadow-sm">
                    <Zap size={14} className="fill-amber-500 text-amber-500" /> {lesson.xp_reward} XP
                </div>
            </div>
        </div>

        {/* Dynamic Content */}
        <main className="flex-1 w-full px-4 sm:px-6 py-8 md:py-12">
            {renderContent()}
        </main>

        {/* Bottom Nav */}
        <div className="sticky bottom-0 z-30 bg-white border-t border-slate-200 p-4 md:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                <div className="flex-1 flex justify-start">
                    {prevLesson ? (
                        <Link href={`/learning/${courseId}/${moduleId}/${prevLesson.id}`} className="hidden md:flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors px-6 py-3 rounded-2xl hover:bg-slate-50">
                            <ChevronLeft size={20} strokeWidth={2.5} /> Sebelumnya
                        </Link>
                    ) : <div className="w-24 hidden md:block" />}
                </div>

                <button
                    onClick={handleComplete}
                    disabled={isCompleting || isCompleted}
                    className={`relative w-full md:w-auto px-8 md:px-12 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-xl ${isCompleted ? "bg-emerald-500 text-white shadow-emerald-500/30 cursor-default" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/40"}`}
                >
                    {isCompleting ? <><Loader2 className="animate-spin" /> Menyimpan...</> : isCompleted ? <><CheckCircle className="animate-bounce" strokeWidth={2.5} /> Materi Selesai</> : <>Selesai & Lanjut <ChevronRight strokeWidth={3} size={20} /></>}
                </button>

                <div className="flex-1 flex justify-end">
                    {nextLesson && (
                        <Link href={`/learning/${courseId}/${moduleId}/${nextLesson.id}`} className="hidden md:flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors px-6 py-3 text-sm hover:bg-indigo-50 rounded-2xl">
                            Lewati <ChevronRight size={16} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
        
      </div>
    </UserLayout>
  );
}