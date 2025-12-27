import type { Metadata } from "next";
import SelectRoleScreen from "./SelectRoleScreen";

export const metadata: Metadata = {
  title: "Pilih Akses",
  description: "Pilih dashboard untuk melanjutkan aktivitas Anda.",
};

export default function SelectRolePage() {
  return <SelectRoleScreen />;
}