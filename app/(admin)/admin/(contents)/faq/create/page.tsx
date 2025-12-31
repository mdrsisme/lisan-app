import { Metadata } from "next";
import CreateFaqScreen from "./CreateFaqScreen";

export const metadata: Metadata = {
  title: "Buat FAQ Baru",
  description: "Halaman untuk menambahkan pertanyaan umum baru ke dalam sistem.",
};

export default function CreateFaqPage() {
  return <CreateFaqScreen />;
}