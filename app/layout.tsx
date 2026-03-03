import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Equal Insurance Portal | Praxis Rock Advisors",
  description: "Campaign performance portal for Equal Insurance M&A outreach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-portal-bg text-portal-text-primary min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
