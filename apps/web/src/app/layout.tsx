import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SkillShare - Where Student Creativity Meets Opportunity",
  description: "The premier marketplace for creative students to showcase their work, sell digital products, and connect with clients worldwide.",
  keywords: "student marketplace, creative portfolio, digital products, freelance, graphic design, web development",
  authors: [{ name: "SkillShare Team" }],
  openGraph: {
    title: "SkillShare - Where Student Creativity Meets Opportunity",
    description: "Discover amazing projects and hire talented student creators",
    type: "website",
    siteName: "SkillShare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
