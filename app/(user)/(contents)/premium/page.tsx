import type { Metadata } from "next";
import PremiumScreen from "./PremiumScreen";

export const metadata: Metadata = {
  title: "Upgrade Premium",
  description: "Dapatkan akses tanpa batas dengan LISAN Premium.",
};

export default function PremiumPage() {
  return <PremiumScreen />;
}