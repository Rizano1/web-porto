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
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Lenis smooth scroll */
            html.lenis, html.lenis body { height: auto; }
            .lenis.lenis-smooth { scroll-behavior: auto !important; }
            .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
            .lenis.lenis-stopped { overflow: hidden; }

            /* Custom Scrollbar */
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: #000; }
            ::-webkit-scrollbar-thumb { background: rgba(232, 220, 200, 0.2); border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(232, 220, 200, 0.4); }
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col bg-black text-[#ededed] font-sans overflow-x-hidden m-0 p-0 box-border">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
