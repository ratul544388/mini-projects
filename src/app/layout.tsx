import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfettiProvider } from "@/providers/confetti-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Games Online",
  description: "Play Interesting online games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "flex flex-col")}>
        <Navbar />
        <main className="relative flex-1">{children}</main>
        <ModalProvider />
        <ConfettiProvider />
        <ToastProvider />
      </body>
    </html>
  );
}
