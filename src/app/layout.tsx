import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "How to Home Hub - Your Complete Home Management Companion",
  description:
    "Find appliance manuals, maintenance schedules, service professionals, and expert guides for every aspect of home management. Free and ad-supported.",
  keywords:
    "home maintenance, appliance manuals, home repair, service professionals, maintenance schedule",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col">
        <Header
          user={user ? { name: user.name, email: user.email } : null}
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
