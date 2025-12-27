import type { Metadata } from "next";
import DashboardScreen from "./DashboardScreen";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Selamat datang di LISAN. Mulai perjalanan belajarmu.",
};

export default function UserDashboardPage() {
  return <DashboardScreen />;
}