"use client";

import MobileRestriction from "@/components/ui/MobileRestriction";
import TokenRestriction from "@/components/ui/TokenRestriction";
import UserNavbar from "@/components/ui/UserNavbar";
import { NotificationProvider } from "@/components/providers/NotificationContext"; // Sesuaikan path

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <MobileRestriction />
      <TokenRestriction />

      <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
        <div className="relative z-40 sticky top-0">
          <UserNavbar />
        </div>

        <main className="relative z-0 w-full">
          {children}
        </main>
      </div>
    </NotificationProvider>
  );
}