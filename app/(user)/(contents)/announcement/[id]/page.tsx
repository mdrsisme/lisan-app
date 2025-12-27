import type { Metadata } from "next";
import AnnouncementDetailScreen from "./AnnouncementDetailScreen";

export const metadata: Metadata = {
  title: "Detail Pengumuman",
  description: "Baca informasi selengkapnya dari pengumuman LISAN.",
};

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AnnouncementDetailScreen id={id} />;
}