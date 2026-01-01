import AchievementScreen from "./AchievementScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pencapaian Saya",
  description: "Lihat koleksi lencana dan pencapaian belajar Anda di LISAN.",
};

export default function AchievementPage() {
  return <AchievementScreen />;
}