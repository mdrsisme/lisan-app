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

        {/* Title Section */}
        <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl text-white shadow-xl shadow-indigo-200 flex items-center justify-center transform -rotate-3">
                <FileText size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Materi</h1>
                <p className="text-slate-500 font-medium mt-1">Kelola konten pembelajaran dan integrasi AI.</p>
            </div>
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

            {/* COLUMN 2: AI CONFIGURATION (1/3 width) */}
            <div className="xl:col-span-1 space-y-8">
                
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 relative overflow-hidden text-white">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                        <BrainCircuit size={20} className="text-indigo-400" /> Integrasi AI
                    </h3>

                    <div className="space-y-6 relative z-10">
                        
                        {/* AI Model Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Pilih Model AI</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select 
                                        className="w-full px-4 py-3.5 bg-white/10 border border-white/10 focus:border-indigo-500 focus:bg-slate-800 rounded-xl font-bold text-white transition-all outline-none appearance-none cursor-pointer text-sm"
                                        value={formData.ai_model_id}
                                        onChange={e => setFormData({...formData, ai_model_id: e.target.value})}
                                    >
                                        <option value="" className="bg-slate-900">-- Non-AI --</option>
                                        {aiModels.map((model) => (
                                            <option key={model.id} value={model.id} className="bg-slate-900">
                                                {model.name || `Model: ${model.id.substring(0,6)}...`}
                                            </option>
                                        ))}
                                    </select>
                                    <ScanFace className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setShowCreateModel(true)}
                                    className="p-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors shadow-lg shadow-indigo-500/20"
                                    title="Buat Model Baru"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* JSON Editor */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Target Data (JSON)</label>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isJsonValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {isJsonValid ? "Valid JSON" : "Invalid JSON"}
                                </span>
                            </div>
                            <textarea 
                                rows={10}
                                className={`w-full px-4 py-4 bg-black/30 font-mono text-xs rounded-2xl border-2 outline-none resize-none transition-all ${isJsonValid ? 'border-transparent focus:border-indigo-500' : 'border-rose-500/50 focus:border-rose-500'}`}
                                placeholder='{"landmarks": ...}'
                                value={formData.target_gesture_data}
                                onChange={e => handleJsonChange(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-400 leading-relaxed px-1">
                                Koordinat referensi untuk validasi gerakan. Format harus JSON valid.
                            </p>
                        </div>

                        {/* Save Button Sticky on Mobile / Bottom on Desktop */}
                        <button 
                            type="submit" 
                            disabled={isSaving || !isJsonValid}
                            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 mt-4"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </div>

            </div>
        </form>

        {/* --- MODAL CREATE AI MODEL --- */}
        {showCreateModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-md p-6 rounded-[2rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                    <button 
                        onClick={() => setShowCreateModel(false)}
                        className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                    
                    <h3 className="text-xl font-black text-slate-800 mb-1">Tambah Model AI</h3>
                    <p className="text-slate-500 text-sm mb-6">Masukkan URL endpoint model baru.</p>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Model URL</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                                placeholder="https://models.example.com/handpose/v1"
                                value={newModelUrl}
                                onChange={e => setNewModelUrl(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleCreateAiModel}
                            disabled={isCreatingModel || !newModelUrl}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isCreatingModel ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                            Buat Model
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </AdminLayout>
  );
}