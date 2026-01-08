"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";

// Import komponen
import FlashcardView from "@/components/learning/FlashcardView";
import GestureTestView from "@/components/learning/GestureTestView";

// Interface item sesuai backend
interface DictionaryItem {
  id: string;
  dictionary_id: string;
  word: string;
  definition: string | null;
  video_url: string | null;
  image_url: string | null;
  item_type: 'flashcard' | 'gesture_test';
  target_gesture_data: string;
  ai_model_url?: string | null;
  status: string;
}

export default function ItemDetailScreen({ params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id: dictionaryId, itemId } = use(params);
  const router = useRouter();
  
  const [item, setItem] = useState<DictionaryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/dictionaries/${dictionaryId}/items`);
        if (res.success) {
            const found = res.data.find((i: DictionaryItem) => i.id === itemId);
            if (found) setItem(found);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [dictionaryId, itemId]);

  // --- FUNGSI UTAMA UNTUK UPDATE STREAK & PROGRESS ---
  const handleFinish = async () => {
    if (!item) return;
    
    setIsFinishing(true);
    try {
        // 1. HIT STREAK (Membuat/Update Data Streak)
        // Endpoint ini otomatis mengecek: jika data streak user belum ada -> Create. Jika ada -> Update.
        const streakRes = await api.post('/streaks/hit', {});
        
        if (streakRes.success) {
            console.log("Streak updated:", streakRes.data);
            // Opsional: Anda bisa memunculkan Toast/Alert "Streak +1 🔥" disini
        }

        // 2. SIMPAN PROGRESS ITEM (Menandai item ini sudah dipelajari)
        await api.post(`/dictionaries/items/${itemId}/progress`, {
            status: 'learned'
        });

        // 3. KEMBALI KE HALAMAN KAMUS
        router.push(`/dictionaries/${dictionaryId}`);
        
    } catch (error) {
        console.error("Gagal menyimpan progress:", error);
        // Tetap redirect agar user tidak stuck, meskipun ada error background
        router.push(`/dictionaries/${dictionaryId}`);
    } finally {
        setIsFinishing(false);
    }
  };

  if (loading) return (
    <UserLayout>
       <div className="h-[80vh] flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
       </div>
    </UserLayout>
  );

  if (!item) return (
    <UserLayout>
       <div className="h-[80vh] flex items-center justify-center bg-white text-slate-500">
          Materi tidak ditemukan
       </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col pb-20 md:pb-0">
          <div className="flex-1 relative">
              {item.item_type === 'gesture_test' ? (
                  <GestureTestView 
                      item={item} 
                      onFinish={handleFinish} // Fungsi ini dipanggil saat tombol trophy diklik
                      isFinishing={isFinishing} 
                      onClose={() => router.back()} 
                  />
              ) : (
                  <FlashcardView 
                      item={item} 
                      onStartPractice={() => alert("Gunakan menu praktik untuk menguji kemampuan isyarat Anda")} 
                      onFinish={handleFinish} 
                      isFinishing={isFinishing} 
                  />
              )}
          </div>
      </div>
    </UserLayout>
  );
}