import type { Metadata } from "next";
import CourseEnrollmentScreen from "./CourseEnrollmentScreen";

export const metadata: Metadata = {
  title: "Detail Kursus",
  description: "Pelajari materi berkualitas dan kembangkan keahlian Anda di LISAN.",
};

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CourseEnrollmentScreen id={id} />;
}