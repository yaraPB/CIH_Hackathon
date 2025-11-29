import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synergos - Group Wallet Platform",
  description: "Collaborative payment management for communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        {children}
      </body>
    </html>
  );
}
