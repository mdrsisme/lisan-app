import type { Metadata } from "next";
import LearningModulesScreen from "./LearningModulesScreen";

export const metadata: Metadata = {
  title: "Modul Pembelajaran",
  description: "Akses modul dan materi kursus Anda.",
};

export default async function LearningModulesPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <LearningModulesScreen courseId={courseId} />;
}