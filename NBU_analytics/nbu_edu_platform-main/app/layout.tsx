import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Manrope,
  Inter,
} from "next/font/google";
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EduPulse — Video Coursebook Platform",
    template: "%s — EduPulse",
  },
  description:
    "A beautifully designed video coursebook platform with quizzes, flashcards, mental maps, and tests.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    siteName: "EduPulse",
    title: "EduPulse — Video Coursebook Platform",
    description:
      "A beautifully designed video coursebook platform with quizzes, flashcards, mental maps, and tests.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme")||"light";document.documentElement.setAttribute("data-theme",t);if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}})();`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
