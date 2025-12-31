import { Metadata } from "next";
import CreateUserScreen from "./UsersCreateScreen";

export const metadata: Metadata = {
  title: "Buat User Baru",
  description: "Halaman untuk menambahkan user baru secara manual ke dalam sistem.",
};

export default function CreateUserPage() {
  return <CreateUserScreen />;
}