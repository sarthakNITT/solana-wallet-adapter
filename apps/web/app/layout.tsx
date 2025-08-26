"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
              <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                  {children}
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider> 
      </body>
    </html>
  );
}
