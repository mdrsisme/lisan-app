import type { Metadata } from "next";
import ProfileScreen from "./ProfileScreen";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola profil dan informasi akun LISAN Anda.",
};

export default function UserProfilePage() {
  return <ProfileScreen />;
}