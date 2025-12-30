import type { Metadata } from "next";
import RankingScreen from "./RankingScreen";

export const metadata: Metadata = {
  title: "Ranking & Leaderboard",
  description: "Lihat peringkat pengguna global.",
};

export default function RankingPage() {
  return <RankingScreen />;
}