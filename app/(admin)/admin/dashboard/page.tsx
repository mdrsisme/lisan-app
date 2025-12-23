"use client";

import { 
  Users, UserCheck, MessageSquare, AlertCircle, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal 
} from "lucide-react";

export default function AdminDashboard() {

  const stats = [
    {
      label: "Total Pengguna",
      value: "12,450",
      change: "+12%",
      isPositive: true,
      icon: Users,
      color: "from-[#6ECFF6] to-[#4AA3DF]"
    },
    {
      label: "Pengguna Aktif",
      value: "8,210",
      change: "+5%",
      isPositive: true,
      icon: UserCheck,
      color: "from-[#6B4FD3] to-[#5b21b6]"
    },
    {
      label: "FAQ Dibaca",
      value: "45,320",
      change: "+28%",
      isPositive: true,
      icon: MessageSquare,
      color: "from-[#F062C0] to-[#be185d]"
    },
    {
      label: "Laporan Masalah",
      value: "12",
      change: "-2%",
      isPositive: false,
      icon: AlertCircle,
      color: "from-orange-400 to-red-500"
    }
  ];

  const recentUsers = [
    { name: "Andi Saputra", email: "andi@gmail.com", role: "User", status: "Active", date: "23 Des 2025" },
    { name: "Siti Aminah", email: "siti.am@yahoo.com", role: "Premium", status: "Active", date: "23 Des 2025" },
    { name: "Budi Santoso", email: "budi.san@gmail.com", role: "User", status: "Pending", date: "22 Des 2025" },
    { name: "Citra Kirana", email: "citra@lisan.app", role: "Admin", status: "Active", date: "22 Des 2025" },
    { name: "Eko Prasetyo", email: "eko.p@gmail.com", role: "User", status: "Banned", date: "21 Des 2025" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard Ikhtisar</h1>
          <p className="text-slate-400 text-sm">Pantau pertumbuhan ekosistem LISAN secara real-time.</p>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors">
            Unduh Laporan
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-[#6B4FD3] text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:bg-[#5b21b6] transition-all">
            + Buat Pengumuman
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="group relative p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Pengguna Terbaru</h2>
          <button className="text-sm text-[#6ECFF6] hover:text-[#6B4FD3] transition-colors font-medium">
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold">Nama Pengguna</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold">Role</th>
                <th className="p-5 font-semibold">Tanggal Daftar</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentUsers.map((user, idx) => (
                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/5">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#6ECFF6] transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === "Active" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      user.status === "Pending" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-5 text-sm text-slate-300">{user.role}</td>
                  <td className="p-5 text-sm text-slate-500">{user.date}</td>
                  <td className="p-5 text-right">
                    <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}