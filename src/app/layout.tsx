import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const gilroy = localFont({
  src: [
    { path: "../fonts/Gilroy-Light.ttf", weight: "300" },
    { path: "../fonts/Gilroy-Regular.ttf", weight: "400" },
    { path: "../fonts/Gilroy-Medium.ttf", weight: "500" },
    { path: "../fonts/Gilroy-Bold.ttf", weight: "700" },
    { path: "../fonts/Gilroy-Heavy.ttf", weight: "900" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Wyze Bundle Builder",
  description:
    "Build your perfect home security bundle with Wyze cameras, sensors, and protection plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", gilroy.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
