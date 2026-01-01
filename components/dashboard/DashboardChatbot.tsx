"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, MessageCircle, Send, User as UserIcon, X } from "lucide-react";
import { ChatMessage } from "@/types";

export default function DashboardChatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '1', text: 'Halo! Ada yang bisa dibantu?', sender: 'bot', timestamp: new Date() }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isChatOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(p => [...p, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
        const botMsg: ChatMessage = { id: (Date.now()+1).toString(), text: "Maaf, saya masih dalam tahap pengembangan.", sender: 'bot', timestamp: new Date() };
        setMessages(p => [...p, botMsg]);
        setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isChatOpen && (
        <div className="w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
           <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20"><Bot size={20} className="text-white" /></div>
                 <div><h3 className="text-white font-bold text-sm">LISAN Assistant</h3><p className="text-indigo-200 text-[10px] font-medium">Online</p></div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><X size={18} /></button>
           </div>
           
           <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                 <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${m.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-violet-600'}`}>{m.sender === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}</div>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs font-medium ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'}`}>{m.text}</div>
                 </div>
              ))}
              {isTyping && <div className="text-xs text-slate-400 ml-12">Sedang mengetik...</div>}
              <div ref={endRef} />
           </div>

           <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis pesan..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-700" />
              <button type="submit" disabled={!input.trim()} className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center"><Send size={14} /></button>
           </form>
        </div>
      )}
      <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50 ${isChatOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white'}`}>
         {isChatOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}