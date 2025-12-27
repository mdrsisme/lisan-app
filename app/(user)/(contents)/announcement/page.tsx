import type { Metadata } from "next";
import AnnouncementsScreen from "./AnnouncementsScreen";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Dapatkan informasi terbaru seputar LISAN.",
};

export default function AnnouncementsPage() {
  return <AnnouncementsScreen />;
}