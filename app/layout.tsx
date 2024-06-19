import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";

// const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "PodcastAI",
  description: "Generate podcasts by AI",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body className={manrope.className}>
              {children}
          </body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
