"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Header from '../(components)/Header';
import InfoCard from '../(components)/infoCard';
import OperationGrid from '../(components)/operationGrid';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Dashboard() {
  const [balance, setBalance] = useState<string>('0.00');
  const [address, setAddress] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(()=>{
    setAddress(wallet.publicKey!.toString());
    connection.getBalance(wallet.publicKey!).then((e)=>{
        setBalance((e / LAMPORTS_PER_SOL).toString());
    });
  },[wallet.publicKey, connection])

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
          <Header/>

        {/* Wallet Info Card */}
          <InfoCard amount={balance} key={wallet.publicKey!.toString()} />

        {/* Operations Grid */}
          <OperationGrid/>

        {/* Result Display */}
        {result && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">Result</h3>
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">{result}</pre>
          </div>
        )}
      </div>

      {/* Modal */}
      
    </div>
  );
}