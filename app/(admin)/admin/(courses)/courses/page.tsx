import type { Metadata } from "next";
import CoursesHubScreen from "./CoursesHubScreen";

export const metadata: Metadata = {
  title: "Manajemen Kursus",
  description: "Pusat kontrol data Kursus.",
};

export default function UsersPage() {
  return <CoursesHubScreen />;
}