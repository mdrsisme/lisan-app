import type { Metadata } from "next";
import MyCoursesScreen from "./MyCoursesScreen";

export const metadata: Metadata = {
  title: "Kursus Saya",
  description: "Akses dan lanjutkan progres pembelajaran kursus Anda.",
};

export default function MyCoursesPage() {
  return <MyCoursesScreen />;
}