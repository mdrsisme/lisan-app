import { Metadata } from "next";
import LiveTranslationScreen from "./LiveTranslationScreen";

export const metadata: Metadata = {
  title: "Live Translation | LISAN",
  description: "Terjemahkan bahasa isyarat BISINDO ke teks secara real-time menggunakan AI.",
};

export default function LiveTranslationPage() {
  return <LiveTranslationScreen />;
}