"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layouts/AdminLayout";
import { api } from "@/lib/api";
import { 
  ArrowLeft, Save, Trash2, Video, FileText, 
  BrainCircuit, ScanFace, Loader2, AlertCircle, 
  Plus, X, CheckCircle2 
} from "lucide-react";
import Link from "next/link";

interface AiModel {
  id: string;
  name?: string;
  model_url: string;
}

export default function EditDictionaryItemPage({ params }: { params: Promise<{ id: string, itemId: string }> }) {
  const { id: dictionaryId, itemId } = use(params);
  const router = useRouter();

  // State Utama
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Data Lists
  const [aiModels, setAiModels] = useState<AiModel[]>([]);

  // State Modal Create AI Model
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [newModelUrl, setNewModelUrl] = useState("");
  const [isCreatingModel, setIsCreatingModel] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    word: "",
    definition: "",
    video_url: "",
    image_url: "",
    item_type: "flashcard",
    ai_model_id: "",
    target_gesture_data: "{}" 
  });

  // Validasi JSON Gesture Data (Realtime)
  const [isJsonValid, setIsJsonValid] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const [itemRes, modelsRes] = await Promise.all([
            api.get(`/dictionaries/${dictionaryId}/items`),
            api.get(`/ai-models`)
        ]);

        if (itemRes.success) {
           const foundItem = itemRes.data.find((i: any) => i.id === itemId);
           if (foundItem) {
             setFormData({
               word: foundItem.word || "",
               definition: foundItem.definition || "",
               video_url: foundItem.video_url || "",
               image_url: foundItem.image_url || "",
               item_type: foundItem.item_type || "flashcard",
               ai_model_id: foundItem.ai_model_id || "",
               target_gesture_data: foundItem.target_gesture_data || "{}"
             });
           } else {
             setError("Item tidak ditemukan");
           }
        }

        if (modelsRes.success) setAiModels(modelsRes.data);

      } catch (err) {
        console.error(err);
        setError("Gagal memuat data.");
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [dictionaryId, itemId]);

  // Handler: Validasi JSON
  const handleJsonChange = (val: string) => {
    setFormData({...formData, target_gesture_data: val});
    try {
        JSON.parse(val);
        setIsJsonValid(true);
    } catch {
        setIsJsonValid(false);
    }
  };

  // Handler: Save Item
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isJsonValid) {
        setError("Format JSON Target Gesture tidak valid.");
        return;
    }
    setIsSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.put(`/dictionary-items/${itemId}`, {
        ...formData,
        dictionary_id: dictionaryId
      });

      if (res.success) {
        setSuccessMsg("Berhasil menyimpan perubahan!");
        setTimeout(() => {
            router.push(`/admin/dictionaries/${dictionaryId}`);
            router.refresh();
        }, 1500);
      } else {
        throw new Error(res.message || "Gagal menyimpan.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Create New AI Model
  const handleCreateAiModel = async () => {
    if (!newModelUrl) return;
    setIsCreatingModel(true);
    try {
        // Asumsi endpoint POST /ai-models
        const res = await api.post('/ai-models', { 
            model_url: newModelUrl,
            config: {} // Default empty config
        });

        if (res.success) {
            // Update list model dan auto-select model baru
            setAiModels(prev => [res.data, ...prev]);
            setFormData(prev => ({ ...prev, ai_model_id: res.data.id }));
            setShowCreateModel(false);
            setNewModelUrl("");
        }
    } catch (err) {
        alert("Gagal membuat model AI baru");
    } finally {
        setIsCreatingModel(false);
    }
  };

  // Handler: Delete Item
  const handleDelete = async () => {
    if(!confirm("Yakin ingin menghapus item ini?")) return;
    try {
        await api.delete(`/dictionary-items/${itemId}`);
        router.push(`/admin/dictionaries/${dictionaryId}`);
        router.refresh();
    } catch (e) {
        alert("Gagal menghapus item");
    }
  };

  if (isLoading) {
    return (
        <AdminLayout>
            <div className="flex h-[80vh] items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-indigo-600" size={48} />
                    <span className="text-slate-400 font-bold animate-pulse">Memuat data...</span>
                </div>
            </div>
        </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
        
        {/* Header Navigasi */}
        <div className="flex items-center justify-between mb-8 py-4">
            <Link 
                href={`/admin/dictionaries/${dictionaryId}`} 
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm"
            >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all">
                    <ArrowLeft size={16} className="group-hover:text-indigo-600" />
                </div>
                <span>Kembali ke List</span>
            </Link>
            
            <button 
                onClick={handleDelete}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
                <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> Hapus Item
            </button>
        </div>

        {/* Alert Messages */}
        {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} /> {error}
            </div>
        )}
        {successMsg && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={20} /> {successMsg}
            </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* COLUMN 1: MAIN INFO & VIDEO (2/3 width) */}
            <div className="xl:col-span-2 space-y-8">
                
                {/* Info Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-indigo-100 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110" />
                    
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><FileText size={16} /></span>
                        Informasi Dasar
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Judul Materi</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-800 transition-all outline-none"
                                placeholder="Contoh: Makan"
                                value={formData.word}
                                onChange={e => setFormData({...formData, word: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Tipe Materi</label>
                            <div className="relative">
                                <select 
                                    className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                                    value={formData.item_type}
                                    onChange={e => setFormData({...formData, item_type: e.target.value})}
                                >
                                    <option value="flashcard">🎥 Flashcard (Video)</option>
                                    <option value="gesture_test">🤖 Gesture Test (AI)</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                            </div>
                        </div>

                        <div className="col-span-full space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Definisi</label>
                            <textarea 
                                rows={4}
                                className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-medium text-slate-800 transition-all outline-none resize-none"
                                placeholder="Deskripsikan gerakan atau arti kata ini..."
                                value={formData.definition}
                                onChange={e => setFormData({...formData, definition: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Media Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-rose-100 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110" />

                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                        <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600"><Video size={16} /></span>
                        Media Visual
                    </h3>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">URL Video</label>
                            <input 
                                type="url" 
                                className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-2xl font-medium text-slate-800 transition-all outline-none"
                                placeholder="https://example.com/video.mp4"
                                value={formData.video_url}
                                onChange={e => setFormData({...formData, video_url: e.target.value})}
                            />
                        </div>
                        
                        {/* Video Preview */}
                        <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border-4 border-white shadow-lg relative group/video">
                            {formData.video_url ? (
                                <video src={formData.video_url} controls className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                                    <Video size={48} className="mb-2 opacity-50" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Preview Video</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>

      </div>
    </AdminLayout>
  );
}