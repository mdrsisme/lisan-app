import { Metadata } from "next";
import AnnouncementList from "./AnnouncementList";

export const metadata: Metadata = {
  title: "Daftar Pengumuman",
  description: "Kelola dan lihat semua pengumuman sistem.",
};

export default function AnnouncementListPage() {
  return <AnnouncementList />;
}