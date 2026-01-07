"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { api } from "@/lib/api";
import { 
  BrainCircuit, Plus, Search, Trash2, X, Check, Loader2, Server, 
  Terminal, Sparkles, Cpu 
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface AiModel {
  id: string;
  name: string;
  provider: string;
  model_url: string;
  config: any;
  created_at: string;
}

export default function AiModelsPage() {
  const [models, setModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "mediapipe",
    model_url: "",
    configString: '{\n  "max_hands": 1,\n  "min_detection_confidence": 0.8\n}'
  });
  const [jsonError, setJsonError] = useState("");

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ai-models");
      if (res.success) setModels(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError("");
    setIsSubmitting(true);

    try {
      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(formData.configString);
      } catch (e) {
        throw new Error("Invalid JSON format.");
      }

      const res = await api.post("/ai-models", {
        name: formData.name,
        provider: formData.provider,
        model_url: formData.model_url,
        config: parsedConfig
      });

      if (res.success) {
        await fetchModels();
        setIsModalOpen(false);
        setFormData({
            name: "",
            provider: "mediapipe",
            model_url: "",
            configString: '{\n  "max_hands": 1,\n  "min_detection_confidence": 0.8\n}'
        });
      }
    } catch (err: any) {
      setJsonError(err.message || "Failed to create model.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this AI model? Items using it might break.")) return;
    try {
      await api.delete(`/ai-models/${id}`);
      setModels(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-6 relative">
        
        <div className="flex items-center justify-between gap-4 mb-6 pt-4">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <BrainCircuit size={28} className="text-indigo-600" />
                    AI Models
                </h1>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                New Model
            </button>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm p-3 flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center gap-3 shrink-0 w-full md:w-auto">
                <div className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-600"><Sparkles size={16} /></div>
                <div className="flex items-baseline gap-2">
                     <p className="text-xl font-black text-indigo-900 leading-none">{models.length}</p>
                     <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider leading-none">Active Engines</p>
                </div>
            </div>

            <div className="relative flex-1 w-full group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search models..." 
                    className="w-full bg-slate-50 border-none outline-none pl-11 pr-4 py-3 rounded-xl text-slate-700 font-bold text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="animate-spin text-indigo-600 mb-3" size={32} />
                <p className="text-slate-400 font-bold text-sm animate-pulse">Loading Engines...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredModels.map((model) => (
                    <div key={model.id} className="group relative bg-white rounded-[2rem] border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:border-indigo-200/60">
                        
                        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90" />

                        <div className="p-5">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm">
                                        <Cpu size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">{model.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-bold uppercase tracking-wide border border-slate-200">
                                                {model.provider}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {format(new Date(model.created_at), 'dd MMM yyyy', { locale: idLocale })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleDelete(model.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs">
                                <div className="flex items-center gap-2 truncate">
                                    <Server size={14} className="text-slate-400 shrink-0" />
                                     <code className="font-mono text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-md border border-indigo-100 truncate flex-1 text-[11px]">
                                        {model.model_url}
                                    </code>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                    <Terminal size={14} className="text-slate-400 shrink-0 mt-1" />
                                    <pre className="font-mono text-slate-500 bg-white px-2 py-2 rounded-lg border border-slate-100 overflow-x-auto custom-scrollbar w-full text-[10px] leading-relaxed shadow-sm">
                                        {JSON.stringify(model.config, null, 2)}
                                    </pre>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        )}

        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-10 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-10 duration-500 relative ring-1 ring-slate-900/5">
                    
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                <Plus size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800 leading-tight">New AI Model</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engine Configuration</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-full transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
                        <form onSubmit={handleCreate} className="space-y-5">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1">Model Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g., HandPose v2"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold text-slate-800 transition-all outline-none text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1">Provider</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold text-slate-800 transition-all outline-none appearance-none cursor-pointer text-sm"
                                            value={formData.provider}
                                            onChange={(e) => setFormData({...formData, provider: e.target.value})}
                                        >
                                            <option value="mediapipe">MediaPipe (Google)</option>
                                            <option value="tensorflow">TensorFlow.js</option>
                                            <option value="custom">Custom API</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1">Model URL / Path</label>
                                <div className="relative group">
                                    <Server size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="https://storage.googleapis.com/models/hand_landmarker.task"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-medium text-slate-800 transition-all outline-none font-mono text-xs"
                                        value={formData.model_url}
                                        onChange={(e) => setFormData({...formData, model_url: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1 flex justify-between items-center">
                                    <span>Config (JSON)</span>
                                    {jsonError && <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md font-bold">{jsonError}</span>}
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-800 rounded-l-xl flex items-center justify-center border-r border-slate-700/50">
                                         <Terminal size={16} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <textarea 
                                        rows={6}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs outline-none border-2 transition-all resize-none leading-relaxed shadow-inner ${jsonError ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/50'}`}
                                        value={formData.configString}
                                        onChange={(e) => setFormData({...formData, configString: e.target.value})}
                                        spellCheck={false}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 px-1 font-medium">
                                    Must be valid JSON specifying detection parameters.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black text-base hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} strokeWidth={3} />}
                                    {isSubmitting ? "Saving..." : "Save Model"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        )}

      </div>
    </AdminLayout>
  );
}