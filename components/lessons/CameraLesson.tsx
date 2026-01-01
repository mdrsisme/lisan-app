import { Camera, MonitorPlay, EyeOff, Hand, ScanFace } from "lucide-react";

interface CameraLessonProps {
  targetGesture: string | null;
}

export default function CameraLesson({ targetGesture }: CameraLessonProps) {
  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0F172A] rounded-[3rem] p-4 shadow-2xl ring-1 ring-white/10 relative overflow-hidden">
        
        {/* Viewfinder Area */}
        <div className="aspect-[4/3] md:aspect-video bg-black rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center group">
          
          {/* Simulation Overlay Effects */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
          <div className="absolute inset-4 border-[2px] border-white/20 rounded-[2rem] pointer-events-none border-dashed" />
          <ScanFace className="absolute top-8 right-8 text-white/20 w-8 h-8 animate-pulse" />
          
          {/* Live Badge */}
          <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
            <div className="bg-black/40 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
              AI CAMERA ACTIVE
            </div>
          </div>

          {/* Main Content Center */}
          <div className="relative z-10 flex flex-col items-center text-center p-6">
            <div className="w-24 h-24 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700 backdrop-blur-sm shadow-xl">
              <Camera size={40} className="text-indigo-400" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Area Praktek</h2>
            <p className="text-slate-400 max-w-md mb-8 font-medium leading-relaxed">
              Arahkan kamera ke tangan Anda. AI kami akan mendeteksi gerakan secara real-time.
            </p>

            {targetGesture ? (
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Target Gerakan</span>
                <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-sm">
                  {targetGesture}
                </div>
              </div>
            ) : (
              // EMPTY STATE GESTURE
              <div className="bg-rose-500/10 text-rose-300 px-6 py-3 rounded-2xl text-sm border border-rose-500/20 font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                Target gerakan belum diatur.
              </div>
            )}
          </div>

          {/* Fake Camera Controls */}
          <div className="absolute bottom-8 w-full px-12 flex justify-between items-center z-20">
            <button className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md">
              <MonitorPlay size={24} />
            </button>
            <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
            </div>
            <button className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md">
              <EyeOff size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-6 text-center">
        <p className="text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
          <Hand size={16} className="text-indigo-500" />
          Pastikan tangan terlihat jelas di kamera.
        </p>
      </div>
    </div>
  );
}

// Helper icon for empty state
import { AlertCircle } from "lucide-react";