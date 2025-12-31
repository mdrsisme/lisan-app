import { Metadata } from "next";
import UserDetailScreen from "./UserDetailScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const shortId = id.split('-')[0]; 

  return {
    title: `Detail User #${shortId}`,
    description: "Halaman detail profil, statistik, dan manajemen enrollment pengguna.",
  };
}

export default function UserDetailPage() {
  return <UserDetailScreen />;
}