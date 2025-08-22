"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  Send, 
  Download, 
  Eye, 
  FileText, 
  Coins, 
  ArrowUpDown, 
  LogOut,
  Copy,
  Check,
  X
} from 'lucide-react';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

interface WalletOperation {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function Dashboard() {
  const [balance, setBalance] = useState<string>('0.00');
  const [address, setAddress] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Simulate wallet address generation
    setAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
  }, []);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
    setInputValue('');
    setRecipientAddress('');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setInputValue('');
    setRecipientAddress('');
  };

  const handleModalSubmit = () => {
    switch (modalType) {
      case 'airdrop':
        setResult(`Requesting ${inputValue} SOL airdrop...`);
        setTimeout(() => {
          const newBalance = (parseFloat(balance) + parseFloat(inputValue || '0')).toFixed(2);
          setBalance(newBalance);
          setResult(`Successfully received ${inputValue} SOL`);
        }, 2000);
        break;
      case 'send':
        setResult(`Sending ${inputValue} SOL to ${recipientAddress.substring(0, 8)}...`);
        setTimeout(() => setResult('Transaction successful'), 2000);
        break;
      case 'transfer':
        setResult(`Transferring ${inputValue} SOL to ${recipientAddress.substring(0, 8)}...`);
        setTimeout(() => setResult('Transfer completed'), 2000);
        break;
      case 'sign':
        setResult(`Message signed: "${inputValue}"`);
        break;
      case 'token-transfer':
        setResult(`Transferring ${inputValue} tokens to ${recipientAddress.substring(0, 8)}...`);
        setTimeout(() => setResult('Token transfer completed'), 2000);
        break;
    }
    closeModal();
  };

  const operations: WalletOperation[] = [
    {
      id: 'airdrop',
      name: 'Airdrop SOL',
      description: 'Request test SOL tokens',
      icon: <Download className="w-5 h-5" />,
      action: () => openModal('airdrop')
    },
    {
      id: 'balance',
      name: 'Check Balance',
      description: 'View current SOL balance',
      icon: <Eye className="w-5 h-5" />,
      action: () => {
        setResult(`Current balance: ${balance} SOL`);
      }
    },
    {
      id: 'send',
      name: 'Send SOL',
      description: 'Send SOL to another wallet',
      icon: <Send className="w-5 h-5" />,
      action: () => openModal('send')
    },
    {
      id: 'transfer',
      name: 'Transfer SOL',
      description: 'Transfer SOL between accounts',
      icon: <ArrowUpDown className="w-5 h-5" />,
      action: () => openModal('transfer')
    },
    {
      id: 'sign',
      name: 'Sign Message',
      description: 'Sign a custom message',
      icon: <FileText className="w-5 h-5" />,
      action: () => openModal('sign')
    },
    {
      id: 'metadata',
      name: 'Token Metadata',
      description: 'View token information',
      icon: <Coins className="w-5 h-5" />,
      action: () => {
        setResult('Fetching token metadata...');
        setTimeout(() => setResult('Metadata: SOL - Solana Native Token\nSymbol: SOL\nDecimals: 9'), 1500);
      }
    },
    {
      id: 'token-balance',
      name: 'Custom Token Balance',
      description: 'Check specific token balance',
      icon: <Wallet className="w-5 h-5" />,
      action: () => {
        const tokenAddress = prompt('Enter token mint address:');
        if (tokenAddress) {
          setResult(`Checking balance for: ${tokenAddress.substring(0, 8)}...`);
          setTimeout(() => setResult('Token balance: 0.00'), 1500);
        }
      }
    },
    {
      id: 'token-transfer',
      name: 'Transfer Token',
      description: 'Transfer custom tokens',
      icon: <Send className="w-5 h-5" />,
      action: () => openModal('token-transfer')
    }
  ];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
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

        {/* Wallet Info Card */}
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

        {/* Operations Grid */}
        <div>
          <h2 className="text-lg font-medium text-white mb-6">Operations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {operations.map((operation) => (
              <button
                key={operation.id}
                onClick={operation.action}
                className="group bg-white/5 hover:bg-white/10 rounded-xl p-6 text-left transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-white/80 group-hover:text-white transition-colors">
                    {operation.icon}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white mb-1">{operation.name}</h3>
                <p className="text-xs text-white/50">{operation.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">Result</h3>
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">{result}</pre>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-white/20 rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">
                {modalType === 'airdrop' && 'Airdrop SOL'}
                {modalType === 'send' && 'Send SOL'}
                {modalType === 'transfer' && 'Transfer SOL'}
                {modalType === 'sign' && 'Sign Message'}
                {modalType === 'token-transfer' && 'Transfer Token'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(modalType === 'send' || modalType === 'transfer' || modalType === 'token-transfer') && (
                <div>
                  <label className="block text-sm text-white/70 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter recipient address..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  {modalType === 'airdrop' && 'Amount (SOL)'}
                  {(modalType === 'send' || modalType === 'transfer') && 'Amount (SOL)'}
                  {modalType === 'sign' && 'Message'}
                  {modalType === 'token-transfer' && 'Amount (Tokens)'}
                </label>
                <input
                  type={modalType === 'sign' ? 'text' : 'number'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                  placeholder={
                    modalType === 'sign' 
                      ? 'Enter message to sign...' 
                      : 'Enter amount...'
                  }
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={closeModal}
                className="flex-1 py-3 px-4 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={!inputValue || ((modalType === 'send' || modalType === 'transfer' || modalType === 'token-transfer') && !recipientAddress)}
                className="flex-1 py-3 px-4 bg-white text-black text-sm rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}