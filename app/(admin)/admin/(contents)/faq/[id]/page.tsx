import { Metadata } from "next";
import EditFaqScreen from "./EditFaqScreen";

export const metadata: Metadata = {
  title: "Edit FAQ | Admin Dashboard",
  description: "Perbarui pertanyaan dan jawaban dalam database FAQ.",
};

export default function EditFaqPage() {
  return <EditFaqScreen />;
}