import type { Metadata } from "next";
import LeaderboardScreen from "./LeaderboardScreen";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Lihat peringkat pengguna global.",
};

export default function LeaderboardPage() {
  return <LeaderboardScreen />;
}