import { Metadata } from "next";
import LandingPage from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: "Dashboard - AIsemble",
  description: "Your AI agent team management dashboard",
};

export default function HomePage() {
  return (
        <LandingPage />
    
  );
}
