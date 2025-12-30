import type { Metadata } from "next";
import FaqsHubScreen from "./FaqsHubScreen";

export const metadata: Metadata = {
  title: "Manajemen FAQs",
  description: "Pusat kontrol data FAQs.",
};

export default function UsersPage() {
  return <FaqsHubScreen />;
}