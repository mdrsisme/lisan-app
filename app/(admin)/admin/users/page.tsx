import type { Metadata } from "next";
import UsersHubScreen from "./UsersHubScreen";

export const metadata: Metadata = {
  title: "Manajemen Pengguna",
  description: "Pusat kontrol data pengguna.",
};

export default function UsersPage() {
  return <UsersHubScreen />;
}