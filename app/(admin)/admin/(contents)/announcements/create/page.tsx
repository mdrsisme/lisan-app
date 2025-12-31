import { Metadata } from "next";
import CreateAnnouncementScreen from "./CreateAnnouncementScreen";

export const metadata: Metadata = {
  title: "Buat Pengumuman Baru",
  description: "Halaman untuk membuat dan mempublikasikan pengumuman baru.",
};

export default function CreateAnnouncementPage() {
  return <CreateAnnouncementScreen />;
}