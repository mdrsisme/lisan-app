import type { Metadata } from "next";
import DictionariesHubScreen from "./DictionariesHubScreen";

export const metadata: Metadata = {
  title: "Manajemen Pengumuman",
  description: "Pusat kontrol data pengumuman.",
};

export default function UsersPage() {
  return <DictionariesHubScreen />;
}