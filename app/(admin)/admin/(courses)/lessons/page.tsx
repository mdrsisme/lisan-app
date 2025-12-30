import type { Metadata } from "next";
import LessonsHubScreen from "./LessonsHubScreen";

export const metadata: Metadata = {
  title: "Manajemen Pembelajaran",
  description: "Pusat kontrol data Pembelajaran.",
};

export default function UsersPage() {
  return <LessonsHubScreen />;
}