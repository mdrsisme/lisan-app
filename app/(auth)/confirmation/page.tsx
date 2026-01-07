export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ConfirmationScreen from "./ConfirmationEmail";

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description: "Masukkan kode verifikasi yang dikirim ke email Anda.",
};

export default function ConfirmationPage() {
  return <ConfirmationScreen />;
}