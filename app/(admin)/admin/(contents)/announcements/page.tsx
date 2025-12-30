import type { Metadata } from "next";
import AnnouncementsHubScreen from "./AnnouncementsHubScreen";

export const metadata: Metadata = {
  title: "Manajemen Pengumuman",
  description: "Pusat kontrol data pengumuman.",
};

export default function UsersPage() {
  return <AnnouncementsHubScreen />;
}