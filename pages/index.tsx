import { useState, useEffect } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

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

    return {
      props: {},
      redirect: { destination: "/home", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function WelcomePage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/home"),
  });
  const { authenticated, user } = usePrivy();
  const [selectedTier, setSelectedTier] = useState<'BRONZE' | 'SILVER' | 'GOLD'>('BRONZE');
  const [isMinting, setIsMinting] = useState(false);
  const [hasSpfcToken, setHasSpfcToken] = useState(false);
  
  // Simulate $SPFC token detection
  useEffect(() => {
    if (authenticated && user?.wallet) {
      // In real implementation, check user's wallet for $SPFC tokens
      setTimeout(() => {
        setHasSpfcToken(true);
      }, 1000);
    }
  }, [authenticated, user]);

  const handleMintPass = async () => {
    setIsMinting(true);
    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Passe Tricolor criado com sucesso!');
      
      // Add animation delay then redirect
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (error) {
      toast.error('Erro ao criar passe. Tente novamente.');
      setIsMinting(false);
    }
  };

  const tiers = [
    {
      id: 'BRONZE',
      name: 'Bronze',
      description: 'Entrada padrão no mundo Tricolor',
      color: 'spfc-bronze',
      benefits: ['XP por quests básicas', 'Recompensas limitadas'],
      requirement: '100+ $SPFC'
    },
    {
      id: 'SILVER',
      name: 'Prata',
      description: 'Experiência aprimorada',
      color: 'spfc-silver',
      benefits: ['XP bônus', 'Recompensas exclusivas', 'Acesso VIP'],
      requirement: '1000+ $SPFC'
    },
    {
      id: 'GOLD',
      name: 'Ouro',
      description: 'Máxima experiência Tricolor',
      color: 'spfc-gold',
      benefits: ['Máximo XP', 'Todas as recompensas', 'Experiências únicas'],
      requirement: '5000+ $SPFC'
    }
  ];

  return (
    <>
      <Head>
        <title>Tricolor Pass · SPFC</title>
        <meta name="description" content="Viva o SPFC todos os dias. Ganhe XP e desbloqueie benefícios de verdade." />
      </Head>

      <main className="min-h-screen bg-spfc-dark text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-spfc-red/20 to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="text-spfc-red">Tricolor</span> Pass
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
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
                    className="bg-spfc-red hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
                  >
                    Conectar Carteira
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* $SPFC Detection */}
                  <div className="bg-spfc-gray-100 rounded-lg p-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center space-x-3">
                      {hasSpfcToken ? (
                        <>
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                          <span className="text-green-400 font-medium">$SPFC detectado!</span>
                        </>
                      ) : (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-spfc-red" />
                          <span className="text-gray-400">Verificando $SPFC...</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tier Selection */}
                  {hasSpfcToken && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <h2 className="text-2xl font-semibold mb-6">Escolha seu nível</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
                        {tiers.map((tier) => (
                          <motion.div
                            key={tier.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTier(tier.id as any)}
                            className={`relative cursor-pointer p-6 rounded-lg border-2 transition-all duration-200 ${
                              selectedTier === tier.id
                                ? 'border-spfc-red bg-spfc-gray-100'
                                : 'border-spfc-gray-200 bg-spfc-gray-100/50 hover:border-spfc-gray-300'
                            }`}
                          >
                            <div className="text-center">
                              <StarIcon className={`h-8 w-8 mx-auto mb-3 text-${tier.color}`} />
                              <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                              <p className="text-sm text-gray-400 mb-4">{tier.description}</p>
                              
                              <div className="space-y-1 mb-4">
                                {tier.benefits.map((benefit, index) => (
                                  <p key={index} className="text-xs text-gray-300">• {benefit}</p>
                                ))}
                              </div>
                              
                              <p className="text-xs text-spfc-red font-medium">{tier.requirement}</p>
                            </div>
                            
                            {selectedTier === tier.id && (
                              <motion.div
                                layoutId="selectedTier"
                                className="absolute inset-0 border-2 border-spfc-red rounded-lg"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <button
                        onClick={handleMintPass}
                        disabled={isMinting}
                        className="bg-spfc-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
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
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <section className="py-16 bg-spfc-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">O que você pode fazer</h2>
              <p className="text-gray-400 text-lg">Experiências exclusivas para torcedores</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center p-6"
              >
                <div className="bg-spfc-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Missões</h3>
                <p className="text-gray-400">Escaneie QR codes no estádio, responda quizzes e faça palpites</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-center p-6"
              >
                <div className="bg-spfc-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Ganhe XP</h3>
                <p className="text-gray-400">Acumule experiência e evolua seu nível de torcedor</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-center p-6"
              >
                <div className="bg-spfc-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Resgate Prêmios</h3>
                <p className="text-gray-400">Descontos, produtos exclusivos e experiências VIP</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
