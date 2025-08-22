"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Landing from "./components/landing";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

export default function Home () {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter()
      ]} autoConnect>
        <WalletModalProvider>
          <Landing/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}