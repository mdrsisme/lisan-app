import { Metadata } from "next";
import CreateCourseScreen from "./CreateCourseScreen";

export const metadata: Metadata = {
  title: "Buat Kursus Baru",
  description: "Halaman untuk menambahkan kursus baru ke dalam sistem.",
};

export default function CreateCoursePage() {
  return <CreateCourseScreen />;
}