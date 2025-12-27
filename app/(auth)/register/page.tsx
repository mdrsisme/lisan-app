import type { Metadata } from "next";
import RegisterScreen from "./RegisterScreen";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Bergabung dengan LISAN dan mulailah perjalanan inklusifmu.",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}