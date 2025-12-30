import type { Metadata } from "next";
import ModulesHubScreen from "./ModulesHubScreen";

export const metadata: Metadata = {
  title: "Manajemen Modul",
  description: "Pusat kontrol data Modul.",
};

export default function UsersPage() {
  return <ModulesHubScreen />;
}