import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Inter, Lora } from "next/font/google";
import "./globals.css";
import { MobileDropdown } from "@/components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional: specify what you need
});


export const metadata: Metadata = {
  title: "Filozófiai Mentorprogram",
  description: "Filozófiai Mentorprogram Tájékozatató oldal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lora.variable} antialiased`}>
        <header className="bg-[#0a2540] text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Filozófiai Mentorprogram</h1>

            <nav className="hidden md:flex space-x-6">
              <Link href="/bemutatkozas" className="hover:text-blue-300 font-medium">Diákoknak</Link>
              <Link href="/tanaroknak" className="hover:text-blue-300 font-medium">Tanároknak</Link>
              <Link href="/jelentkezes" className="hover:text-blue-300 font-medium">Jelentkezés</Link>
              <Link href="/kapcsolat" className="hover:text-blue-300 font-medium">Kapcsolat</Link>
            </nav>

            <MobileDropdown />
          </div>
        </header>

        {children}

        <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <p>2025 Filozófiai Mentorprogram</p>
            <p className="mt-2">
              📞 Kapcsolat:{" "}
              <a
                href="tel:+36-30-123-4567"
                className="text-white hover:text-blue-300 transition-colors"
              >
                +36 30 123 4567
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}


