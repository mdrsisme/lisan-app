"use client";

import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { 
  Search,
  FileText,
  Download,
  Eye,
  LayoutGrid,
  FolderOpen,
  FileJson,
  FileType,
  BookOpen
} from "lucide-react";

type DocFile = {
  id: string;
  title: string;
  type: "docx" | "pdf" | "xlsx" | "pptx";
  size: string;
  category: string;
  url: string; 
  date: string;
};

const MOCK_DOCUMENTS: DocFile[] = [
  {
    id: "1",
    title: "ComPro-Laporan_dosen_kelompok",
    type: "docx",
    size: "2.4 MB",
    category: "Laporan",
    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf", 
    date: "24 Des 2025"
  },
  {
    id: "2",
    title: "ComPro-Proposal_dosen_kelompok",
    type: "docx",
    size: "1.8 MB",
    category: "Proposal",
    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf",
    date: "23 Des 2025"
  },
  {
    id: "3",
    title: "ComPro-SDD_dosen_kelompok",
    type: "docx",
    size: "3.2 MB",
    category: "Teknis",
    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf",
    date: "22 Des 2025"
  },
  {
    id: "4",
    title: "ComPro-slide, poster, video",
    type: "pptx",
    size: "15 MB",
    category: "Presentasi",
    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf",
    date: "20 Des 2025"
  },
  {
    id: "5",
    title: "ComPro-SRS_dosen_kelompok",
    type: "docx",
    size: "2.1 MB",
    category: "Teknis",
    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf",
    date: "19 Des 2025"
  },
  {
    id: "6",
    title: "ComPro-UAT_dosen_kelompok",
    type: "xlsx",
    size: "850 KB",
    category: "Testing",
    url: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf",
    date: "18 Des 2025"
  }
];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const filteredDocs = MOCK_DOCUMENTS.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "docx": return <FileText className="text-blue-500" size={32} />;
      case "pdf": return <FileType className="text-rose-500" size={32} />;
      case "xlsx": return <FileJson className="text-emerald-500" size={32} />;
      case "pptx": return <LayoutGrid className="text-orange-500" size={32} />;
      default: return <FileText className="text-slate-400" size={32} />;
    }
  };

  const focusRing = "focus:ring-[#06b6d4]/20 focus:border-[#06b6d4]";
  const iconActive = "group-focus-within:text-[#06b6d4]";

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-6 h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

        <PageHeader
          theme={themeColors.ocean}
          title="Repository"
          highlight="Dokumen"
          description="Akses template, laporan, dan aset proyek digital."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Dokumen", active: true, icon: FolderOpen },
          ]}
        />

        <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-xl p-2 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/20 flex flex-col md:flex-row gap-2 items-center group/search">
          <div className="relative flex-1 w-full">
            <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${iconActive}`}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari nama file template..."
              className={`w-full h-14 pl-14 pr-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 ${focusRing}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 text-xs font-bold text-slate-400">
            {filteredDocs.length} File Ditemukan
          </div>
        </div>

        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:border-[#06b6d4]/50 hover:shadow-xl hover:shadow-[#06b6d4]/10 transition-all flex flex-col justify-between h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    {getFileIcon(doc.type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                    {doc.type}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2 hover:text-[#06b6d4] transition-colors">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>{doc.size}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>{doc.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-auto">
                  <a
                    href={doc.url}
                    target="_blank"
                    className="flex-1 h-12 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#ecfeff] hover:text-[#06b6d4] transition-all border border-slate-100"
                  >
                    <Eye size={18} /> Preview
                  </a>
                  <a
                    href={doc.url}
                    download
                    className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#06b6d4] hover:shadow-lg hover:shadow-[#06b6d4]/30 transition-all"
                  >
                    <Download size={18} /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-black text-slate-800">File Tidak Ditemukan</h3>
            <p className="text-slate-400 mt-2">
              Coba kata kunci lain atau periksa ejaan.
            </p>
          </div>
        )}
      </div>

      <a
        href="/api-documentations"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 h-14 rounded-full
                   bg-gradient-to-r from-cyan-500 to-sky-500
                   text-white font-black shadow-xl shadow-cyan-500/30
                   hover:scale-105 hover:shadow-cyan-500/50 transition-all"
      >
        <BookOpen size={20} />
        <span className="hidden sm:inline">API Docs</span>
      </a>

    </AdminLayout>
  );
}
