import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./privy-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { GlobalProvider } from "@/contexts/global-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Purpose Web3",
  description: "The Purpose",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <GlobalProvider>
            <Providers>{children}</Providers>
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
