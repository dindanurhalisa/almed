// import "@/css/style.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/css/global.css";
import { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AlMed | Jual Beli Alat Kesehatan",
  description:
    "AlMed adalah platform jual beli alat kesehatan, obat-obatan, dan perlengkapan medis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={`${geistSans.className} antialiased`}>
          <Toaster position="top-center" />
          <Navbar />
          <Suspense fallback={<div>loading...</div>}>{children}</Suspense>
          <Footer />
        </body>
      </html>
  );
}
