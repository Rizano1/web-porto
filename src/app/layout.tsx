import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";

const chomsky = localFont({
  src: "../../public/fonts/Chomsky.woff2",
  variable: "--font-chomsky",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RIZANO | Portfolio",
  description: "Rizano's creative portfolio — a visual journey through art, design and imagination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased scroll-smooth overflow-x-hidden ${chomsky.variable}`}>
      <body className="min-h-full flex flex-col bg-black text-foreground font-sans overflow-x-hidden m-0 p-0 box-border">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
