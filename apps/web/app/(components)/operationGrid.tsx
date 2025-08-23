import { 
  Wallet, 
  Send, 
  Download, 
  Eye, 
  FileText, 
  Coins, 
  ArrowUpDown, 
} from 'lucide-react';
import { useState } from 'react';

interface WalletOperation {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function OperationGrid () {
    const [balance, setBalance] = useState<string>('0.00');
    const [result, setResult] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const [recipientAddress, setRecipientAddress] = useState<string>('');


    const openModal = (type: string) => {
        setModalType(type);
        setShowModal(true);
        setInputValue('');
        setRecipientAddress('');
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
    return(
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
    )
}