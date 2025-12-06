import type { Metadata } from "next";
import Link from "next/link";
import { loadSettings } from "@/lib/cms";
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
  title: "FiloMento",
  description: "Filozófiai Mentorprogram Tájékozatató oldal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await loadSettings()
  const nav = [...(settings.navigation || [])]
    .filter(n => n.visible)
    .sort((a, b) => a.order - b.order)
  return (
    <html lang="hu">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lora.variable} antialiased`}>
        <header className="bg-[#0a2540] text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">FiloMento</h1>

            <nav className="hidden md:flex space-x-6">
              {nav.map(item => (
                <Link key={item.id} href={item.href} className="hover:text-blue-300 font-medium">{item.label}</Link>
              ))}
            </nav>

            <MobileDropdown navItems={nav} />
          </div>
        </header>

        {children}

        <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <p>2025 Filozófiai Mentorprogram</p>
            <p className="mt-2">
              📩 Kapcsolat:{" "}
              <a
                href="mailto:filozofinformacio@gmail.com"
                className="text-white hover:text-blue-300 transition-colors"
              >
                filozofinformacio@gmail.com
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}


