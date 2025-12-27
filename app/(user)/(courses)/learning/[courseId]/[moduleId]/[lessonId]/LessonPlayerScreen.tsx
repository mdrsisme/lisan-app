"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, 
  Camera, FileText, Loader2, Zap, AlertCircle, PlayCircle 
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

type LessonType = 'video' | 'text' | 'camera_practice';

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  description: string | null;
  content_url: string | null;
  target_gesture: string | null;
  xp_reward: number;
  order_index: number;
}

interface LessonPlayerScreenProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export default function LessonPlayerScreen({ 
  courseId, moduleId, lessonId 
}: LessonPlayerScreenProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);

        const [lessonRes, listRes] = await Promise.all([
            api.get(`/lessons/${lessonId}`),
            api.get(`/lessons/published?module_id=${moduleId}&limit=100`)
        ]);

        if (!lessonRes.success) throw new Error("Gagal memuat materi.");
        setLesson(lessonRes.data);

        if (listRes.success) {
            setAllLessons(listRes.data.lessons);
        }

        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            const progressRes = await api.get(`/progress/${user.id}/${courseId}`);
            if (progressRes.success) {
                const completedIds = progressRes.data.completed_lessons.map((p: any) => p.lesson_id);
                if (completedIds.includes(lessonId)) {
                    setIsCompleted(true);
                }
            }
        }
        
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || "Terjadi kesalahan." });
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
        initData();
    }
  }, [lessonId, moduleId, courseId]);

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(userStr);

        const payload = {
            user_id: user.id,
            course_id: courseId,
            module_id: moduleId,
            lesson_id: lessonId,
            is_completed: true,
            last_position_seconds: 0
        };

        const res = await api.post('/progress', payload);

        if (res.success) {
            setIsCompleted(true);
            setNotification({ type: 'success', message: `Selamat! +${lesson?.xp_reward} XP` });
            
            if (nextLesson) {
                setTimeout(() => {
                    router.push(`/learning/${courseId}/${moduleId}/${nextLesson.id}`);
                }, 1500);
            } else {
                setTimeout(() => {
                    router.push(`/learning/${courseId}/${moduleId}`);
                }, 1500);
            }
        } else {
            throw new Error(res.message);
        }
    } catch (error: any) {
        setNotification({ type: 'error', message: "Gagal menyimpan progress." });
    } finally {
        setIsCompleting(false);
    }
  };

  const renderContent = () => {
    if (!lesson) return null;

    switch (lesson.type) {
        case 'video':
            return (
                <div className="w-full aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl relative ring-1 ring-slate-900/5 group">
                    {lesson.content_url ? (
                        <video 
                            src={lesson.content_url} 
                            controls 
                            className="w-full h-full object-contain"
                        >
                            Browser Anda tidak mendukung tag video.
                        </video>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-900">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                                <PlayCircle size={32} className="text-white/50" />
                            </div>
                            <p className="font-bold text-slate-400">Video tidak tersedia</p>
                        </div>
                    )}
                </div>
            );
        
        case 'camera_practice':
            return (
                <div className="w-full bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl p-2 ring-1 ring-slate-900/5">
                    <div className="aspect-video bg-slate-950 rounded-[1.5rem] flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col items-center p-6 text-center">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-slate-800 border border-slate-700">
                                <Camera size={40} className="text-indigo-400" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Area Praktek AI</h3>
                            <p className="text-slate-400 max-w-lg mb-8 leading-relaxed font-medium">
                                Sistem kami akan mendeteksi gerakan tangan Anda melalui kamera secara real-time. Pastikan pencahayaan cukup.
                            </p>
                            <div className="bg-white/10 text-white px-8 py-3 rounded-full font-bold border border-white/10 backdrop-blur-md shadow-lg">
                                Target Gerakan: <span className="text-indigo-300 uppercase tracking-widest ml-1">{lesson.target_gesture}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'text':
        default:
            return (
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 prose prose-slate prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: lesson.description || "<p>Tidak ada konten teks.</p>" }} />
                </div>
            );
    }
  };

  if (isLoading) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100/50" />
                <Loader2 className="animate-spin text-indigo-600 absolute inset-0 m-auto" size={40} />
            </div>
            <p className="text-slate-500 font-bold animate-pulse">Memuat materi...</p>
        </div>
      );
  }

  if (!lesson) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500">
                <AlertCircle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Materi Tidak Ditemukan</h1>
            <Link href={`/learning/${courseId}/${moduleId}`} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                Kembali ke Modul
            </Link>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 selection:bg-indigo-100 selection:text-indigo-900">
      <UserNavbar />
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
              <Link 
                  href={`/learning/${courseId}/${moduleId}`}
                  className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
              >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors border border-slate-200">
                    <ArrowLeft size={18} strokeWidth={2.5} />
                  </div>
                  <span className="hidden sm:inline">Daftar Materi</span>
              </Link>

              <div className="flex items-center gap-3">
                  <div className="px-5 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 rounded-full text-xs font-black border border-amber-100/50 flex items-center gap-1.5 shadow-sm uppercase tracking-widest">
                      <Zap size={14} className="fill-amber-500 text-amber-500" /> 
                      {lesson.xp_reward} XP
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                  {lesson.title}
              </h1>
              {lesson.type !== 'text' && (
                  <p className="text-slate-500 text-lg leading-relaxed max-w-3xl font-medium">
                      {lesson.description}
                  </p>
              )}
          </div>

          <div className="mb-12">
              {renderContent()}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 md:p-6 z-20 md:relative md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none">
            <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                
                <div className="w-full md:w-auto">
                    {prevLesson ? (
                        <Link 
                            href={`/learning/${courseId}/${moduleId}/${prevLesson.id}`}
                            className="flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors px-8 py-4 rounded-2xl hover:bg-white w-full md:w-auto md:hover:shadow-xl md:hover:shadow-indigo-500/5 border border-transparent hover:border-slate-100"
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} /> Sebelumnya
                        </Link>
                    ) : (
                        <div className="w-32 hidden md:block" />
                    )}
                </div>

                <button
                    onClick={handleComplete}
                    disabled={isCompleting || isCompleted}
                    className={`
                        relative w-full md:w-auto px-12 py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-xl
                        ${isCompleted 
                            ? "bg-emerald-500 text-white shadow-emerald-500/30 cursor-default ring-4 ring-emerald-500/20" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/40 hover:shadow-indigo-500/50"
                        }
                    `}
                >
                    {isCompleting ? (
                        <><Loader2 className="animate-spin" /> Menyimpan...</>
                    ) : isCompleted ? (
                        <><CheckCircle className="animate-bounce" strokeWidth={2.5} /> Materi Selesai</>
                    ) : (
                        <>
                            Selesai & Lanjut
                            <ChevronRight strokeWidth={3} size={20} />
                        </>
                    )}
                </button>

                <div className="w-full md:w-auto text-right hidden md:block">
                    {nextLesson && (
                        <Link 
                            href={`/learning/${courseId}/${moduleId}/${nextLesson.id}`}
                            className="inline-flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors px-6 py-3 text-sm hover:bg-indigo-50 rounded-xl"
                        >
                            Lewati <ChevronRight size={16} />
                        </Link>
                    )}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}