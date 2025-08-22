import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModal, WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function Home () {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div>

          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}