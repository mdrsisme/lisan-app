import Image from "next/image";
import { FileText } from "lucide-react";

interface TextLessonProps {
  title: string;
  description: string | null;
  contentUrl: string | null;
}

export default function TextLesson({ title, description, contentUrl }: TextLessonProps) {
  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {contentUrl && (
          <div className="relative w-full h-[280px] md:h-[380px] group bg-slate-100">
            <Image
              src={contentUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-6 left-6 md:left-10 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider mb-2 border border-white/30">
                    <FileText size={14} className="text-white" />
                    Materi Bacaan
                </div>
            </div>
          </div>
        )}

        <div className="p-8 md:p-12">
            {!contentUrl && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
                    <FileText size={14} />
                    Materi Bacaan
                </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-8">
                {title}
            </h1>

            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                <p className="italic text-slate-400">Tidak ada konten teks.</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}