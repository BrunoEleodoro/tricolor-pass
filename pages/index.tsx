import { useState, useEffect } from "react";
import { useLogin, usePrivy, useWallets, useSendTransaction } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CheckCircleIcon, StarIcon, SparklesIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, TRICOLOR_PASS_ABI, MOCK_SPFC_ABI } from "../lib/contracts";
import { SPFCLogo, SPTricolorStripes } from "../components/SPFCLogo";
import { AnimatedBackground } from "../components/AnimatedBackground";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    console.log({ claims });

    // Don't redirect - let users stay on welcome page to mint
    return { props: {} };
  } catch (error) {
    return { props: {} };
  }
};

export default function WelcomePage() {
  const router = useRouter();
  const { login } = useLogin({
    // Don't auto-redirect after login - let users mint first
    onComplete: () => {
      toast.success('Carteira conectada! Agora você pode reivindicar tokens e criar seu passe.');
    },
  });
  const { authenticated, user } = usePrivy();
  console.log({ authenticated, user });
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();
  
  // Get the user's wallet address for testnet faucet funding
  const walletAddress = user?.wallet?.address;
  const activeWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
  const [selectedTier, setSelectedTier] = useState<'BRONZE' | 'SILVER' | 'GOLD'>('BRONZE');
  const [isMinting, setIsMinting] = useState(false);
  const [hasSpfcToken, setHasSpfcToken] = useState(false);
  const [spfcBalance, setSpfcBalance] = useState(0);
  const [canClaimFaucet, setCanClaimFaucet] = useState(false);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false);
  
  // Check real SPFC token balance - disabled for now, just show UI
  useEffect(() => {
    const checkSPFCBalance = async () => {
      if (authenticated && user?.wallet) {
        // For now, just show the UI without balance checks
        // This bypasses the contract call error
        setHasSpfcToken(true);
        setCanClaimFaucet(true);
        setSpfcBalance(0);
        
        // Optionally try to check balance but don't let it break the UI
        if (activeWallet) {
          try {
            const provider = await activeWallet.getEthereumProvider();
            const ethersProvider = new ethers.BrowserProvider(provider);
            
            // Check if contract exists first
            const code = await ethersProvider.getCode(CONTRACT_ADDRESSES.MOCK_SPFC_TOKEN);
            console.log('Contract code length:', code.length);
            
            if (code === '0x') {
              console.warn('No contract found at address:', CONTRACT_ADDRESSES.MOCK_SPFC_TOKEN);
              return;
            }
            
            const spfcContract = new ethers.Contract(
              CONTRACT_ADDRESSES.MOCK_SPFC_TOKEN,
              MOCK_SPFC_ABI,
              ethersProvider
            );
            
            const balanceWei = await spfcContract.balanceOf(walletAddress);
            const balance = Number(ethers.formatEther(balanceWei));
            const canClaim = await spfcContract.canClaimFaucet(walletAddress);
            
            setSpfcBalance(balance);
            setCanClaimFaucet(canClaim);
            console.log('SPFC Balance loaded:', balance);
          } catch (error) {
            console.error('Error checking SPFC balance (non-blocking):', error);
            // Don't show error toast, just log it
          }
        }
      }
    };

    checkSPFCBalance();
    
    // Refresh balance every 30 seconds (less frequent to avoid errors)
    const interval = setInterval(checkSPFCBalance, 30000);
    return () => clearInterval(interval);
  }, [authenticated, user, activeWallet, walletAddress]);

  const handleMintPass = async () => {
    if (!activeWallet || !walletAddress) {
      toast.error('Carteira não conectada');
      return;
    }

    setIsMinting(true);
    try {
      // Map tier to enum value
      const tierMap = { 'BRONZE': 0, 'SILVER': 1, 'GOLD': 2 };
      const tierValue = tierMap[selectedTier];
      
      toast.loading('Preparando transação...', { id: 'mint' });
      
      // Get the ethers provider from Privy wallet  
      const provider = await activeWallet.getEthereumProvider();
      const ethersProvider = new ethers.BrowserProvider(provider);
      
      // Create contract instance with provider (read-only first)
      const tricolorPass = new ethers.Contract(
        CONTRACT_ADDRESSES.TRICOLOR_PASS,
        TRICOLOR_PASS_ABI,
        ethersProvider
      );
      
      // Prepare transaction data
      const txData = tricolorPass.interface.encodeFunctionData('mintPass', [walletAddress, tierValue]);
      
      toast.loading('Aguardando confirmação...', { id: 'mint' });
      
      // Use Privy's sendTransaction to trigger wallet popup
      const txHash = await sendTransaction({
        to: CONTRACT_ADDRESSES.TRICOLOR_PASS,
        data: txData,
        value: '0x0', // No ETH value needed
      });
      
      toast.loading('Confirmando na blockchain...', { id: 'mint' });
      
      // Wait for transaction confirmation
      const receipt = await ethersProvider.waitForTransaction(txHash.hash);
      
      toast.success('Passe Tricolor criado com sucesso!', { id: 'mint' });
      
      console.log('Transaction receipt:', receipt);
      
      // Add animation delay then redirect
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (error: any) {
      console.error('Minting error:', error);
      
      let errorMessage = 'Erro ao criar passe. Tente novamente.';
      
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Saldo insuficiente para taxa de gas. Use o faucet para obter CHZ.';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transação cancelada pelo usuário.';
        }
      }
      
      toast.error(errorMessage, { id: 'mint' });
      setIsMinting(false);
    }
  };

  const handleClaimSPFCFaucet = async () => {
    if (!activeWallet || !walletAddress) {
      toast.error('Carteira não conectada');
      return;
    }

    if (!canClaimFaucet) {
      toast.error('Você já reivindicou tokens recentemente. Aguarde 24h.');
      return;
    }

    setIsClaimingFaucet(true);
    try {
      const provider = await activeWallet.getEthereumProvider();
      const ethersProvider = new ethers.BrowserProvider(provider);
      const spfcContract = new ethers.Contract(
        CONTRACT_ADDRESSES.MOCK_SPFC_TOKEN,
        MOCK_SPFC_ABI,
        ethersProvider
      );

      toast.loading('Reivindicando tokens SPFC...', { id: 'faucet' });

      // Prepare transaction data for faucet call
      const txData = spfcContract.interface.encodeFunctionData('faucet', []);
      
      // Use Privy's sendTransaction to trigger wallet popup
      const txHash = await sendTransaction({
        to: CONTRACT_ADDRESSES.MOCK_SPFC_TOKEN,
        data: txData,
        value: '0x0',
      });
      
      // Wait for confirmation
      await ethersProvider.waitForTransaction(txHash.hash);

      toast.success('10,000 tokens SPFC reivindicados!', { id: 'faucet' });
      
      // Refresh balance
      setTimeout(() => {
        const newBalance = spfcBalance + 10000;
        setSpfcBalance(newBalance);
        setHasSpfcToken(true);
        setCanClaimFaucet(false);
      }, 2000);

    } catch (error: any) {
      console.error('Faucet claim error:', error);
      let errorMessage = 'Erro ao reivindicar tokens SPFC.';
      
      if (error.message && error.message.includes('Faucet cooldown active')) {
        errorMessage = 'Aguarde 24h para reivindicar novamente.';
      }
      
      toast.error(errorMessage, { id: 'faucet' });
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  const tiers = [
    {
      id: 'BRONZE',
      name: 'Bronze',
      description: 'Entrada padrão no mundo Tricolor',
      color: 'spfc-bronze',
      benefits: ['XP por quests básicas', 'Recompensas limitadas'],
      requirement: '100 $SPFC'
    },
    {
      id: 'SILVER',
      name: 'Prata',
      description: 'Experiência aprimorada',
      color: 'spfc-silver',
      benefits: ['XP bônus', 'Recompensas exclusivas', 'Acesso VIP'],
      requirement: '1,000 $SPFC'
    },
    {
      id: 'GOLD',
      name: 'Ouro',
      description: 'Máxima experiência Tricolor',
      color: 'spfc-gold',
      benefits: ['Máximo XP', 'Todas as recompensas', 'Experiências únicas'],
      requirement: '5,000 $SPFC'
    }
  ];

  return (
    <>
      <Head>
        <title>Tricolor Pass · SPFC</title>
        <meta name="description" content="Viva o SPFC todos os dias. Ganhe XP e desbloqueie benefícios de verdade." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-spfc-light via-spfc-gray-50 to-spfc-gray-100 text-spfc-gray-900 relative">
        <AnimatedBackground variant="geometric" className="opacity-30" />
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sp-red-50 via-transparent to-sp-red-50" />
          <AnimatedBackground variant="particles" className="opacity-20" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center space-x-6 mb-8">
                  <SPFCLogo size="xl" animated />
                  <div className="text-left">
                    <h1 className="text-4xl md:text-6xl font-bold mb-2">
                      <span className="text-sp-red-600">Tricolor</span> Pass
                    </h1>
                    <SPTricolorStripes className="rounded-lg shadow-lg" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl text-spfc-gray-600 mb-8 max-w-3xl mx-auto text-center">
                  Viva o SPFC todos os dias. Ganhe XP e desbloqueie benefícios de verdade.
                </p>
              </motion.div>

              {/* Connection Status */}
              {!authenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <button
                    onClick={login}
                    className="bg-gradient-to-r from-sp-red-600 to-sp-red-700 hover:from-sp-red-700 hover:to-sp-red-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:scale-105 flex items-center space-x-2 w-full justify-center"
                  >
                    <SparklesIcon className="h-5 w-5" />
                    <span>Conectar Carteira</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Wallet Address Display */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto shadow-lg border border-spfc-gray-200">
                    <p className="text-sm text-spfc-gray-600 mb-2">Sua carteira testnet:</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="text-sm font-mono text-sp-red-600 bg-sp-red-50 px-2 py-1 rounded-lg">
                        {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Carregando...'}
                      </code>
                      {walletAddress && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                            toast.success('Endereço copiado!');
                          }}
                          className="text-xs text-spfc-gray-500 hover:text-sp-red-600 transition-colors"
                          title="Copiar endereço"
                        >
                          📋
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-spfc-gray-500 mt-2">
                      Chiliz Spicy Testnet • Precisa de CHZ?{' '}
                      <a 
                        href="https://testnet.chiliscan.com/faucet" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sp-red-600 hover:text-sp-red-700 hover:underline font-medium"
                      >
                        Faucet aqui
                      </a>
                    </p>
                  </div>
                  {/* Debug Info */}
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-4 shadow-sm">
                    <p className="font-semibold mb-2">Debug Info:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Authenticated: <span className="font-medium">{authenticated ? 'Yes' : 'No'}</span></p>
                      <p>User wallet: <span className="font-medium">{user?.wallet?.address ? 'Yes' : 'No'}</span></p>
                      <p>Wallet address: <span className="font-medium">{walletAddress || 'None'}</span></p>
                      <p>Active wallet: <span className="font-medium">{activeWallet ? 'Yes' : 'No'}</span></p>
                      <p>SPFC Balance: <span className="font-medium">{spfcBalance}</span></p>
                      <p>Can claim faucet: <span className="font-medium">{canClaimFaucet ? 'Yes' : 'No'}</span></p>
                    </div>
                  </div>

                  {/* $SPFC Token Status */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto shadow-lg border border-spfc-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {spfcBalance.toLocaleString()} $SPFC tokens
                        </span>
                      </div>
                      
                      {/* ALWAYS show faucet button - no conditions */}
                      <button
                        onClick={handleClaimSPFCFaucet}
                        disabled={isClaimingFaucet}
                        className="bg-gradient-to-r from-sp-red-600 to-sp-red-700 hover:from-sp-red-700 hover:to-sp-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mb-4 transform hover:scale-105"
                      >
                        {isClaimingFaucet ? 'Reivindicando...' : 'Reivindicar 10,000 $SPFC'}
                      </button>
                    </div>
                  </div>

                  {/* Tier Selection - ALWAYS SHOW */}
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl mb-4 shadow-sm">
                    <p className="text-sm font-medium text-center">Seção de seleção sempre visível quando logado</p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-center text-spfc-gray-800">Escolha seu nível</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
                      {tiers.map((tier) => (
                        <motion.div
                          key={tier.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTier(tier.id as any)}
                          className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                            selectedTier === tier.id
                              ? 'border-sp-red-500 bg-sp-red-50 transform scale-105'
                              : 'border-spfc-gray-300 bg-white/80 backdrop-blur-sm hover:border-sp-red-300 hover:bg-sp-red-25'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-${tier.color} to-${tier.color}/80 flex items-center justify-center shadow-md`}>
                              <StarIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-spfc-gray-800">{tier.name}</h3>
                            <p className="text-sm text-spfc-gray-600 mb-4">{tier.description}</p>
                            
                            <div className="space-y-1 mb-4">
                              {tier.benefits.map((benefit, index) => (
                                <p key={index} className="text-xs text-spfc-gray-600">• {benefit}</p>
                              ))}
                            </div>
                            
                            <p className="text-xs text-sp-red-600 font-medium bg-sp-red-50 px-2 py-1 rounded-lg">{tier.requirement}</p>
                          </div>
                          
                          {selectedTier === tier.id && (
                            <motion.div
                              layoutId="selectedTier"
                              className="absolute inset-0 border-2 border-sp-red-500 rounded-2xl shadow-lg"
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={handleMintPass}
                      disabled={isMinting}
                      className="bg-gradient-to-r from-sp-red-600 to-sp-red-700 hover:from-sp-red-700 hover:to-sp-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:scale-105"
                    >
                      {isMinting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Criando Passe...</span>
                        </div>
                      ) : (
                        'Criar Passe Tricolor'
                      )}
              </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Navigation to Dashboard */}
              {authenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="text-center mt-12"
                >
                  <button
                    onClick={() => router.push('/home')}
                    className="px-8 py-3 bg-gradient-to-r from-spfc-gray-600 to-spfc-gray-700 text-white rounded-2xl font-semibold hover:from-spfc-gray-700 hover:to-spfc-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-spfc-gray-500"
                  >
                    Explorar Dashboard →
                  </button>
                  <p className="text-sm text-spfc-gray-600 mt-2">
                    Acesse quests, recompensas e sua coleção
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <section className="py-16 bg-gradient-to-b from-white to-spfc-gray-50 relative">
          <div className="absolute inset-0">
            <AnimatedBackground variant="football" className="opacity-10" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-spfc-gray-800">O que você pode fazer</h2>
              <p className="text-spfc-gray-600 text-lg">Experiências exclusivas para torcedores</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-spfc-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-br from-sp-red-500 to-sp-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-spfc-gray-800">Complete Missões</h3>
                <p className="text-spfc-gray-600">Escaneie QR codes no estádio, responda quizzes e faça palpites</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-spfc-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-spfc-gray-800">Ganhe XP</h3>
                <p className="text-spfc-gray-600">Acumule experiência e evolua seu nível de torcedor</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-spfc-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-spfc-gray-800">Resgate Prêmios</h3>
                <p className="text-spfc-gray-600">Descontos, produtos exclusivos e experiências VIP</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

