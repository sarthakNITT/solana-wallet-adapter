import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
export default function InfoCard () {
    const [balance, setBalance] = useState<string>('0.00');
    const [address, setAddress] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
        const copyAddress = async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Wallet Information</h2>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/50 mb-2">Address</p>
              <p className="text-sm font-mono text-white/80 break-all bg-white/5 p-3 rounded-lg border border-white/10">
                {address}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-2">Balance</p>
              <p className="text-3xl font-light text-white">{balance} <span className="text-lg text-white/60">SOL</span></p>
            </div>
          </div>
        </div>
    )
}