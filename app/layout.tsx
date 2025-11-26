import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Assessment Platform",
  description: "AI-powered student assessment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
