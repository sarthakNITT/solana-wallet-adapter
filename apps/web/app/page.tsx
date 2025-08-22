"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModal, WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Wallet, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function Home () {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
                    Solana Wallet
                    <span className="block text-white/60">Adapter</span>
                  </h1>
                  <p className="text-lg text-white/70 max-w-md mx-auto leading-relaxed">
                    Connect your wallet and manage your Solana assets with our minimalistic, secure interface
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto border border-white/10">
                    <Shield className="w-6 h-6 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Secure</h3>
                    <p className="text-xs text-white/50 mt-1">End-to-end encrypted</p>
                  </div>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto border border-white/10">
                    <Zap className="w-6 h-6 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Fast</h3>
                    <p className="text-xs text-white/50 mt-1">Lightning quick transactions</p>
                  </div>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto border border-white/10">
                    <Globe className="w-6 h-6 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Universal</h3>
                    <p className="text-xs text-white/50 mt-1">Works with all wallets</p>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <div className="text-center">
                <button
                  // onClick={handleConnect}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
                >
                  <span>Select Wallet</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-xs text-white/40 mt-4">
                  Supports Phantom, Solflare, Backpack, and more
                </p>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}