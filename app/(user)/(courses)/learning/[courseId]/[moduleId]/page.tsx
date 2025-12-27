import type { Metadata } from "next";
import ModuleLessonsScreen from "./ModuleLessonsScreen";

export const metadata: Metadata = {
  title: "Daftar Pelajaran",
  description: "Pelajari materi dalam modul ini.",
};

export default async function ModuleLessonsPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; moduleId: string }> 
}) {
  const { courseId, moduleId } = await params;
  return <ModuleLessonsScreen courseId={courseId} moduleId={moduleId} />;
}