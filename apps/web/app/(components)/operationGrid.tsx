import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { ed25519 } from '@noble/curves/ed25519';
import { 
  Wallet, 
  Send, 
  Download, 
  FileText, 
  X
} from 'lucide-react';
import { useState } from 'react';
import { address, createSolanaRpc } from '@solana/kit';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata, fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from '@metaplex-foundation/umi';
import axios from 'axios';
import { createTransferInstruction } from "@solana/spl-token"

interface ITD {
    tokenBalance: string,
    tokenName: string,
    tokenSymbol: string,
    tokenLogo: string
}

interface WalletOperation {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function OperationGrid () {
  const [result, setResult] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [senderAddress, setSenderAddress] = useState<string>('');
  const [tokenDetails, setTokenDetails] = useState<ITD[]>([])
  const { connection } = useConnection();
  const wallet = useWallet();

  const umi = createUmi("https://api.devnet.solana.com").use(mplTokenMetadata());

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

  async function handleAirdrop() {
    setResult(`Requesting ${inputValue} SOL airdrop...`);
    try {
      await connection.requestAirdrop(wallet.publicKey!, Number(inputValue)*LAMPORTS_PER_SOL);
      setResult(`Successfully received ${inputValue} SOL`);
    } catch (error) {
      setResult(`Failed to receive ${inputValue} SOL`);
      console.log(error);
    }
  }

  async function handleSignMessage() {
    setResult(`Message signed: "${inputValue}"`);
    try {
      if (!wallet.publicKey){
        setResult('Wallet not connected!');
        throw new Error('Wallet not connected');
      } 
      if (!wallet.signMessage){
        setResult('Wallet does not support message signing!');
        throw new Error('Wallet does not support message signing!');
      } 
      const encodedMessage = new TextEncoder().encode(inputValue);
      const signature = await wallet.signMessage(encodedMessage);
      if (!ed25519.verify(signature, encodedMessage, wallet.publicKey.toBytes())){
        setResult('Message signature invalid!');
      } 
      setResult(`Message signed: "${inputValue}"\nSignature: ${signature}`);
    } catch (error) {
      setResult(`Failed to sign message: "${inputValue}"`);
      console.log(error);
    }
  }

  async function handleSendSol () {
    setResult(`Sending ${inputValue} SOL to ${recipientAddress.substring(0, 8)}...`);
    try {
      const transaction = new Transaction();
      transaction.add(SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: new PublicKey(recipientAddress),
        lamports: Number(inputValue) * LAMPORTS_PER_SOL,
      }));
    } catch (error) {
      setResult(`Failed to send ${inputValue} SOL to ${recipientAddress.substring(0, 8)}...`);
      console.log(error);
    }
  }

  async function handleTokenBalance () {
    try {
      const rpc = createSolanaRpc("https://api.devnet.solana.com");
      if(!wallet.publicKey) return;
      const walletAddress = address(wallet.publicKey.toBase58());
      const response = await rpc.getTokenAccountsByOwner(
        walletAddress!,
        {programId: address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")},
        {encoding: "jsonParsed"}
      ).send();
      const newTokenDetails: ITD[] = [];
      for (const accInfo of response.value) {
        // const tokens = (await new TokenListProvider().resolve()).filterByClusterSlug('devnet').getList();
        const tokenAccKey = accInfo.pubkey;
        const parsedInfo = accInfo.account.data.parsed.info;
        const mintAdd = new PublicKey(parsedInfo.mint);

        try {
          const asset = await fetchDigitalAsset(umi, publicKey(mintAdd.toBase58()));
          const balance = await rpc.getTokenAccountBalance(tokenAccKey).send();
          const metaDataJson = await axios(asset.metadata.uri).then((res: any) => res.json());
          newTokenDetails.push({
            tokenBalance: balance.value.uiAmountString!,
            tokenName: asset?.metadata.name!,
            tokenLogo: metaDataJson.image,
            tokenSymbol: asset?.metadata.symbol!
          });
          // setTokenDetails(prev => [...prev, {tokenBalance: balance.value.uiAmountString!, tokenName: asset?.metadata.name!, tokenLogo: metaDataJson.image, tokenSymbol: asset?.metadata.symbol!}])
        } catch (error) {
          const balance = await rpc.getTokenAccountBalance(tokenAccKey).send();
          newTokenDetails.push({
            tokenBalance: balance.value.uiAmountString!,
            tokenName: "Unknown Token",
            tokenLogo: "",
            tokenSymbol: "null"
          });
        }
        setResult('');
        // const info = tokens.find(e => e.address === mintAdd.toBase58());
        // console.log(info?.name, info?.logoURI, info?.symbol);
      }
      setTokenDetails(newTokenDetails); 
    } catch (error) {
      setResult('Failed to fetch token balance');
      console.log(error);
    }
  }

  async function handleTransferToken () {
    const transaction = new Transaction().add(
      createTransferInstruction(
        new PublicKey(senderAddress),
        new PublicKey(recipientAddress),
        wallet.publicKey!,
        Number(inputValue)
      )
    )
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");
  }

  const handleModalSubmit = () => {
    switch (modalType) {
      case 'airdrop':
        handleAirdrop();
        break;
      case 'send':
        handleSendSol();
        break;
      case 'transfer':
        setResult(`Transferring ${inputValue} SOL to ${recipientAddress.substring(0, 8)}...`);
        setTimeout(() => setResult('Transfer completed'), 2000);
        break;
      case 'sign':
        handleSignMessage();
        break;
      case 'token-transfer':
        handleTransferToken();
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
      id: 'send',
      name: 'Send SOL',
      description: 'Send SOL to another wallet',
      icon: <Send className="w-5 h-5" />,
      action: () => openModal('send')
    },
    {
      id: 'sign',
      name: 'Sign Message',
      description: 'Sign a custom message',
      icon: <FileText className="w-5 h-5" />,
      action: () => openModal('sign')
    },
    {
      id: 'token-balance',
      name: 'Custom Token Balance',
      description: 'Check specific token balance',
      icon: <Wallet className="w-5 h-5" />,
      action: () => {
        setResult('Fetching token balance...');
        openModal('token-balance')
        handleTokenBalance();
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
      <>
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

        {/* Modal Section */}
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
                {modalType === 'token-balance' && 'Check Token Balance'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(modalType === 'token-transfer') && (
                <div>
                  <label className="block text-sm text-white/70 mb-2">Sender Token Account Address</label>
                  <input
                    type="text"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter Sender's address..."
                  />
                </div>
              )}
              
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

              {(modalType === 'token-balance') && (
                <div>
                  <label className="block text-sm text-white/70 mb-2">Token Balance</label>
                  {result !== '' && <div className='text-white'>{result}</div>}
                  {tokenDetails.map((token, index)=>{
                    return (
                      <div key={index} className='text-white mb-4'>
                        <div>Token Name: {token.tokenName}</div>
                        <div>Token Symbol: {token.tokenSymbol}</div>
                        <div>Token Logo: {token.tokenLogo}</div>
                        <div>Token Balance: {token.tokenBalance} SOL</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {modalType !== 'token-balance' && (
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
                      modalType === 'sign' ? 'Enter message to sign...' : 'Enter amount...'
                    }
                    />
                </div>
              )}
            </div>
            
            {modalType !== 'token-balance' && (
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
            )}
          </div>
        </div>
      )}
      </>
    )
}