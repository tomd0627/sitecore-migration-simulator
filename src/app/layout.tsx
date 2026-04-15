import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sitecore Migration Simulator",
  description:
    "An interactive walkthrough of migrating a legacy Sitecore SXA site to headless Next.js — component-by-component, with real trade-off decisions at each step.",
  keywords: [
    "Sitecore",
    "SXA",
    "Next.js",
    "headless CMS",
    "JSS",
    "migration guide",
    "front-end architecture",
  ],
  openGraph: {
    title: "Sitecore Migration Simulator",
    description:
      "Interactive guide to every decision in a Sitecore SXA → headless Next.js migration.",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
