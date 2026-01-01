"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2, 
  Loader2, Zap, AlertCircle 
} from "lucide-react";

import UserLayout from "@/components/layouts/UserLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";
import { useNotification } from "@/components/providers/NotificationContext"; // Import Hook Context

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
  const { success, error } = useNotification(); // Panggil hook notifikasi

  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [practiceSuccess, setPracticeSuccess] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!lessonId || !moduleId || !courseId) return;

    const initData = async () => {
      try {
        setIsLoading(true);
        const [lessonRes, listRes] = await Promise.all([
            api.get(`/lessons/${lessonId}`),
            api.get(`/lessons/published?module_id=${moduleId}&limit=100`)
        ]);

        if (!lessonRes.success) throw new Error("Gagal memuat materi.");
        setLesson(lessonRes.data);

        if (listRes.success) setAllLessons(listRes.data.lessons);

        // Cek Progress User
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            const progressRes = await api.get(`/progress/${user.id}/${courseId}`);
            if (progressRes.success) {
                const completedIds = progressRes.data.completed_lessons.map((p: any) => p.lesson_id);
                if (completedIds.includes(lessonId)) {
                  setIsCompleted(true);
                  setPracticeSuccess(true); 
                }
            }
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        // Panggil error global
        error(err.message || "Terjadi kesalahan saat memuat materi.");
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    initData();
  }, [lessonId, moduleId, courseId, error]); // tambahkan error ke dependency

  // --- LOGIC STREAK ---
  const handleStreakLogic = async (userId: string) => {
    try {
      const res = await api.get(`/streaks/${userId}`);
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (res.success && res.data.id) {
        const streak = res.data;
        const lastActivityStr = new Date(streak.last_activity_at).toISOString().split('T')[0];
        
        if (lastActivityStr === todayStr) return; 

        let newCurrent = 1;
        if (lastActivityStr === yesterdayStr) {
            newCurrent = streak.current_streak + 1;
        } 

        await api.put(`/streaks/${streak.id}`, {
            current_streak: newCurrent,
            longest_streak: Math.max(newCurrent, streak.longest_streak),
            last_activity_at: now.toISOString()
        });
      } else {
        await api.post('/streaks', {
            user_id: userId,
            current_streak: 1,
            longest_streak: 1,
            last_activity_at: now.toISOString()
        });
      }
    } catch (err) {
      console.error("Streak Error (Silent):", err);
    }
  };

  // --- HANDLE COMPLETION ---
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
            if (!isCompleted) {
               await handleStreakLogic(user.id);
            }

            setIsCompleted(true);
            
            // Panggil success global
            success(`Materi Selesai! +${lesson?.xp_reward} XP ditambahkan.`);
        }
    } catch (err) {
        // Panggil error global
        error("Gagal menyimpan progress.");
    } finally {
        setIsCompleting(false);
    }
  };

  const handlePracticeSuccess = () => {
    if (!practiceSuccess) {
      setPracticeSuccess(true);
      // Panggil success global
      success("Gerakan Bagus! Silakan klik Selesai.");
    }
  };

  const renderContent = () => {
    if (!lesson) return null;
    switch (lesson.type) {
      case 'video':
        return <VideoLesson title={lesson.title} description={lesson.description} contentUrl={lesson.content_url} />;
      case 'text':
        return <TextLesson title={lesson.title} description={lesson.description} contentUrl={lesson.content_url} />;
      case 'camera_practice':
        return <CameraLesson targetGesture={lesson.target_gesture} onSuccess={handlePracticeSuccess} />;
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
            <Link href={`/learning/${courseId}/${moduleId}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl mt-4">
                Kembali ke Modul
            </Link>
        </div>
      </UserLayout>
    );
  }

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isReadyToComplete = lesson.type !== 'camera_practice' || practiceSuccess || isCompleted;

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
        
        {/* COMPONENT NOTIFICATION DIHAPUS DARI SINI KARENA SUDAH DI GLOBAL */}

        {/* HEADER */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                <Link href={`/learning/${courseId}/${moduleId}`} className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 border border-slate-200">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </div>
                    <span className="hidden sm:inline">Daftar Materi</span>
                </Link>
                <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-black border border-amber-100 flex items-center gap-1.5 uppercase tracking-widest">
                    <Zap size={14} className="fill-amber-500 text-amber-500" /> {lesson.xp_reward} XP
                </div>
            </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 w-full px-4 sm:px-6 py-8 md:py-12">
            {renderContent()}
        </main>

        {/* BOTTOM BAR */}
        <div className="sticky bottom-0 z-30 bg-white border-t border-slate-200 p-4 md:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                
                <div className="flex-1 flex justify-start">
                    {prevLesson ? (
                        <Link href={`/learning/${courseId}/${moduleId}/${prevLesson.id}`} className="hidden md:flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 px-6 py-3 hover:bg-slate-50 rounded-2xl">
                            <ChevronLeft size={20} strokeWidth={2.5} /> Sebelumnya
                        </Link>
                    ) : <div className="w-24 hidden md:block" />}
                </div>

                <div className="relative group">
                   {isReadyToComplete && !isCompleted && (
                     <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                   )}
                   
                   <button
                        onClick={handleComplete}
                        disabled={isCompleting || isCompleted || !isReadyToComplete}
                        className={`relative px-8 md:px-16 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-2xl
                        ${isReadyToComplete 
                            ? isCompleted 
                                ? "bg-emerald-500 text-white shadow-emerald-500/30 cursor-default" 
                                : "bg-slate-900 text-white border border-slate-800 ring-1 ring-white/20" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        }`}
                    >
                        {isCompleting ? (
                            <><Loader2 className="animate-spin" /> Menyimpan...</>
                        ) : isCompleted ? (
                            <><CheckCircle2 className="text-white" strokeWidth={3} /> Selesai</>
                        ) : isReadyToComplete ? (
                            <>Selesai & Simpan <CheckCircle2 className="text-white" strokeWidth={3} size={20} /></>
                        ) : (
                            <>Selesaikan Tugas <Zap size={16} /></>
                        )}
                    </button>
                </div>

                <div className="flex-1 flex justify-end">
                    {nextLesson && (
                        <Link href={`/learning/${courseId}/${moduleId}/${nextLesson.id}`} className="hidden md:flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 px-6 py-3 text-sm hover:bg-indigo-50 rounded-2xl">
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