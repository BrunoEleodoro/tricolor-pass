import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  CONTRACT_ADDRESSES, 
  REWARD_DISTRIBUTOR_ABI, 
  RewardType,
  PassTier,
  formatRewardType 
} from '../contracts';
import { useTricolorPass } from './useTricolorPass';
import toast from 'react-hot-toast';

export interface Reward {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  rewardType: RewardType;
  rewardTypeName: string;
  xpRequired: number;
  minTierRequired: PassTier;
  totalSupply: number;
  claimedSupply: number;
  validFrom: number;
  validUntil: number;
  isActive: boolean;
  metadataURI: string;
  redeemCode: string;
  terms?: string[];
  howToUse?: string;
  image?: string;
  rarity?: string;
}

export interface UserReward {
  rewardId: number;
  user: string;
  claimedAt: number;
  status: 'CLAIMED' | 'USED' | 'EXPIRED';
  redemptionCode: string;
  usedAt: number;
  reward?: Reward;
}

export function useRewards() {
  const { user, authenticated } = usePrivy();
  const { passInfo } = useTricolorPass();
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock rewards data
  const mockRewards: Reward[] = [
    {
      id: 1,
      title: '20% OFF Loja Oficial',
      description: 'Desconto em qualquer produto da loja oficial do SPFC',
      longDescription: 'Aproveite 20% de desconto em camisas, bonés, canecas e muito mais na loja oficial do São Paulo FC. Válido para compras online e na loja física.',
      rewardType: RewardType.DISCOUNT_COUPON,
      rewardTypeName: formatRewardType(RewardType.DISCOUNT_COUPON),
      xpRequired: 100,
      minTierRequired: PassTier.BRONZE,
      totalSupply: 1000,
      claimedSupply: 234,
      validFrom: Date.now() - 86400000,
      validUntil: Date.now() + 86400000 * 90, // 90 days
      isActive: true,
      metadataURI: 'https://tricolorpass.com/metadata/discount1',
      redeemCode: '0x1234567890abcdef',
      image: '🛍️',
      rarity: 'Garantida',
      terms: [
        'Válido apenas uma vez por usuário',
        'Não cumulativo com outras promoções',
        'Válido para produtos sem desconto'
      ],
      howToUse: 'Apresente o QR code no caixa da loja física ou use o código no checkout online'
    },
    {
      id: 2,
      title: 'Experiência VIP',
      description: 'Tour exclusivo pelo CT da Barra Funda',
      longDescription: 'Conheça os bastidores do Centro de Treinamento da Barra Funda em um tour exclusivo com direito a foto no gramado e visita aos vestiários.',
      rewardType: RewardType.EXPERIENCE,
      rewardTypeName: formatRewardType(RewardType.EXPERIENCE),
      xpRequired: 500,
      minTierRequired: PassTier.SILVER,
      totalSupply: 50,
      claimedSupply: 12,
      validFrom: Date.now() - 86400000,
      validUntil: Date.now() + 86400000 * 60, // 60 days
      isActive: true,
      metadataURI: 'https://tricolorpass.com/metadata/vip1',
      redeemCode: '0xabcdef1234567890',
      image: '🏟️',
      rarity: 'Sorteio',
      terms: [
        'Sujeito à disponibilidade',
        'Tour realizado aos sábados',
        'Máximo 2 acompanhantes'
      ],
      howToUse: 'Entre em contato via WhatsApp oficial do clube para agendar'
    },
    {
      id: 3,
      title: 'Ingresso Setor Especial',
      description: 'Ingresso para arquibancada especial no próximo jogo',
      longDescription: 'Garanta seu lugar na arquibancada especial do Morumbi para o próximo jogo em casa. Inclui kit lanche e estacionamento gratuito.',
      rewardType: RewardType.MERCHANDISE,
      rewardTypeName: formatRewardType(RewardType.MERCHANDISE),
      xpRequired: 300,
      minTierRequired: PassTier.BRONZE,
      totalSupply: 100,
      claimedSupply: 45,
      validFrom: Date.now() - 86400000,
      validUntil: Date.now() + 86400000 * 20, // 20 days
      isActive: true,
      metadataURI: 'https://tricolorpass.com/metadata/ticket1',
      redeemCode: '0x567890abcdef1234',
      image: '🎫',
      rarity: 'Limitada',
      terms: [
        'Válido apenas para o próximo jogo em casa',
        'Intransferível',
        'Chegada até 1h antes do jogo'
      ],
      howToUse: 'Apresente o QR code na entrada do estádio junto com documento'
    }
  ];

  // Mock user rewards
  const mockUserRewards: UserReward[] = [
    {
      rewardId: 1,
      user: user?.wallet?.address || '',
      claimedAt: Date.now() - 86400000 * 5, // 5 days ago
      status: 'CLAIMED',
      redemptionCode: 'SPFC20OFF789',
      usedAt: 0
    }
  ];

  // Fetch available rewards for user
  const fetchAvailableRewards = async () => {
    if (!authenticated || !passInfo?.hasPass || !CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, using mock data
      // Filter rewards based on user's XP and tier
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = mockRewards.filter(reward => 
        reward.isActive &&
        Date.now() >= reward.validFrom &&
        Date.now() <= reward.validUntil &&
        reward.claimedSupply < reward.totalSupply &&
        passInfo.xpPoints >= reward.xpRequired &&
        passInfo.tier >= reward.minTierRequired
      );

      setAvailableRewards(filtered);
    } catch (err: any) {
      console.error('Error fetching available rewards:', err);
      setError(err.message || 'Failed to fetch available rewards');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's claimed rewards
  const fetchUserRewards = async () => {
    if (!authenticated || !user?.wallet?.address || !CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const rewardsWithDetails = mockUserRewards.map(userReward => ({
        ...userReward,
        reward: mockRewards.find(r => r.id === userReward.rewardId)
      }));

      setUserRewards(rewardsWithDetails);
    } catch (err: any) {
      console.error('Error fetching user rewards:', err);
      setError(err.message || 'Failed to fetch user rewards');
    } finally {
      setLoading(false);
    }
  };

  // Claim a reward
  const claimReward = async (rewardId: number): Promise<{ success: boolean; redemptionCode?: string }> => {
    if (!authenticated || !user?.wallet?.address) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    if (!passInfo?.hasPass) {
      toast.error('You must have a Tricolor Pass to claim rewards');
      return { success: false };
    }

    const reward = availableRewards.find(r => r.id === rewardId);
    if (!reward) {
      toast.error('Reward not found');
      return { success: false };
    }

    // Check eligibility
    if (passInfo.xpPoints < reward.xpRequired) {
      toast.error(`Insufficient XP. You need ${reward.xpRequired} XP but have ${passInfo.xpPoints} XP`);
      return { success: false };
    }

    if (passInfo.tier < reward.minTierRequired) {
      toast.error('Insufficient tier level');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      // Mock reward claiming
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const redemptionCode = `SPFC${rewardId}${Date.now().toString().slice(-6)}`;
      
      // Add to user rewards
      const newUserReward: UserReward = {
        rewardId,
        user: user.wallet.address,
        claimedAt: Date.now(),
        status: 'CLAIMED',
        redemptionCode,
        usedAt: 0,
        reward
      };

      setUserRewards(prev => [...prev, newUserReward]);
      
      // Update available rewards (reduce supply)
      setAvailableRewards(prev => prev.map(r => 
        r.id === rewardId 
          ? { ...r, claimedSupply: r.claimedSupply + 1 }
          : r
      ));

      toast.success('Reward claimed successfully!');
      return { success: true, redemptionCode };
    } catch (err: any) {
      console.error('Error claiming reward:', err);
      setError(err.message || 'Failed to claim reward');
      toast.error('Failed to claim reward');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Use a reward
  const useReward = async (rewardId: number, providedCode: string): Promise<boolean> => {
    if (!authenticated || !user?.wallet?.address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    const userReward = userRewards.find(ur => ur.rewardId === rewardId);
    if (!userReward) {
      toast.error('Reward not found in your collection');
      return false;
    }

    if (userReward.status !== 'CLAIMED') {
      toast.error('Reward cannot be used');
      return false;
    }

    if (userReward.redemptionCode !== providedCode) {
      toast.error('Invalid redemption code');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock reward usage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user reward status
      setUserRewards(prev => prev.map(ur => 
        ur.rewardId === rewardId 
          ? { ...ur, status: 'USED', usedAt: Date.now() }
          : ur
      ));

      toast.success('Reward marked as used!');
      return true;
    } catch (err: any) {
      console.error('Error using reward:', err);
      setError(err.message || 'Failed to use reward');
      toast.error('Failed to use reward');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create a new reward (admin function)
  const createReward = async (rewardData: {
    title: string;
    description: string;
    rewardType: RewardType;
    xpRequired: number;
    minTierRequired: PassTier;
    totalSupply: number;
    validFrom: number;
    validUntil: number;
    metadataURI: string;
    redeemCode: string;
  }): Promise<boolean> => {
    if (!authenticated || !user?.wallet?.address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock reward creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReward: Reward = {
        id: Date.now(), // Mock ID
        ...rewardData,
        rewardTypeName: formatRewardType(rewardData.rewardType),
        claimedSupply: 0,
        isActive: true
      };

      setAvailableRewards(prev => [...prev, newReward]);
      toast.success('Reward created successfully!');
      return true;
    } catch (err: any) {
      console.error('Error creating reward:', err);
      setError(err.message || 'Failed to create reward');
      toast.error('Failed to create reward');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get reward by ID
  const getRewardById = (id: number): Reward | undefined => {
    return mockRewards.find(r => r.id === id);
  };

  // Format validity period
  const getValidityPeriod = (validUntil: number): string => {
    const now = Date.now();
    const diff = validUntil - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    if (passInfo?.hasPass) {
      fetchAvailableRewards();
      fetchUserRewards();
    }
  }, [authenticated, user?.wallet?.address, passInfo]);

  return {
    availableRewards,
    userRewards,
    loading,
    error,
    fetchAvailableRewards,
    fetchUserRewards,
    claimReward,
    useReward,
    createReward,
    getRewardById,
    getValidityPeriod
  };
}
