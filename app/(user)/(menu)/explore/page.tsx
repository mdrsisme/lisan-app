"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, BookOpen, Clock, Star, Filter, ChevronRight, Users, PlayCircle 
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  category: string;
  level: string;
  price: number;
  total_lessons: number;
  duration: string;
  rating: number;
  students_count: number;
  author: {
    full_name: string;
    avatar_url: string | null;
  };
}

const CATEGORIES = ["Semua", "Bahasa Isyarat", "Teknologi", "Desain", "Bisnis", "Kesehatan"];

export default function ExplorePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      // Ganti endpoint ini sesuai backend Anda, misal: /courses?status=published
      const res = await api.get("/courses"); 
      
      if (res.success || res.data) {
        setCourses(res.data);
      } else {
        // Fallback data dummy jika API belum siap
        setCourses(DUMMY_COURSES);
      }
    } catch (error) {
      console.error("Gagal memuat kursus", error);
      setCourses(DUMMY_COURSES);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };
  return (
    <div className="min-h-screen bg-[#f8faff] font-sans">
      <UserNavbar />
      
      {isLoading && <LoadingSpinner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-12 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
          
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ilmu Baru</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Temukan kursus terbaik untuk meningkatkan keahlian Anda. Mulai belajar hari ini dan buka potensi tanpa batas.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-lg shadow-slate-200/50 outline-none font-medium"
              placeholder="Cari kursus apa hari ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border
                  ${selectedCategory === cat 
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 transform -translate-y-0.5" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- DUMMY DATA (Untuk Testing Visual) ---
const DUMMY_COURSES: Course[] = [
  {
    id: "1",
    title: "Dasar Bahasa Isyarat Indonesia (BISINDO)",
    description: "Pelajari dasar-dasar komunikasi inklusif dengan BISINDO untuk pemula. Mulai dari abjad hingga percakapan sehari-hari.",
    thumbnail_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    category: "Bahasa Isyarat",
    level: "Pemula",
    price: 0,
    total_lessons: 12,
    duration: "4 Jam",
    rating: 4.8,
    students_count: 120,
    author: { full_name: "Sarah Wijaya", avatar_url: null }
  },
  {
    id: "2",
    title: "Web Development dengan Next.js 14",
    description: "Bangun aplikasi web modern yang cepat dan scalable menggunakan framework React paling populer.",
    thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    category: "Teknologi",
    level: "Menengah",
    price: 150000,
    total_lessons: 24,
    duration: "12 Jam",
    rating: 4.9,
    students_count: 85,
    author: { full_name: "Budi Santoso", avatar_url: null }
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Kuasai Figma dan prinsip desain antarmuka untuk menciptakan pengalaman pengguna yang memukau.",
    thumbnail_url: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=600&auto=format&fit=crop",
    category: "Desain",
    level: "Pemula",
    price: 200000,
    total_lessons: 18,
    duration: "8 Jam",
    rating: 4.7,
    students_count: 200,
    author: { full_name: "Jessica Lin", avatar_url: null }
  },
  {
    id: "4",
    title: "Digital Marketing Strategy 2025",
    description: "Strategi pemasaran digital komprehensif untuk mengembangkan bisnis Anda di era modern.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    category: "Bisnis",
    level: "Lanjut",
    price: 99000,
    total_lessons: 15,
    duration: "6 Jam",
    rating: 4.6,
    students_count: 50,
    author: { full_name: "Andi Pratama", avatar_url: null }
  }
];