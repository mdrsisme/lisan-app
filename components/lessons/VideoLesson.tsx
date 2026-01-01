import { PlayCircle, Video as VideoIcon } from "lucide-react";

interface VideoLessonProps {
  title: string;
  description: string | null;
  contentUrl: string | null;
}

export default function VideoLesson({ title, description, contentUrl }: VideoLessonProps) {
  
  const isYoutube = contentUrl && (contentUrl.includes("youtube.com") || contentUrl.includes("youtu.be"));

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/50 border border-slate-100">
        
        <div className="relative w-full aspect-video bg-slate-950 group">
          {contentUrl ? (
            isYoutube ? (
              <iframe
                src={contentUrl.replace("watch?v=", "embed/")}
                title={title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                src={contentUrl}
                controls 
                className="absolute inset-0 w-full h-full object-contain"
                poster="/images/video-placeholder.jpg"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
              <VideoIcon size={48} className="opacity-20" />
              <p>Video tidak tersedia</p>
            </div>
          )}
        </div>

        <div className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <PlayCircle className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-wider">Video Pembelajaran</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">{title}</h1>
          <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
            {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
                <p className="italic text-slate-400">Tidak ada deskripsi video.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}