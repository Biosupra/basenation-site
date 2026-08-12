import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
            <a href="/">Home Page</a>
            <a href="/mission">Our Mission</a>
            <a href="/whitepages">Whitepages</a>
            <a href="/tos">Terms of Service</a>
          </div>
        </nav>

        <nav className="user-dropdown dropdown">
          <button className="dropbtn" style={{ backgroundColor: "var(--aero-red)" }}>User Dashboard</button>
          <div className="dropdown-content">
            <a href="/app" style={{ color: "var(--text-muted)", cursor: "pointer" }}>Vault Access</a>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
