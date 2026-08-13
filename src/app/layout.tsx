import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import VaultButton from "@/components/VaultButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base Nation",
  description: "Automated Liquidity Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="dropdown">
          <button className="dropbtn">Menu</button>
          <div className="dropdown-content">
            <Link href="/">Home Page</Link>
            <Link href="/mission">Our Mission</Link>
            <Link href="/whitepages">Whitepages</Link>
            <Link href="/tos">Terms of Service</Link>
          </div>
        </nav>

        <nav className="user-dropdown dropdown">
          <button className="dropbtn" style={{ backgroundColor: "var(--aero-red)" }}>User Dashboard</button>
          <div className="dropdown-content">
            <VaultButton />
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
