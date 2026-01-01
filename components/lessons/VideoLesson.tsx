import { Video, PlayCircle } from "lucide-react";

interface VideoLessonProps {
  title: string;
  description: string | null;
  contentUrl: string | null;
}

export default function VideoLesson({ title, description, contentUrl }: VideoLessonProps) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Video Container */}
      <div className="aspect-video w-full bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-800 group ring-1 ring-white/10">
        {contentUrl ? (
          <video 
            src={contentUrl} 
            controls 
            className="w-full h-full object-contain"
            poster="/video-placeholder.jpg" // Opsional
          />
        ) : (
          // EMPTY STATE
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900/80 backdrop-blur-sm">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
              <Video size={32} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">Video Belum Tersedia</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-xs text-center">
              Instruktur belum mengunggah materi video untuk pelajaran ini.
            </p>
          </div>
        )}
      </div>
      
      {/* Description Box */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">{title}</h1>
        <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed" 
             dangerouslySetInnerHTML={{ __html: description || "<p>Tidak ada deskripsi tambahan.</p>" }} 
        />
      </div>
    </div>
  );
}