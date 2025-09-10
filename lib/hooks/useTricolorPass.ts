import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { 
  CONTRACT_ADDRESSES, 
  TRICOLOR_PASS_ABI, 
  getContract,
  PassTier,
  formatTierName 
} from '../contracts';
import toast from 'react-hot-toast';

export interface PassInfo {
  tokenId: number;
  tier: PassTier;
  tierName: string;
  xpPoints: number;
  isActive: boolean;
  hasPass: boolean;
}

export function useTricolorPass() {
  const { user, authenticated } = usePrivy();
  const [passInfo, setPassInfo] = useState<PassInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's pass information
  const fetchPassInfo = async () => {
    if (!authenticated || !user?.wallet?.address || !CONTRACT_ADDRESSES.TRICOLOR_PASS) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll use mock data
      // In production, you would use actual blockchain calls
      const mockPassInfo: PassInfo = {
        tokenId: 123,
        tier: PassTier.SILVER,
        tierName: formatTierName(PassTier.SILVER),
        xpPoints: 2150,
        isActive: true,
        hasPass: true
      };

      setPassInfo(mockPassInfo);
    } catch (err: any) {
      console.error('Error fetching pass info:', err);
      setError(err.message || 'Failed to fetch pass information');
    } finally {
      setLoading(false);
    }
  };

  // Mint a new pass
  const mintPass = async (tier: PassTier): Promise<boolean> => {
    if (!authenticated || !user?.wallet?.address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    if (!CONTRACT_ADDRESSES.TRICOLOR_PASS) {
      toast.error('Contract not deployed yet');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPassInfo: PassInfo = {
        tokenId: Math.floor(Math.random() * 1000),
        tier,
        tierName: formatTierName(tier),
        xpPoints: 0,
        isActive: true,
        hasPass: true
      };

      setPassInfo(newPassInfo);
      toast.success(`${formatTierName(tier)} Pass minted successfully!`);
      return true;
    } catch (err: any) {
      console.error('Error minting pass:', err);
      setError(err.message || 'Failed to mint pass');
      toast.error('Failed to mint pass');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Award XP to user (admin function)
  const awardXP = async (xpAmount: number): Promise<boolean> => {
    if (!authenticated || !passInfo?.hasPass) {
      toast.error('User must have a pass to receive XP');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock XP award process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newXP = passInfo.xpPoints + xpAmount;
      let newTier = passInfo.tier;
      
      // Check for tier upgrades
      if (newXP >= 5000 && passInfo.tier < PassTier.GOLD) {
        newTier = PassTier.GOLD;
        toast.success(`Congratulations! You've reached ${formatTierName(newTier)} tier!`);
      } else if (newXP >= 2000 && passInfo.tier < PassTier.SILVER) {
        newTier = PassTier.SILVER;
        toast.success(`Congratulations! You've reached ${formatTierName(newTier)} tier!`);
      }

      setPassInfo({
        ...passInfo,
        xpPoints: newXP,
        tier: newTier,
        tierName: formatTierName(newTier)
      });

      return true;
    } catch (err: any) {
      console.error('Error awarding XP:', err);
      setError(err.message || 'Failed to award XP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get XP required for next tier
  const getXPForNextTier = (): number => {
    if (!passInfo) return 0;
    
    switch (passInfo.tier) {
      case PassTier.BRONZE:
        return passInfo.xpPoints >= 2000 ? 0 : 2000 - passInfo.xpPoints;
      case PassTier.SILVER:
        return passInfo.xpPoints >= 5000 ? 0 : 5000 - passInfo.xpPoints;
      default:
        return 0; // Already max tier
    }
  };

  // Calculate progress to next tier
  const getProgressToNextTier = (): number => {
    if (!passInfo) return 0;
    
    switch (passInfo.tier) {
      case PassTier.BRONZE:
        return Math.min((passInfo.xpPoints / 2000) * 100, 100);
      case PassTier.SILVER:
        return Math.min(((passInfo.xpPoints - 2000) / 3000) * 100, 100);
      default:
        return 100; // Already max tier
    }
  };

  // Fetch pass info on mount and when user changes
  useEffect(() => {
    fetchPassInfo();
  }, [authenticated, user?.wallet?.address]);

  return {
    passInfo,
    loading,
    error,
    mintPass,
    awardXP,
    fetchPassInfo,
    getXPForNextTier,
    getProgressToNextTier
  };
}
