"use client";

import { useState } from "react";
import { 
  ChevronDown, ChevronRight, Copy, Check, 
  Server, Globe, Code 
} from "lucide-react";

// --- UTILS & TYPES ---

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface JsonBlockProps {
  label?: string;
  json: object | string;
}

interface ApiEndpointProps {
  method: Method;
  path: string;
  title: string;
  description?: string;
  requestBody?: object;
  responseBody?: object;
}

interface ApiGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}

// Helper warna method
const getMethodStyles = (method: Method) => {
  switch (method) {
    case "GET": return "bg-blue-100 text-blue-700 border-blue-200";
    case "POST": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "PUT": return "bg-amber-100 text-amber-700 border-amber-200";
    case "DELETE": return "bg-rose-100 text-rose-700 border-rose-200";
    case "PATCH": return "bg-purple-100 text-purple-700 border-purple-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

// --- COMPONENT 1: JSON CODE BLOCK (Bisa Copy) ---
export const JsonBlock = ({ label, json }: JsonBlockProps) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(json, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3">
      {label && <div className="text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</div>}
      <div className="relative group rounded-xl bg-[#1e293b] border border-slate-700 overflow-hidden">
        {/* Header Mac-OS style dots */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
          <span className="text-[10px] font-mono text-slate-500">json</span>
        </div>

        {/* Code Content */}
        <pre className="p-4 text-xs md:text-sm font-mono text-emerald-400 overflow-x-auto scrollbar-hide">
          {jsonString}
        </pre>

        {/* Copy Button */}
        <button 
          onClick={handleCopy}
          className="absolute top-10 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all opacity-0 group-hover:opacity-100"
          title="Salin JSON"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT 2: API ENDPOINT ITEM (Expandable) ---
export const ApiEndpoint = ({ method, path, title, description, requestBody, responseBody }: ApiEndpointProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-indigo-200 hover:shadow-sm">
      {/* Header Clickable */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <span className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border w-[70px] text-center ${getMethodStyles(method)}`}>
          {method}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">{title}</span>
            <span className="hidden md:inline text-xs text-slate-400">•</span>
            <code className="hidden md:block font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{path}</code>
          </div>
          <code className="md:hidden block font-mono text-xs text-indigo-600 mt-1">{path}</code>
        </div>
        <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
          <ChevronRight size={18} />
        </div>
      </button>

      {/* Details (Collapsed) */}
      {isOpen && (
        <div className="px-4 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
          {description && <p className="text-sm text-slate-600 mb-4 leading-relaxed">{description}</p>}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requestBody && (
              <JsonBlock label="Request Body" json={requestBody} />
            )}
            {responseBody && (
              <JsonBlock label="Response Example (200 OK)" json={responseBody} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT 3: API GROUP (Accordion) ---
export const ApiGroup = ({ title, description, children, isOpenDefault = false }: ApiGroupProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#ecfeff] text-[#06b6d4]">
             <Server size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            {description && <p className="text-sm text-slate-400 font-medium">{description}</p>}
          </div>
        </div>
        <div className={`p-2 rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-8 space-y-3 animate-in slide-in-from-top-2 duration-300">
          <div className="w-full h-px bg-slate-100 mb-2" />
          {children}
        </div>
      )}
    </div>
  );
};