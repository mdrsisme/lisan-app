"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, 
  PlayCircle, Camera, FileText, Loader2, Zap, AlertCircle 
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

// --- Tipe Data ---
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

export default function LessonPlayerPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }> 
}) {
  const { courseId, moduleId, lessonId } = use(params);
  const router = useRouter();

  // State Data
  const [isLoading, setIsLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]); // Untuk navigasi Next/Prev
  
  // State Aksi
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);

        // 1. Ambil Detail Lesson Saat Ini
        const lessonRes = await api.get(`/lessons/${lessonId}`);
        if (!lessonRes.success) throw new Error("Gagal memuat materi.");
        setLesson(lessonRes.data);

        // 2. Ambil Semua Lesson di Modul ini (Untuk menentukan Next/Prev)
        const listRes = await api.get(`/lessons/published?module_id=${moduleId}&limit=100`);
        if (listRes.success) {
            setAllLessons(listRes.data.lessons);
        }

        // 3. (Opsional) Cek apakah user sudah pernah menyelesaikan lesson ini
        // Bisa panggil endpoint /progress/detail jika perlu status awal
        
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || "Terjadi kesalahan." });
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
        initData();
    }
  }, [lessonId, moduleId]);

  // --- Logic Navigasi Next/Prev ---
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // --- Logic Selesaikan Pelajaran ---
  const handleComplete = async () => {
    setIsCompleting(true);
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(userStr);

        // Panggil API Backend (Trigger otomatis hitung % course)
        const payload = {
            user_id: user.id,
            course_id: courseId, // Penting untuk trigger DB
            module_id: moduleId,
            lesson_id: lessonId,
            is_completed: true,
            last_position_seconds: 0 // Bisa diupdate jika video player support tracking
        };

        const res = await api.post('/progress', payload);

        if (res.success) {
            setIsCompleted(true);
            setNotification({ type: 'success', message: `Selamat! +${lesson?.xp_reward} XP` });
            
            // Auto redirect ke next lesson setelah 1.5 detik
            if (nextLesson) {
                setTimeout(() => {
                    router.push(`/learning/${courseId}/${moduleId}/${nextLesson.id}`);
                }, 1500);
            } else {
                // Jika materi habis di modul ini
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

  // --- Render Konten Berdasarkan Tipe ---
  const renderContent = () => {
    if (!lesson) return null;

    switch (lesson.type) {
        case 'video':
            return (
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
                    {lesson.content_url ? (
                        <video 
                            src={lesson.content_url} 
                            controls 
                            className="w-full h-full object-contain"
                            poster="/video-poster-placeholder.png" // Opsional
                        >
                            Browser Anda tidak mendukung tag video.
                        </video>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <AlertCircle size={48} className="mb-2 opacity-50"/>
                            <p>Video tidak tersedia</p>
                        </div>
                    )}
                </div>
            );
        
        case 'camera_practice':
            return (
                <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-1 text-center relative">
                    <div className="aspect-video bg-slate-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-700">
                        <Camera size={64} className="text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Area Praktek Gesture AI</h3>
                        <p className="text-slate-400 max-w-md mx-auto mb-6">
                            Sistem akan mendeteksi gerakan tangan Anda melalui kamera.
                        </p>
                        <div className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold animate-pulse">
                            Target Gesture: "{lesson.target_gesture}"
                        </div>
                        <p className="text-xs text-slate-500 mt-4">*Fitur kamera akan diaktifkan pada implementasi ML.</p>
                    </div>
                </div>
            );

        case 'text':
        default:
            return (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm prose prose-slate max-w-none">
                    {/* Render HTML content jika ada, atau fallback description */}
                    <div dangerouslySetInnerHTML={{ __html: lesson.description || "<p>Tidak ada konten teks.</p>" }} />
                </div>
            );
    }
  };

  if (isLoading) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <UserNavbar />
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      {/* --- Top Navigation Bar --- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link 
                  href={`/learning/${courseId}/${moduleId}`}
                  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                  <ArrowLeft size={18} /> <span className="hidden sm:inline">Daftar Materi</span>
              </Link>

              <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                      <Zap size={12} fill="currentColor" /> {lesson.xp_reward} XP
                  </div>
              </div>
          </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Title Header */}
          <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">
                  {lesson.title}
              </h1>
              {lesson.type !== 'text' && (
                  <p className="text-slate-500 text-lg leading-relaxed">
                      {lesson.description}
                  </p>
              )}
          </div>

          {/* Dynamic Content Area (Video/Camera/Text) */}
          <div className="mb-10">
              {renderContent()}
          </div>

          {/* --- Action & Navigation Footer --- */}
          <div className="border-t border-slate-200 pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
              
              {/* Previous Button */}
              <div className="w-full md:w-auto">
                  {prevLesson ? (
                      <Link 
                          href={`/learning/${courseId}/${moduleId}/${prevLesson.id}`}
                          className="flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors px-4 py-3 rounded-xl hover:bg-slate-50 w-full md:w-auto"
                      >
                          <ChevronLeft size={20} /> Sebelumnya
                      </Link>
                  ) : (
                      <div className="w-24 hidden md:block" /> // Spacer
                  )}
              </div>

              {/* Complete Button */}
              <button
                  onClick={handleComplete}
                  disabled={isCompleting || isCompleted}
                  className={`
                      relative group w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl
                      ${isCompleted 
                          ? "bg-emerald-500 text-white shadow-emerald-500/30 cursor-default" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30"
                      }
                  `}
              >
                  {isCompleting ? (
                      <><Loader2 className="animate-spin" /> Menyimpan...</>
                  ) : isCompleted ? (
                      <><CheckCircle className="animate-bounce" /> Selesai!</>
                  ) : (
                      <>
                          Selesai & Lanjut
                          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                  )}
              </button>

              {/* Next Button (Ghost, only if already completed or skipping) */}
              <div className="w-full md:w-auto text-right">
                   {nextLesson && (
                      <Link 
                          href={`/learning/${courseId}/${moduleId}/${nextLesson.id}`}
                          className="hidden md:flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors px-4 py-3 text-sm"
                      >
                          Lewati <ChevronRight size={16} />
                      </Link>
                   )}
              </div>

          </div>
      </div>
    </div>
  );
}