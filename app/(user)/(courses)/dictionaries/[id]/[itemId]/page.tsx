"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";

// Import komponen
import FlashcardView from "@/components/learning/FlashcardView";
import GestureTestView from "@/components/learning/GestureTestView";

type ViewMode = 'flashcard' | 'gesture_test';

export default function ItemDetailScreen({ params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id: dictionaryId, itemId } = use(params);
  const router = useRouter();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('flashcard'); 
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/dictionaries/${dictionaryId}/items`);
        if (res.success) {
            const found = res.data.find((i: any) => i.id === itemId);
            if (found) {
                setItem(found);
            }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [dictionaryId, itemId]);

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
        await api.post('/streaks/hit', {});
        await api.post('/learning/submit', {
            dictionary_item_id: itemId,
            quiz_type: viewMode === 'gesture_test' ? 'gesture_test' : 'flashcard',
            is_correct: true 
        });
        router.push(`/dictionaries/${dictionaryId}`);
    } catch (error) {
        console.error("Gagal menyimpan progress:", error);
        router.push(`/dictionaries/${dictionaryId}`);
    }
  };

  if (loading) return (
    <UserLayout>
       <div className="h-[80vh] flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-indigo-600" />
       </div>
    </UserLayout>
  );

  if (!item) return (
    <UserLayout>
       <div className="h-[80vh] flex items-center justify-center bg-white text-slate-500">
          Item tidak ditemukan
       </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col pb-20 md:pb-0">
          
          {/* Header Navigation - TOMBOL BACK DIHAPUS */}
          <div className="px-6 py-4 flex items-center justify-center border-b border-slate-100 z-40 bg-white/80 backdrop-blur-md sticky top-0">
              
              {/* Mode Switcher */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
                  <button 
                      onClick={() => setViewMode('flashcard')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'flashcard' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      Belajar
                  </button>
                  <button 
                      onClick={() => setViewMode('gesture_test')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'gesture_test' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      Uji Gerakan
                  </button>
              </div>
          </div>

          <div className="flex-1 relative">
              {viewMode === 'flashcard' ? (
                  <FlashcardView 
                      item={item} 
                      onStartPractice={() => setViewMode('gesture_test')} 
                      onFinish={handleFinish} 
                      isFinishing={isFinishing} 
                  />
              ) : (
                  <GestureTestView 
                      item={item} 
                      onFinish={handleFinish} 
                      isFinishing={isFinishing} 
                      onClose={() => setViewMode('flashcard')} 
                  />
              )}
          </div>
      </div>
    </UserLayout>
  );
}