import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Head from "next/head";
import { motion } from "framer-motion";
import { 
  StarIcon, 
  FireIcon, 
  GiftIcon, 
  QrCodeIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  ClockIcon,
  ArrowRightIcon,
  WalletIcon
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

// Mock data - in real implementation, this would come from smart contracts
const mockUserData = {
  passLevel: 'SILVER',
  currentXP: 2150,
  nextLevelXP: 5000,
  weeklyXPGoal: 500,
  weeklyXPCurrent: 350,
  nextGame: {
    opponent: 'Palmeiras',
    date: '2024-10-15',
    time: '16:00',
    location: 'Morumbi'
  }
};

const mockQuests = [
  {
    id: 1,
    title: 'Escanear no Estádio',
    description: 'Escaneie o QR code oficial no Morumbi',
    type: 'SCAN_QR',
    xpReward: 100,
    timeLeft: '2h 30m',
    icon: QrCodeIcon,
    difficulty: 'Fácil',
    available: true
  },
  {
    id: 2,
    title: 'Palpite do Placar',
    description: 'Qual será o placar de SPFC x Palmeiras?',
    type: 'PREDICTION',
    xpReward: 75,
    timeLeft: '1d 4h',
    icon: TrophyIcon,
    difficulty: 'Médio',
    available: true
  },
  {
    id: 3,
    title: 'Quiz Relâmpago',
    description: 'Pergunta sobre a história do SPFC',
    type: 'QUIZ',
    xpReward: 50,
    timeLeft: '45m',
    icon: PuzzlePieceIcon,
    difficulty: 'Fácil',
    available: true
  }
];

const mockRewards = [
  {
    id: 1,
    title: '20% OFF Loja Oficial',
    description: 'Desconto em produtos da loja oficial',
    type: 'DISCOUNT',
    rarity: 'Garantida',
    image: '🛍️'
  },
  {
    id: 2,
    title: 'Experiência VIP',
    description: 'Tour pelo CT da Barra Funda',
    type: 'EXPERIENCE',
    rarity: 'Sorteio',
    image: '🏟️'
  }
];

export default function HomePage() {
  const router = useRouter();
  const { authenticated, user, logout } = usePrivy();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
      return;
    }
    setLoading(false);
  }, [authenticated, router]);

  const handleQuestClick = (quest: any) => {
    router.push(`/quest/${quest.id}`);
  };

  const handleRewardsClick = () => {
    router.push('/rewards');
  };

  const getPassColor = (level: string) => {
    switch (level) {
      case 'GOLD': return 'text-spfc-gold';
      case 'SILVER': return 'text-spfc-silver';
      case 'BRONZE': return 'text-spfc-bronze';
      default: return 'text-gray-400';
    }
  };

  const getXPProgress = () => {
    return (mockUserData.currentXP / mockUserData.nextLevelXP) * 100;
  };

  const getWeeklyProgress = () => {
    return (mockUserData.weeklyXPCurrent / mockUserData.weeklyXPGoal) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-spfc-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spfc-red"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Home · Tricolor Pass</title>
      </Head>

      <main className="min-h-screen bg-spfc-dark text-white">
        {/* Header */}
        <header className="bg-spfc-gray-100 border-b border-spfc-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">
                  <span className="text-spfc-red">Tricolor</span> Pass
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Bem-vindo</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}</p>
                    {user?.wallet?.address && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.wallet.address);
                          toast.success('Endereço copiado!');
                        }}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                        title="Copiar endereço completo"
                      >
                        📋
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Spicy Testnet •{' '}
                    <a 
                      href="https://testnet.chiliscan.com/faucet" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-spfc-red hover:underline"
                    >
                      CHZ Faucet
                    </a>
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-spfc-gray-100 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-spfc-red/20 rounded-full flex items-center justify-center">
                  <StarIcon className={`h-8 w-8 ${getPassColor(mockUserData.passLevel)}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Passe {mockUserData.passLevel}</h2>
                  <p className="text-gray-400">Nível {mockUserData.passLevel.toLowerCase()}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold">{mockUserData.currentXP.toLocaleString()} XP</p>
                <p className="text-sm text-gray-400">
                  {(mockUserData.nextLevelXP - mockUserData.currentXP).toLocaleString()} para próximo nível
                </p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso do Nível</span>
                  <span>{getXPProgress().toFixed(1)}%</span>
                </div>
                <div className="w-full bg-spfc-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getXPProgress()}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-spfc-red to-red-400 h-3 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Meta Semanal</span>
                  <span>{getWeeklyProgress().toFixed(1)}%</span>
                </div>
                <div className="w-full bg-spfc-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getWeeklyProgress()}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {mockUserData.weeklyXPCurrent}/{mockUserData.weeklyXPGoal} XP esta semana
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Próximo Jogo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-spfc-red/20 to-spfc-red/10 rounded-lg p-6 border border-spfc-red/30"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FireIcon className="h-6 w-6 text-spfc-red mr-2" />
                  Próximo Jogo
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold mb-1">SPFC vs {mockUserData.nextGame.opponent}</p>
                    <p className="text-gray-300">
                      {new Date(mockUserData.nextGame.date).toLocaleDateString('pt-BR')} às {mockUserData.nextGame.time}
                    </p>
                    <p className="text-sm text-gray-400">{mockUserData.nextGame.location}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Missões especiais</p>
                    <p className="text-spfc-red font-medium">disponíveis!</p>
                  </div>
                </div>
              </motion.div>

              {/* Quests do Dia */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Missões do Dia</h3>
                  <p className="text-sm text-gray-400">{mockQuests.length} disponíveis</p>
                </div>

                <div className="grid gap-4">
                  {mockQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => handleQuestClick(quest)}
                      className="bg-spfc-gray-100 rounded-lg p-4 cursor-pointer hover:bg-spfc-gray-200 transition-colors duration-200 border border-transparent hover:border-spfc-red/30"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-spfc-red/20 rounded-lg flex items-center justify-center">
                          <quest.icon className="h-6 w-6 text-spfc-red" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{quest.title}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-spfc-red font-semibold">+{quest.xpReward} XP</span>
                              <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-spfc-gray-200 px-2 py-1 rounded">
                              {quest.difficulty}
                            </span>
                            <div className="flex items-center text-xs text-gray-400">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {quest.timeLeft}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Recompensas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-spfc-gray-100 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <GiftIcon className="h-5 w-5 text-spfc-red mr-2" />
                    Recompensas
                  </h3>
                  <button
                    onClick={handleRewardsClick}
                    className="text-sm text-spfc-red hover:text-red-400 transition-colors"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="space-y-3">
                  {mockRewards.slice(0, 2).map((reward, index) => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-spfc-gray-200 rounded p-3 cursor-pointer hover:bg-spfc-gray-300 transition-colors"
                      onClick={handleRewardsClick}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{reward.image}</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{reward.title}</h4>
                          <p className="text-xs text-gray-400">{reward.description}</p>
                          <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                            reward.rarity === 'Garantida' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {reward.rarity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Stats Rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-spfc-gray-100 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Esta Semana</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Missões completadas</span>
                    <span className="font-medium">7</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">XP ganho</span>
                    <span className="font-medium text-green-400">+{mockUserData.weeklyXPCurrent}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posição no ranking</span>
                    <span className="font-medium text-spfc-red">#42</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
