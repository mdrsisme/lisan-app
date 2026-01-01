import type { Metadata } from "next";
import StreakScreen from "./StreakScreen";

export const metadata: Metadata = {
  title: "Statistik Belajar",
  description: "Selamat datang di LISAN. Mulai perjalanan belajarmu.",
};

export default function StreakPage() {
  return <StreakScreen />;
}