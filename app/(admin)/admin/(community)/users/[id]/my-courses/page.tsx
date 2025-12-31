import { Metadata } from "next";
import AdminUserCoursesScreen from "./AdminUserCoursesScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Enrollment User #${id.split('-')[0]}`,
    description: "Kelola akses kursus dan progress belajar pengguna.",
  };
}

export default async function Page({ params }: Props) {
  return <AdminUserCoursesScreen params={params} />;
}