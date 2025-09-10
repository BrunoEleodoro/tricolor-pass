import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon,
  CogIcon,
  PlusIcon,
  QrCodeIcon,
  GiftIcon,
  ChartBarIcon,
  TrashIcon,
  PencilIcon
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

// Mock admin data
const mockQuests = [
  {
    id: 1,
    title: 'Escanear no Estádio',
    type: 'SCAN_QR',
    xpReward: 100,
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    status: 'ACTIVE',
    completions: 156
  },
  {
    id: 2,
    title: 'Palpite do Placar',
    type: 'PREDICTION',
    xpReward: 75,
    startDate: '2024-10-10',
    endDate: '2024-10-15',
    status: 'ACTIVE',
    completions: 89
  }
];

const mockRewards = [
  {
    id: 1,
    title: '20% OFF Loja Oficial',
    type: 'DISCOUNT',
    xpRequired: 100,
    totalSupply: 1000,
    claimedSupply: 234,
    validUntil: '2024-12-31',
    status: 'ACTIVE'
  },
  {
    id: 2,
    title: 'Experiência VIP',
    type: 'EXPERIENCE',
    xpRequired: 500,
    totalSupply: 50,
    claimedSupply: 12,
    validUntil: '2024-11-30',
    status: 'ACTIVE'
  }
];

const mockStats = {
  totalPasses: 1247,
  activeUsers: 892,
  questsCompleted: 3456,
  rewardsClaimed: 567,
  totalXPAwarded: 234567
};

export default function AdminPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const [activeTab, setActiveTab] = useState<'quests' | 'rewards' | 'stats'>('quests');
  const [showCreateQuest, setShowCreateQuest] = useState(false);
  const [showCreateReward, setShowCreateReward] = useState(false);
  const [questForm, setQuestForm] = useState({
    title: '',
    description: '',
    type: 'SCAN_QR',
    xpReward: 50,
    startDate: '',
    endDate: ''
  });
  const [rewardForm, setRewardForm] = useState({
    title: '',
    description: '',
    type: 'DISCOUNT',
    xpRequired: 100,
    totalSupply: 100,
    validUntil: ''
  });

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
      return;
    }
    
    // In a real app, check if user has admin privileges
    // For demo, we'll allow access
  }, [authenticated, router]);

  const handleCreateQuest = () => {
    // Validate form
    if (!questForm.title || !questForm.description || !questForm.startDate || !questForm.endDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Mock creation
    toast.success('Quest criada com sucesso!');
    setShowCreateQuest(false);
    setQuestForm({
      title: '',
      description: '',
      type: 'SCAN_QR',
      xpReward: 50,
      startDate: '',
      endDate: ''
    });
  };

  const handleCreateReward = () => {
    // Validate form
    if (!rewardForm.title || !rewardForm.description || !rewardForm.validUntil) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Mock creation
    toast.success('Recompensa criada com sucesso!');
    setShowCreateReward(false);
    setRewardForm({
      title: '',
      description: '',
      type: 'DISCOUNT',
      xpRequired: 100,
      totalSupply: 100,
      validUntil: ''
    });
  };

  const generateQRCodes = () => {
    toast.success('QR codes gerados com sucesso!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-400';
      case 'PAUSED': return 'bg-yellow-500/20 text-yellow-400';
      case 'ENDED': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      <Head>
        <title>Admin · Tricolor Pass</title>
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
                <CogIcon className="h-6 w-6 text-spfc-red" />
                <h1 className="text-xl font-semibold">Painel Admin</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-spfc-red/20 border border-spfc-red/30 rounded-lg p-4 mb-8"
          >
            <p className="text-sm">
              <strong>Acesso Administrativo:</strong> Você está acessando o painel de administração. 
              Tenha cuidado ao fazer alterações.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-spfc-gray-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setActiveTab('quests')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'quests'
                  ? 'bg-spfc-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Quests
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'rewards'
                  ? 'bg-spfc-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Recompensas
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'stats'
                  ? 'bg-spfc-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Relatórios
            </button>
          </div>

          {/* Quests Tab */}
          {activeTab === 'quests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gerenciar Quests</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={generateQRCodes}
                    className="bg-spfc-gray-100 hover:bg-spfc-gray-200 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <QrCodeIcon className="h-4 w-4" />
                    <span>Gerar QR Codes</span>
                  </button>
                  <button
                    onClick={() => setShowCreateQuest(true)}
                    className="bg-spfc-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Nova Quest</span>
                  </button>
                </div>
              </div>

              {/* Quest Creation Form */}
              {showCreateQuest && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-spfc-gray-100 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Criar Nova Quest</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Título *</label>
                      <input
                        type="text"
                        value={questForm.title}
                        onChange={(e) => setQuestForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo</label>
                      <select
                        value={questForm.type}
                        onChange={(e) => setQuestForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="SCAN_QR">Scanner QR</option>
                        <option value="QUIZ">Quiz</option>
                        <option value="PREDICTION">Palpite</option>
                        <option value="ATTENDANCE">Presença</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">XP Reward</label>
                      <input
                        type="number"
                        value={questForm.xpReward}
                        onChange={(e) => setQuestForm(prev => ({ ...prev, xpReward: parseInt(e.target.value) }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Data Início *</label>
                      <input
                        type="date"
                        value={questForm.startDate}
                        onChange={(e) => setQuestForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Descrição *</label>
                      <textarea
                        value={questForm.description}
                        onChange={(e) => setQuestForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white h-24"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCreateQuest}
                      className="bg-spfc-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Criar Quest
                    </button>
                    <button
                      onClick={() => setShowCreateQuest(false)}
                      className="bg-spfc-gray-200 hover:bg-spfc-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Quests List */}
              <div className="grid gap-4">
                {mockQuests.map((quest) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-spfc-gray-100 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold">{quest.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(quest.status)}`}>
                            {quest.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Tipo:</span>
                            <p className="font-medium">{quest.type}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">XP:</span>
                            <p className="font-medium text-spfc-red">{quest.xpReward}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Conclusões:</span>
                            <p className="font-medium">{quest.completions}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Período:</span>
                            <p className="font-medium">
                              {new Date(quest.startDate).toLocaleDateString('pt-BR')} - 
                              {new Date(quest.endDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors">
                          <PencilIcon className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors">
                          <TrashIcon className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gerenciar Recompensas</h2>
                <button
                  onClick={() => setShowCreateReward(true)}
                  className="bg-spfc-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Nova Recompensa</span>
                </button>
              </div>

              {/* Reward Creation Form */}
              {showCreateReward && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-spfc-gray-100 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Criar Nova Recompensa</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Título *</label>
                      <input
                        type="text"
                        value={rewardForm.title}
                        onChange={(e) => setRewardForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo</label>
                      <select
                        value={rewardForm.type}
                        onChange={(e) => setRewardForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="DISCOUNT">Desconto</option>
                        <option value="MERCHANDISE">Produto</option>
                        <option value="EXPERIENCE">Experiência</option>
                        <option value="TICKET">Ingresso</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">XP Necessário</label>
                      <input
                        type="number"
                        value={rewardForm.xpRequired}
                        onChange={(e) => setRewardForm(prev => ({ ...prev, xpRequired: parseInt(e.target.value) }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantidade Total</label>
                      <input
                        type="number"
                        value={rewardForm.totalSupply}
                        onChange={(e) => setRewardForm(prev => ({ ...prev, totalSupply: parseInt(e.target.value) }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Descrição *</label>
                      <textarea
                        value={rewardForm.description}
                        onChange={(e) => setRewardForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg px-3 py-2 text-white h-24"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCreateReward}
                      className="bg-spfc-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Criar Recompensa
                    </button>
                    <button
                      onClick={() => setShowCreateReward(false)}
                      className="bg-spfc-gray-200 hover:bg-spfc-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Rewards List */}
              <div className="grid gap-4">
                {mockRewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-spfc-gray-100 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold">{reward.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(reward.status)}`}>
                            {reward.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Tipo:</span>
                            <p className="font-medium">{reward.type}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">XP Necessário:</span>
                            <p className="font-medium text-spfc-red">{reward.xpRequired}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Disponibilidade:</span>
                            <p className="font-medium">
                              {reward.claimedSupply}/{reward.totalSupply}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Válido até:</span>
                            <p className="font-medium">
                              {new Date(reward.validUntil).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors">
                          <PencilIcon className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors">
                          <TrashIcon className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Relatórios</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-spfc-gray-100 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <ChartBarIcon className="h-8 w-8 text-spfc-red" />
                    <h3 className="text-lg font-semibold">Usuários</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Passes Criados</span>
                      <span className="font-bold text-2xl">{mockStats.totalPasses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Usuários Ativos</span>
                      <span className="font-bold text-xl text-green-400">{mockStats.activeUsers.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-spfc-gray-100 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <QrCodeIcon className="h-8 w-8 text-spfc-red" />
                    <h3 className="text-lg font-semibold">Quests</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completadas</span>
                      <span className="font-bold text-2xl">{mockStats.questsCompleted.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">XP Total Distribuído</span>
                      <span className="font-bold text-xl text-spfc-red">{mockStats.totalXPAwarded.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-spfc-gray-100 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <GiftIcon className="h-8 w-8 text-spfc-red" />
                    <h3 className="text-lg font-semibold">Recompensas</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resgatadas</span>
                      <span className="font-bold text-2xl">{mockStats.rewardsClaimed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taxa de Resgate</span>
                      <span className="font-bold text-xl text-yellow-400">45.6%</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="bg-spfc-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="bg-spfc-red hover:bg-red-700 text-white p-4 rounded-lg transition-colors text-center">
                    <QrCodeIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Gerar QR Lote</span>
                  </button>
                  
                  <button className="bg-spfc-gray-200 hover:bg-spfc-gray-300 text-white p-4 rounded-lg transition-colors text-center">
                    <GiftIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Criar Recompensa</span>
                  </button>
                  
                  <button className="bg-spfc-gray-200 hover:bg-spfc-gray-300 text-white p-4 rounded-lg transition-colors text-center">
                    <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Exportar Dados</span>
                  </button>
                  
                  <button className="bg-spfc-gray-200 hover:bg-spfc-gray-300 text-white p-4 rounded-lg transition-colors text-center">
                    <CogIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Configurações</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
