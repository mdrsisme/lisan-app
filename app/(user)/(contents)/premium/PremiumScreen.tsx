"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, CreditCard, QrCode, Clock, ShieldCheck, CheckCircle2, Loader2, Lock, Sparkles, Calendar
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";

const BASE_PRICE = 19000;

const PLANS = [
  { id: '1_month', label: '1 Bulan', duration: 1 },
  { id: '3_months', label: '3 Bulan', duration: 3 },
  { id: '6_months', label: '6 Bulan', duration: 6 },
];

export default function PremiumScreen() {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'visa'>('qris');
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isLoading, setIsLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    if (selectedMethod === 'qris' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedMethod, timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const subtotal = BASE_PRICE * selectedPlan.duration;
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    if (val.length <= 19) setCardNumber(val);
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    if (val.length <= 5) setExpiry(val);
  };

  const handleCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 3) setCvc(val);
  };

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        alert("Simulasi: Pembayaran Berhasil!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative selection:bg-amber-100 selection:text-amber-900">

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04]" />
      </div>

      <div className="relative z-10">
        <UserNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            
            <div className="mb-8">
                <Link 
                    href="/dashboard" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4"
                >
                    <ArrowLeft size={18} /> Kembali ke Dashboard
                </Link>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Upgrade Premium</h1>
                <p className="text-slate-500 font-medium mt-2">Buka akses tanpa batas ke semua materi pembelajaran.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-slate-100/50">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-indigo-600" /> Pilih Durasi
                        </h3>
                        <div className="space-y-3">
                            {PLANS.map((plan) => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                                        selectedPlan.id === plan.id 
                                        ? 'border-indigo-600 bg-indigo-50/80 shadow-md' 
                                        : 'border-slate-100 hover:border-indigo-200 bg-white'
                                    }`}
                                >
                                    <span className={`font-bold ${selectedPlan.id === plan.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                                        {plan.label}
                                    </span>
                                    <span className={`font-medium ${selectedPlan.id === plan.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {formatCurrency(BASE_PRICE * plan.duration)}
                                    </span>
                                    {selectedPlan.id === plan.id && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-indigo-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-slate-100/50">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-amber-500" /> Metode Pembayaran
                        </h3>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => setSelectedMethod('qris')}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                                    selectedMethod === 'qris' 
                                    ? 'border-amber-500 bg-amber-50/80' 
                                    : 'border-slate-100 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedMethod === 'qris' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <QrCode size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-800">QRIS</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Instant Payment</p>
                                    </div>
                                </div>
                                {selectedMethod === 'qris' && <CheckCircle2 size={20} className="text-amber-500" />}
                            </button>

                            <button
                                onClick={() => setSelectedMethod('visa')}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                                    selectedMethod === 'visa' 
                                    ? 'border-indigo-600 bg-indigo-50/80' 
                                    : 'border-slate-100 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedMethod === 'visa' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-800">Kartu Kredit</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Visa / Mastercard</p>
                                    </div>
                                </div>
                                {selectedMethod === 'visa' && <CheckCircle2 size={20} className="text-indigo-600" />}
                            </button>
                        </div>
                    </div>

                </div>
                <div className="lg:col-span-7">
                    <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden h-full flex flex-col">
                        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-amber-500" /> Ringkasan
                            </h3>
                            <div className="space-y-3 text-sm text-slate-500 font-medium">
                                <div className="flex justify-between">
                                    <span>Paket Premium ({selectedPlan.label})</span>
                                    <span className="text-slate-900">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pajak PPN (11%)</span>
                                    <span className="text-slate-900">{formatCurrency(tax)}</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-base text-slate-800">Total Bayar</span>
                                    <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-8 sm:p-10 relative">
                            
                            {selectedMethod === 'qris' && (
                                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    
                                    <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold shadow-sm animate-pulse">
                                        <Clock size={14} />
                                        <span>Berakhir dalam: {formatTime(timeLeft)}</span>
                                    </div>

                                    <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 mb-6 relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-600 opacity-20 blur-xl rounded-3xl" />
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=LISAN-PAY-${timeLeft}&color=0f172a`} 
                                            alt="QRIS" 
                                            className="w-52 h-52 object-contain relative z-10 rounded-xl"
                                        />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full z-20 shadow-md">
                                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-white text-[10px]">QRIS</div>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto mb-8">
                                        Scan QRIS di atas menggunakan GoPay, OVO, Dana, atau Mobile Banking.
                                    </p>

                                    <button 
                                        onClick={handlePayment}
                                        disabled={isLoading}
                                        className="w-full max-w-sm h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                                        Saya Sudah Bayar
                                    </button>
                                </div>
                            )}

                            {selectedMethod === 'visa' && (
                                <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    
                                    <div className="mb-8 p-6 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px]" />
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-12 h-8 bg-amber-300/80 rounded-md" />
                                            <span className="font-mono text-xs opacity-60">Debit/Credit</span>
                                        </div>
                                        <div className="font-mono text-xl tracking-widest mb-6">
                                            {cardNumber || "•••• •••• •••• ••••"}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[9px] uppercase opacity-50 mb-1">Card Holder</p>
                                                <p className="font-medium text-sm tracking-wide">{cardName || "YOUR NAME"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase opacity-50 mb-1">Expires</p>
                                                <p className="font-medium text-sm">{expiry || "MM/YY"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                                        <div>
                                            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nomor Kartu</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="0000 0000 0000 0000"
                                                    value={cardNumber}
                                                    onChange={handleCardNumber}
                                                    maxLength={19}
                                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm outline-none font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Masa Berlaku</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={handleExpiry}
                                                    maxLength={5}
                                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm outline-none text-center font-bold text-slate-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">CVC / CVV</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input 
                                                        type="text" 
                                                        placeholder="123"
                                                        value={cvc}
                                                        onChange={handleCvc}
                                                        maxLength={3}
                                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm outline-none font-bold text-slate-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nama Pemilik</label>
                                            <input 
                                                type="text" 
                                                placeholder="Nama Lengkap di Kartu"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold outline-none text-slate-700"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <button 
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden"
                                            >
                                                {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                                                Bayar Sekarang
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </main>
      </div>
    </div>
  );
}