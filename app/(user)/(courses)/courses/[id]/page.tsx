"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Clock, BarChart, Globe, Award, PlayCircle, 
  CheckCircle, Lock, Share2, AlertCircle
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";

export default function CourseEnrollmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setIsLoading(true);
        // Simulasi fetch data API
        // const res = await api.get(`/courses/${params.id}`);
        // setCourse(res.data);
        
        // Menggunakan Dummy Data agar tampilan langsung terlihat bagus
        setTimeout(() => {
            setCourse(DUMMY_COURSE_DETAIL);
            setIsLoading(false);
        }, 1000);

      } catch (error) {
        console.error(error);
      }
    };

    fetchCourseDetail();
  }, [params.id]);

  const handleEnroll = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        router.push("/login");
        return;
    }

    setIsEnrolling(true);
    
    // Simulasi proses enroll
    setTimeout(() => {
        setIsEnrolling(false);
        // Arahkan ke dashboard belajar atau halaman sukses
        alert("Berhasil mendaftar! Mengarahkan ke kelas...");
        router.push(`/learning/${params.id}`);
    }, 1500);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-[#f8faff] font-sans pb-20">
      <UserNavbar />

      {/* --- HEADER SECTION --- */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <Link href="/explore" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold">
                <ArrowLeft size={16} /> Kembali ke Explore
            </Link>

            <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
                    {course.title}
                </h1>
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    {course.short_description}
                </p>

                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm font-medium text-slate-300">
                    <div className="flex items-center gap-2">
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-bold border border-amber-500/30">
                            Bestseller
                        </span>
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                            ★ {course.rating}
                        </span>
                        <span className="text-slate-500">({course.reviews_count} rating)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={16} /> Bahasa Indonesia
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} /> Terakhir update {course.updated_at}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            
            {/* --- LEFT COLUMN (CONTENT) --- */}
            <div className="space-y-8">
                
                {/* What you'll learn */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Apa yang akan Anda pelajari</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.learning_points.map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                                <span className="text-sm font-medium text-slate-600 leading-relaxed">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Content / Curriculum */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Konten Kursus</h3>
                        <span className="text-sm font-bold text-slate-500">
                            {course.total_lessons} Pelajaran • {course.duration} Total Durasi
                        </span>
                    </div>

                    <div className="space-y-3">
                        {course.curriculum.map((section: any, idx: number) => (
                            <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                                    <h4 className="font-bold text-slate-800 text-sm">{section.title}</h4>
                                    <span className="text-xs font-bold text-slate-400">{section.lessons.length} video</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {section.lessons.map((lesson: any, lIdx: number) => (
                                        <div key={lIdx} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                {lesson.is_free ? (
                                                    <PlayCircle size={16} className="text-indigo-600" />
                                                ) : (
                                                    <Lock size={16} className="text-slate-300" />
                                                )}
                                                <span className={`text-sm font-medium ${lesson.is_free ? 'text-indigo-600 underline decoration-indigo-200' : 'text-slate-600'}`}>
                                                    {lesson.title}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium">{lesson.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-4">Deskripsi</h3>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-loose">
                        <p>{course.full_description}</p>
                    </div>
                </div>

                {/* Instructor */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Instruktur</h3>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <Image 
                                src={course.author.avatar_url} 
                                alt={course.author.name} 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-800">{course.author.name}</h4>
                            <p className="text-sm font-bold text-indigo-600 mb-3">{course.author.title}</p>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4">
                                <span className="flex items-center gap-1"><Award size={14} /> {course.author.reviews} Reviews</span>
                                <span className="flex items-center gap-1"><PlayCircle size={14} /> {course.author.courses} Kursus</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {course.author.bio}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- RIGHT COLUMN (STICKY CARD) --- */}
            <div className="lg:relative">
                <div className="sticky top-24 space-y-6">
                    
                    {/* Card Pembelian */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        {/* Thumbnail Video Preview */}
                        <div className="relative h-48 w-full bg-slate-900 group cursor-pointer">
                            <Image 
                                src={course.thumbnail_url} 
                                alt={course.title} 
                                fill 
                                className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlayCircle size={32} className="text-white fill-white/20" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <span className="text-white font-bold text-sm drop-shadow-md">Pratinjau Kursus ini</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-end gap-3 mb-6">
                                <h2 className="text-3xl font-black text-slate-900">
                                    {course.price === 0 ? "Gratis" : `Rp ${new Intl.NumberFormat('id-ID').format(course.price)}`}
                                </h2>
                                {course.price > 0 && (
                                    <span className="text-sm text-slate-400 line-through font-medium mb-1.5">
                                        Rp {new Intl.NumberFormat('id-ID').format(course.price * 1.5)}
                                    </span>
                                )}
                            </div>

                            <button 
                                onClick={handleEnroll}
                                disabled={isEnrolling}
                                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all mb-4 flex items-center justify-center gap-2"
                            >
                                {isEnrolling ? "Memproses..." : (course.price === 0 ? "Daftar Sekarang" : "Beli Sekarang")}
                            </button>

                            <p className="text-xs text-slate-500 text-center mb-6 font-medium">Jaminan 30-hari uang kembali</p>

                            <div className="space-y-4">
                                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Kursus ini mencakup:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <PlayCircle size={16} className="text-slate-400" /> {course.duration} on-demand video
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <Lock size={16} className="text-slate-400" /> Akses seumur hidup penuh
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <Award size={16} className="text-slate-400" /> Sertifikat penyelesaian
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                <button className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Bagikan</button>
                                <button className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Gift Course</button>
                            </div>
                        </div>
                    </div>

                    {/* Card Business (Optional) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Training 5 orang atau lebih?</h4>
                        <p className="text-xs text-slate-500 mb-3">Dapatkan akses tim ke 5,000+ kursus top kapan saja.</p>
                        <button className="w-full py-2.5 rounded-lg border border-slate-900 text-slate-900 font-bold text-xs hover:bg-slate-50 transition-colors">
                            LISAN for Business
                        </button>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

// --- DUMMY DATA ---
const DUMMY_COURSE_DETAIL = {
    id: "1",
    title: "Web Development dengan Next.js 14: Dari Nol sampai Mahir",
    short_description: "Bangun aplikasi web modern yang cepat, scalable, dan SEO-friendly menggunakan framework React paling populer saat ini.",
    full_description: "Dalam kursus ini, Anda akan mempelajari segala hal yang dibutuhkan untuk menjadi pengembang Next.js yang handal. Dimulai dari konsep dasar React, Server Components, Routing, hingga deployment ke Vercel. Cocok untuk pemula yang sudah paham dasar HTML/CSS/JS.",
    thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    price: 150000,
    rating: 4.8,
    reviews_count: 452,
    updated_at: "Desember 2025",
    total_lessons: 24,
    duration: "12 Jam",
    learning_points: [
        "Memahami App Router di Next.js 14",
        "Menggunakan Server Actions untuk mutasi data",
        "Integrasi dengan Database (Supabase/Prisma)",
        "Optimasi gambar dan font secara otomatis",
        "Autentikasi user dengan NextAuth",
        "Deployment aplikasi ke production"
    ],
    curriculum: [
        {
            title: "Pengenalan Next.js",
            lessons: [
                { title: "Apa itu Next.js?", duration: "05:00", is_free: true },
                { title: "Setup Project Pertama", duration: "10:00", is_free: true },
                { title: "Struktur Folder App Router", duration: "15:00", is_free: false }
            ]
        },
        {
            title: "Routing & Navigation",
            lessons: [
                { title: "Pages & Layouts", duration: "12:00", is_free: false },
                { title: "Dynamic Routes", duration: "18:00", is_free: false },
                { title: "Loading UI & Streaming", duration: "14:00", is_free: false }
            ]
        }
    ],
    author: {
        name: "Budi Santoso",
        title: "Senior Frontend Engineer",
        avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        students: "12,400",
        reviews: "3,200",
        courses: "8",
        bio: "Budi adalah seorang engineer berpengalaman dengan lebih dari 10 tahun di industri teknologi. Ia bersemangat membagikan ilmunya tentang web development modern."
    }
};