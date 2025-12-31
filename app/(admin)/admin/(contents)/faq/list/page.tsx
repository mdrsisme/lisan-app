import { Metadata } from "next";
import FaqListScreen from "./FaqListScreen";

export const metadata: Metadata = {
  title: "Daftar FAQ",
  description: "Kelola pertanyaan umum (FAQ) yang ditampilkan kepada pengguna.",
};

export default function FaqListPage() {
  return <FaqListScreen />;
}