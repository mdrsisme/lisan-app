import type { Metadata } from "next";
import LoginScreen from "./LoginScreen";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun LISAN",
};

export default function LoginPage() {
  return <LoginScreen />;
}