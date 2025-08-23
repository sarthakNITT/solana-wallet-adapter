import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';
export default function Header () {
    return (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-white">Wallet Dashboard</h1>
              <p className="text-sm text-white/50">Manage your Solana assets</p>
            </div>
          </div>
          <div>
            <WalletDisconnectButton />
          </div>
        </div>
    )
}