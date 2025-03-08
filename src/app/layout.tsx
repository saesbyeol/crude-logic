import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Oil Price Dashboard | Real-time Visualization",
  description: "A minimalist dashboard for monitoring oil prices with clean design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ 
        height: '100%', 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#151c2c', 
        color: 'white',
        fontFamily: inter.style.fontFamily 
      }}>
        {children}
      </body>
    </html>
  );
}
