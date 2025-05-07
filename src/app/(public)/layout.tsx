import "@/css/global.css";
import { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
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
        <body className={`${geistSans.className} antialiased min-h-screen w-full flex flex-col items-center justify-center`}>
          {children}
        </body>
      </html>
  );
}
