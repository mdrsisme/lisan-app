"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";

// Import komponen
import FlashcardView from "@/components/learning/FlashcardView";
import GestureTestView from "@/components/learning/GestureTestView";

export default function ItemDetailScreen({ params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id: dictionaryId, itemId } = use(params);
  const router = useRouter();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
            quiz_type: item.item_type, // Menggunakan tipe asli dari item
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

          <div className="flex-1 relative">
              {item.item_type === 'gesture_test' ? (
                  <GestureTestView 
                      item={item} 
                      onFinish={handleFinish} 
                      isFinishing={isFinishing} 
                      onClose={() => router.back()} 
                  />
              ) : (
                  <FlashcardView 
                      item={item} 
                      onStartPractice={() => alert("Fitur praktik hanya untuk tipe Gesture Test")} 
                      onFinish={handleFinish} 
                      isFinishing={isFinishing} 
                  />
              )}
          </div>
      </div>
    </UserLayout>
  );
}