import { Metadata } from "next";
import LeaderboardScreen from "./LeaderboardScreen";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Lihat peringkat pembelajar terbaik dan pacu semangat belajarmu.",
};

export default function LeaderboardPage() {
  return <LeaderboardScreen />;
}