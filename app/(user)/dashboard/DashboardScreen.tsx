"use client";

import { useState, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardAnnouncements from "@/components/dashboard/DashboardAnnouncements";
import DashboardStreak from "@/components/dashboard/DashboardStreak";
import DashboardCourses from "@/components/dashboard/DashboardCourses";
import DashboardChatbot from "@/components/dashboard/DashboardChatbot";
import { User } from "@/types";

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[30%] -left-[20%] w-[900px] h-[900px] bg-gradient-to-br from-yellow-300/30 via-amber-400/20 to-transparent rounded-full blur-[150px] mix-blend-multiply animate-pulse-slow" />
          <div className="absolute -bottom-[30%] -right-[20%] w-[900px] h-[900px] bg-gradient-to-tl from-indigo-600/30 via-violet-500/20 to-transparent rounded-full blur-[150px] mix-blend-multiply animate-pulse-slow" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
          {/* Header Section */}
          <DashboardHeader user={user} />

          {/* Announcements Section */}
          <DashboardAnnouncements />

          {/* Streak Section (Updated: passing user prop) */}
          <DashboardStreak user={user} />

          {/* My Courses Section */}
          <DashboardCourses userId={user?.id || ""} />
        </main>

        {/* Floating Chatbot */}
        <DashboardChatbot />

      </div>
    </UserLayout>
  );
}