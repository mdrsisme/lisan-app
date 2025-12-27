import type { Metadata } from "next";
import LessonPlayerScreen from "./LessonPlayerScreen";

export const metadata: Metadata = {
  title: "Belajar Materi",
  description: "Pelajari materi interaktif dan tingkatkan kemampuan bahasa isyaratmu.",
};

export default async function LessonPlayerPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }> 
}) {
  const { courseId, moduleId, lessonId } = await params;
  return <LessonPlayerScreen courseId={courseId} moduleId={moduleId} lessonId={lessonId} />;
}