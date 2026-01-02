"use client";

import { useState, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardAnnouncements from "@/components/dashboard/DashboardAnnouncements";
import DashboardStreak from "@/components/dashboard/DashboardStreak";
import DashboardCourses from "@/components/dashboard/DashboardCourses";
import DashboardChatbot from "@/components/dashboard/DashboardChatbot";
import DashboardPromotion from "@/components/dashboard/DashboardPromotion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { User } from "@/types";

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = setTimeout(() => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(initData);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
          <DashboardHeader user={user} />
          <DashboardAnnouncements />
          <DashboardStreak user={user} />
          <DashboardCourses userId={user?.id || ""} />
          
          <div className="pt-4">
             <DashboardPromotion user={user} />
          </div>
        </main>

        <DashboardChatbot />

      </div>
    </UserLayout>
  );
}