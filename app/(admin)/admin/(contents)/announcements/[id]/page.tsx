import { Metadata } from "next";
import EditAnnouncementScreen from "./EditAnnouncementScreen";

export const metadata: Metadata = {
  title: "Edit Pengumuman",
  description: "Perbarui detail, status, dan media pengumuman yang sudah ada.",
};

export default function EditAnnouncementPage() {
  return <EditAnnouncementScreen />;
}