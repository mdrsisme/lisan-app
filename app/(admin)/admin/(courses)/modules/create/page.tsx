import { Metadata } from "next";
import CreateModuleScreen from "./CreateModuleScreen";

export const metadata: Metadata = {
  title: "Buat Modul Baru",
  description: "Halaman untuk menambahkan modul materi pembelajaran baru.",
};

export default function CreateModulePage() {
  return <CreateModuleScreen />;
}