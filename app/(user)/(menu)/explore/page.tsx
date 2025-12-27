import type { Metadata } from "next";
import ExploreScreen from "./ExploreScreen";

export const metadata: Metadata = {
  title: "Jelajahi Kursus",
  description: "Temukan berbagai kursus menarik dan tingkatkan keahlianmu di LISAN.",
};

export default function ExplorePage() {
  return <ExploreScreen />;
}