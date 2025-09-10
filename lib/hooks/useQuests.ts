import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  CONTRACT_ADDRESSES, 
  QUEST_MANAGER_ABI, 
  QuestType,
  formatQuestType 
} from '../contracts';
import { useTricolorPass } from './useTricolorPass';
import toast from 'react-hot-toast';

export interface Quest {
  id: number;
  title: string;
  description: string;
  questType: QuestType;
  questTypeName: string;
  xpReward: number;
  startTime: number;
  endTime: number;
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
  isRepeatable: boolean;
  maxCompletions: number;
  currentCompletions: number;
  verificationData: string;
}

export interface QuestStatus {
  canComplete: boolean;
  hasCompleted: boolean;
  completionCount: number;
}

export function useQuests() {
  const { user, authenticated } = usePrivy();
  const { awardXP } = useTricolorPass();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock quest data
  const mockQuests: Quest[] = [
    {
      id: 1,
      title: 'Escanear no Estádio',
      description: 'Escaneie o QR code oficial no Morumbi durante o jogo',
      questType: QuestType.SCAN_QR,
      questTypeName: formatQuestType(QuestType.SCAN_QR),
      xpReward: 100,
      startTime: Date.now() - 86400000, // Yesterday
      endTime: Date.now() + 86400000, // Tomorrow
      status: 'ACTIVE',
      isRepeatable: false,
      maxCompletions: 1000,
      currentCompletions: 156,
      verificationData: '0x1234567890abcdef'
    },
    {
      id: 2,
      title: 'Palpite do Placar',
      description: 'Qual será o placar de SPFC x Palmeiras?',
      questType: QuestType.PREDICTION,
      questTypeName: formatQuestType(QuestType.PREDICTION),
      xpReward: 75,
      startTime: Date.now() - 3600000, // 1 hour ago
      endTime: Date.now() + 3600000 * 24, // 24 hours from now
      status: 'ACTIVE',
      isRepeatable: false,
      maxCompletions: 500,
      currentCompletions: 89,
      verificationData: '0xabcdef1234567890'
    },
    {
      id: 3,
      title: 'Quiz Relâmpago',
      description: 'Pergunta sobre a história do SPFC',
      questType: QuestType.QUIZ,
      questTypeName: formatQuestType(QuestType.QUIZ),
      xpReward: 50,
      startTime: Date.now() - 7200000, // 2 hours ago
      endTime: Date.now() + 2700000, // 45 minutes from now
      status: 'ACTIVE',
      isRepeatable: true,
      maxCompletions: 1000,
      currentCompletions: 234,
      verificationData: '0x567890abcdef1234'
    }
  ];

  // Fetch active quests
  const fetchActiveQuests = async () => {
    if (!authenticated || !CONTRACT_ADDRESSES.QUEST_MANAGER) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, using mock data
      // In production, you would make actual blockchain calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const activeQuests = mockQuests.filter(quest => 
        quest.status === 'ACTIVE' && 
        Date.now() >= quest.startTime && 
        Date.now() <= quest.endTime &&
        quest.currentCompletions < quest.maxCompletions
      );

      setQuests(activeQuests);
    } catch (err: any) {
      console.error('Error fetching quests:', err);
      setError(err.message || 'Failed to fetch quests');
    } finally {
      setLoading(false);
    }
  };

  // Complete a quest
  const completeQuest = async (questId: number, proof: string): Promise<boolean> => {
    if (!authenticated || !user?.wallet?.address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    const quest = quests.find(q => q.id === questId);
    if (!quest) {
      toast.error('Quest not found');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock quest completion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Award XP to user
      const success = await awardXP(quest.xpReward);
      
      if (success) {
        // Update quest completion count
        setQuests(prev => prev.map(q => 
          q.id === questId 
            ? { ...q, currentCompletions: q.currentCompletions + 1 }
            : q
        ));

        toast.success(`Quest completed! +${quest.xpReward} XP awarded`);
        return true;
      }

      return false;
    } catch (err: any) {
      console.error('Error completing quest:', err);
      setError(err.message || 'Failed to complete quest');
      toast.error('Failed to complete quest');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get quest status for user
  const getQuestStatus = async (questId: number): Promise<QuestStatus | null> => {
    if (!authenticated || !user?.wallet?.address) {
      return null;
    }

    try {
      // Mock quest status
      // In production, this would be a blockchain call
      const status: QuestStatus = {
        canComplete: true,
        hasCompleted: false,
        completionCount: 0
      };

      return status;
    } catch (err: any) {
      console.error('Error getting quest status:', err);
      return null;
    }
  };

  // Create a new quest (admin function)
  const createQuest = async (questData: {
    title: string;
    description: string;
    questType: QuestType;
    xpReward: number;
    startTime: number;
    endTime: number;
    isRepeatable: boolean;
    maxCompletions: number;
    verificationData: string;
  }): Promise<boolean> => {
    if (!authenticated || !user?.wallet?.address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock quest creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newQuest: Quest = {
        id: Date.now(), // Mock ID
        ...questData,
        questTypeName: formatQuestType(questData.questType),
        status: 'ACTIVE',
        currentCompletions: 0
      };

      setQuests(prev => [...prev, newQuest]);
      toast.success('Quest created successfully!');
      return true;
    } catch (err: any) {
      console.error('Error creating quest:', err);
      setError(err.message || 'Failed to create quest');
      toast.error('Failed to create quest');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Format time remaining
  const getTimeRemaining = (endTime: number): string => {
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Fetch quests on mount and when user changes
  useEffect(() => {
    fetchActiveQuests();
  }, [authenticated, user?.wallet?.address]);

  return {
    quests,
    loading,
    error,
    fetchActiveQuests,
    completeQuest,
    getQuestStatus,
    createQuest,
    getTimeRemaining
  };
}
