"use client"
import Landing from "./landing.tsx/page";
import Dashboard from "./dashboard/page";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home () {
  const wallet = useWallet()
  return (
    <>
    {wallet.publicKey ? 
      <Dashboard/>
    : 
      <Landing/>
    }
    </>
  )
}