import NextAuthSessionProvider from "@/utils/NextAuthSessionProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin"],
  style: "normal",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Sign In",
  description: "Messaging app built with Next.js 13",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <NextAuthSessionProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </NextAuthSessionProvider>
    </html>
  );
}
