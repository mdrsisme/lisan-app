import { FileText } from "lucide-react";

interface TextLessonProps {
  title: string;
  description: string | null;
}

export default function TextLesson({ title, description }: TextLessonProps) {
  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Decorative Header */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 to-teal-500" />
        
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <FileText size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Bacaan</span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mt-2">
              {title}
            </h1>
          </div>
        </div>

        {/* Content or Empty State */}
        {description ? (
          <div 
            className="prose prose-slate prose-lg max-w-none text-slate-600 leading-loose"
            dangerouslySetInnerHTML={{ __html: description }} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">Konten Kosong</h3>
            <p className="text-slate-400 font-medium text-sm mt-1">Belum ada materi bacaan yang ditulis.</p>
          </div>
        )}
      </div>
    </div>
  );
}