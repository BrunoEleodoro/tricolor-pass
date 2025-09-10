import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeftIcon,
  GiftIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  QrCodeIcon,
  TicketIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import QRCode from "qrcode";

// Mock rewards data
const mockRewards = [
  {
    id: 1,
    title: '20% OFF Loja Oficial',
    description: 'Desconto em qualquer produto da loja oficial do SPFC',
    longDescription: 'Aproveite 20% de desconto em camisas, bonés, canecas e muito mais na loja oficial do São Paulo FC. Válido para compras online e na loja física.',
    type: 'DISCOUNT',
    rarity: 'Garantida',
    xpRequired: 100,
    available: true,
    validUntil: '2024-12-31',
    image: '🛍️',
    terms: ['Válido apenas uma vez por usuário', 'Não cumulativo com outras promoções', 'Válido para produtos sem desconto'],
    howToUse: 'Apresente o QR code no caixa da loja física ou use o código no checkout online'
  },
  {
    id: 2,
    title: 'Experiência VIP',
    description: 'Tour exclusivo pelo CT da Barra Funda',
    longDescription: 'Conheça os bastidores do Centro de Treinamento da Barra Funda em um tour exclusivo com direito a foto no gramado e visita aos vestiários.',
    type: 'EXPERIENCE',
    rarity: 'Sorteio',
    xpRequired: 500,
    available: true,
    validUntil: '2024-11-30',
    image: '🏟️',
    terms: ['Sujeito à disponibilidade', 'Tour realizado aos sábados', 'Máximo 2 acompanhantes'],
    howToUse: 'Entre em contato via WhatsApp oficial do clube para agendar'
  },
  {
    id: 3,
    title: 'Ingresso Setor Especial',
    description: 'Ingresso para arquibancada especial no próximo jogo',
    longDescription: 'Garanta seu lugar na arquibancada especial do Morumbi para o próximo jogo em casa. Inclui kit lanche e estacionamento gratuito.',
    type: 'TICKET',
    rarity: 'Limitada',
    xpRequired: 300,
    available: true,
    validUntil: '2024-10-20',
    image: '🎫',
    terms: ['Válido apenas para o próximo jogo em casa', 'Intransferível', 'Chegada até 1h antes do jogo'],
    howToUse: 'Apresente o QR code na entrada do estádio junto com documento'
  },
  {
    id: 4,
    title: 'Camisa Autografada',
    description: 'Camisa oficial autografada pelo elenco',
    longDescription: 'Camisa oficial 2024 autografada pelos principais jogadores do elenco tricolor. Peça de colecionador exclusiva.',
    type: 'MERCHANDISE',
    rarity: 'Épica',
    xpRequired: 1000,
    available: false,
    validUntil: '2024-12-31',
    image: '👕',
    terms: ['Edição limitada', 'Não escolha de tamanho', 'Entrega em até 30 dias'],
    howToUse: 'Aguarde contato da equipe do clube para organizar a entrega'
  }
];

const mockUserRewards = [
  {
    id: 1,
    rewardId: 1,
    claimedAt: '2024-10-01',
    status: 'CLAIMED',
    redemptionCode: 'SPFC20OFF789',
    usedAt: null
  },
  {
    id: 2,
    rewardId: 3,
    claimedAt: '2024-09-28',
    status: 'USED',
    redemptionCode: 'TICKET456',
    usedAt: '2024-09-30'
  }
];

export default function RewardsPage() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState<'available' | 'claimed'>('available');
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [userXP] = useState(750); // Mock user XP

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
      return;
    }
  }, [authenticated, router]);

  const availableRewards = mockRewards.filter(reward => 
    reward.available && userXP >= reward.xpRequired
  );

  const claimedRewards = mockUserRewards.map(userReward => {
    const reward = mockRewards.find(r => r.id === userReward.rewardId);
    return { ...reward, ...userReward };
  });

  const handleClaimReward = async (reward: any) => {
    setIsClaiming(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate QR code
      const redemptionCode = `SPFC${reward.id}${Date.now().toString().slice(-6)}`;
      const qrUrl = await QRCode.toDataURL(redemptionCode);
      setQrCodeUrl(qrUrl);
      
      toast.success('Recompensa resgatada com sucesso!');
      
      // Update selected reward with claimed status
      setSelectedReward({
        ...reward,
        status: 'CLAIMED',
        redemptionCode,
        claimedAt: new Date().toISOString().split('T')[0]
      });
      
    } catch (error) {
      toast.error('Erro ao resgatar recompensa');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleMarkAsUsed = () => {
    toast.success('Recompensa marcada como usada!');
    setSelectedReward({
      ...selectedReward,
      status: 'USED',
      usedAt: new Date().toISOString().split('T')[0]
    });
  };

  const openRewardModal = (reward: any) => {
    setSelectedReward(reward);
    setShowModal(true);
    
    // If reward is already claimed, generate QR code
    if (reward.redemptionCode) {
      QRCode.toDataURL(reward.redemptionCode).then(setQrCodeUrl);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReward(null);
    setQrCodeUrl('');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Garantida': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Limitada': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Épica': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Sorteio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLAIMED': return 'bg-blue-500/20 text-blue-400';
      case 'USED': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  return (
    <>
      <Head>
        <title>Recompensas · Tricolor Pass</title>
      </Head>

      <main className="min-h-screen bg-spfc-dark text-white">
        {/* Header */}
        <header className="bg-spfc-gray-100 border-b border-spfc-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/home')}
                className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <GiftIcon className="h-6 w-6 text-spfc-red" />
                <h1 className="text-xl font-semibold">Recompensas</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-spfc-gray-100 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Seus Pontos</h2>
                <p className="text-3xl font-bold text-spfc-red">{userXP.toLocaleString()} XP</p>
                <p className="text-sm text-gray-400">Disponível para resgates</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Recompensas resgatadas</p>
                <p className="text-2xl font-bold">{claimedRewards.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-spfc-gray-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'available'
                  ? 'bg-spfc-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Disponíveis ({availableRewards.length})
            </button>
            <button
              onClick={() => setActiveTab('claimed')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'claimed'
                  ? 'bg-spfc-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Resgatadas ({claimedRewards.length})
            </button>
          </div>

          {/* Rewards Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === 'available' && availableRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openRewardModal(reward)}
                className="bg-spfc-gray-100 rounded-lg p-6 cursor-pointer hover:bg-spfc-gray-200 transition-colors border border-transparent hover:border-spfc-red/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{reward.image}</span>
                  <span className={`px-2 py-1 rounded text-xs border ${getRarityColor(reward.rarity)}`}>
                    {reward.rarity}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{reward.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-spfc-red font-semibold">{reward.xpRequired} XP</span>
                  <div className="flex items-center text-xs text-gray-400">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Válido até {new Date(reward.validUntil).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </motion.div>
            ))}

            {activeTab === 'claimed' && claimedRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openRewardModal(reward)}
                className="bg-spfc-gray-100 rounded-lg p-6 cursor-pointer hover:bg-spfc-gray-200 transition-colors border border-transparent hover:border-spfc-red/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{reward.image}</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(reward.status)}`}>
                    {reward.status === 'CLAIMED' ? 'Resgatada' : 'Usada'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{reward.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                
                <div className="text-xs text-gray-400">
                  <p>Resgatada em {new Date(reward.claimedAt).toLocaleDateString('pt-BR')}</p>
                  {reward.usedAt && (
                    <p>Usada em {new Date(reward.usedAt).toLocaleDateString('pt-BR')}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty States */}
          {activeTab === 'available' && availableRewards.length === 0 && (
            <div className="text-center py-12">
              <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma recompensa disponível</h3>
              <p className="text-gray-400">Complete mais missões para desbloquear recompensas!</p>
            </div>
          )}

          {activeTab === 'claimed' && claimedRewards.length === 0 && (
            <div className="text-center py-12">
              <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma recompensa resgatada</h3>
              <p className="text-gray-400">Resgate sua primeira recompensa na aba "Disponíveis"!</p>
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && selectedReward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-spfc-gray-100 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{selectedReward.image}</span>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedReward.title}</h2>
                      <span className={`px-2 py-1 rounded text-xs border ${getRarityColor(selectedReward.rarity || 'Garantida')}`}>
                        {selectedReward.rarity || 'Garantida'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-gray-300">{selectedReward.longDescription}</p>
                  </div>

                  {/* QR Code or Claim Button */}
                  {selectedReward.redemptionCode ? (
                    <div className="text-center">
                      <h3 className="font-semibold mb-4">Código de Resgate</h3>
                      
                      {qrCodeUrl && (
                        <div className="bg-white p-4 rounded-lg inline-block mb-4">
                          <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                        </div>
                      )}
                      
                      <div className="bg-spfc-gray-200 p-3 rounded-lg mb-4">
                        <p className="font-mono text-lg">{selectedReward.redemptionCode}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Como usar:</h4>
                        <p className="text-sm text-gray-400">{selectedReward.howToUse}</p>
                      </div>

                      {selectedReward.status === 'CLAIMED' && (
                        <button
                          onClick={handleMarkAsUsed}
                          className="bg-spfc-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          Marcar como Usada
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-spfc-gray-200 p-4 rounded-lg mb-4">
                        <p className="text-spfc-red font-semibold text-lg">{selectedReward.xpRequired} XP</p>
                        <p className="text-sm text-gray-400">Custo para resgatar</p>
                      </div>
                      
                      <button
                        onClick={() => handleClaimReward(selectedReward)}
                        disabled={isClaiming}
                        className="bg-spfc-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                      >
                        {isClaiming ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            <span>Resgatando...</span>
                          </div>
                        ) : (
                          'Resgatar'
                        )}
                      </button>
                    </div>
                  )}

                  {/* Terms */}
                  <div>
                    <h3 className="font-semibold mb-2">Termos e Condições</h3>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {selectedReward.terms?.map((term: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-spfc-red mr-2">•</span>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-xs text-gray-400 pt-4 border-t border-spfc-gray-200">
                    Válido até: {new Date(selectedReward.validUntil).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
