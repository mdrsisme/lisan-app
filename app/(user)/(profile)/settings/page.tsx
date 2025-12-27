import type { Metadata } from "next";
import SettingsScreen from "./SettingsScreen";

export const metadata: Metadata = {
  title: "Pengaturan Akun",
  description: "Kelola keamanan dan preferensi akun LISAN Anda.",
};

export default function SettingsPage() {
  return <SettingsScreen />;
}