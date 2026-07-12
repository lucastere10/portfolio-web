import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { ThemeProvider } from "@/providers/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-name-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lucas Caldas — Software Engineer",
    template: "%s | Lucas Caldas",
  },
  description:
    "Software engineer specialising in AI agents, cloud architecture on GCP, payment systems, and backend engineering.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lucas Caldas",
  },
  authors: [{ name: "Lucas Caldas", url: "https://github.com/lucastere10" }],
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${cormorantGaramond.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
