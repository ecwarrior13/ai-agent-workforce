import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import SchematicWrapper from "@/components/schematic/SchematicWrapper";

/* fonts used if needed  reimport them
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
});
const electrolize = Electrolize({
  subsets: ["latin"],
  weight: ["400"], // Electrolize only comes in 400 weight
  variable: "--font-electrolize",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

const spacegrotestk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spacegrotestk",
});

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
});
*/
// Selected Font
const exo = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-exo",
  display: "swap", // Optimize font loading
});

export const metadata: Metadata = {
  title: "AIsemble - Create and Manage AI Agent Teams",
  description:
    "Build custom AI agent teams that communicate, collaborate, and solve complex problems together.",
  keywords: [
    "AI agents",
    "team management",
    "artificial intelligence",
    "collaboration",
  ],
  authors: [{ name: "AIsemble" }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className={exo.variable} suppressHydrationWarning>
      {/* <body className="min-h-screen bg-background font-sans antialiased"> */}
      <body className={exo.className}>
        <SchematicWrapper>
          <main className="relative flex min-h-screen flex-col">
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster position="top-center" />
          </main>
        </SchematicWrapper>
      </body>
    </html>
  );
}
