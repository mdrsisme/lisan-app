import { Metadata } from "next";
import AdminUserEnrollScreen from "./AdminUserEnrollScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Enroll User #${id.split('-')[0]}`,
    description: "Katalog kursus untuk pendaftaran manual pengguna.",
  };
}

export default async function Page({ params }: Props) {
  return <AdminUserEnrollScreen params={params} />;
}