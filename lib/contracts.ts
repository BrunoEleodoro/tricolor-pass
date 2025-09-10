import { ethers } from 'ethers';

// Contract addresses - ready for Chiliz Chain deployment (ChainID: 88888)
export const CONTRACT_ADDRESSES = {
  TRICOLOR_PASS: process.env.NEXT_PUBLIC_TRICOLOR_PASS_ADDRESS || '0xdf357d33CE5008782bfC623F6c275FA97725e209',
  QUEST_MANAGER: process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS || '0x4E4B28D1B6a50DBf9510f8238FAf64cCF9737D25',
  REWARD_DISTRIBUTOR: process.env.NEXT_PUBLIC_REWARD_DISTRIBUTOR_ADDRESS || '0xAEE9b44Fa94595b0488E97beC272f6f6Ce4daEA4',
  SPFC_TOKEN: process.env.NEXT_PUBLIC_SPFC_TOKEN_ADDRESS || '0x540165b9dFdDE31658F9BA0Ca5504EdA448BFfd0',
};

// ABI definitions (simplified for demo)
export const TRICOLOR_PASS_ABI = [
  "function mintPass(address to, uint8 tier) external",
  "function awardXP(address user, uint256 xpAmount) external",
  "function getPassInfo(address user) external view returns (uint256 tokenId, uint8 tier, uint256 xpPoints, bool isActive)",
  "function hasPass(address user) external view returns (bool)",
  "event PassMinted(address indexed to, uint256 indexed tokenId, uint8 tier)",
  "event XPAwarded(address indexed user, uint256 indexed tokenId, uint256 xpAmount)",
  "event PassUpgraded(address indexed user, uint256 indexed tokenId, uint8 newTier)"
];

export const QUEST_MANAGER_ABI = [
  "function createQuest(string memory title, string memory description, uint8 questType, uint256 xpReward, uint256 startTime, uint256 endTime, bool isRepeatable, uint256 maxCompletions, bytes32 verificationData) external returns (uint256)",
  "function completeQuest(uint256 questId, bytes32 proof) external",
  "function getActiveQuests() external view returns (tuple(uint256 id, string title, string description, uint8 questType, uint256 xpReward, uint256 startTime, uint256 endTime, uint8 status, bool isRepeatable, uint256 maxCompletions, uint256 currentCompletions, bytes32 verificationData)[] memory)",
  "function getUserQuestStatus(address user, uint256 questId) external view returns (bool canComplete, bool hasCompleted, uint256 completionCount)",
  "event QuestCreated(uint256 indexed questId, string title, uint8 questType, uint256 xpReward)",
  "event QuestCompleted(uint256 indexed questId, address indexed user, uint256 xpAwarded)"
];

export const REWARD_DISTRIBUTOR_ABI = [
  "function createReward(string memory title, string memory description, uint8 rewardType, uint256 xpRequired, uint8 minTierRequired, uint256 totalSupply, uint256 validFrom, uint256 validUntil, string memory metadataURI, bytes32 redeemCode) external returns (uint256)",
  "function claimReward(uint256 rewardId) external",
  "function useReward(uint256 rewardId, string memory providedCode) external",
  "function getAvailableRewards(address user) external view returns (tuple(uint256 id, string title, string description, uint8 rewardType, uint256 xpRequired, uint8 minTierRequired, uint256 totalSupply, uint256 claimedSupply, uint256 validFrom, uint256 validUntil, bool isActive, string metadataURI, bytes32 redeemCode)[] memory)",
  "function getUserRewards(address user) external view returns (tuple(uint256 rewardId, address user, uint256 claimedAt, uint8 status, string redemptionCode, uint256 usedAt)[] memory)",
  "event RewardCreated(uint256 indexed rewardId, string title, uint8 rewardType)",
  "event RewardClaimed(uint256 indexed rewardId, address indexed user, string redemptionCode)",
  "event RewardUsed(uint256 indexed rewardId, address indexed user)"
];

// Quest types enum
export enum QuestType {
  SCAN_QR = 0,
  QUIZ = 1,
  PREDICTION = 2,
  SOCIAL = 3,
  ATTENDANCE = 4
}

// Pass tier enum
export enum PassTier {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2
}

// Reward type enum
export enum RewardType {
  DISCOUNT_COUPON = 0,
  MERCHANDISE = 1,
  EXPERIENCE = 2,
  DIGITAL_COLLECTIBLE = 3,
  RAFFLE_ENTRY = 4
}

// Utility function to get contract instance
export function getContract(
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(address, abi, signerOrProvider);
}

// Format tier name
export function formatTierName(tier: number): string {
  switch (tier) {
    case PassTier.BRONZE: return 'Bronze';
    case PassTier.SILVER: return 'Silver';
    case PassTier.GOLD: return 'Gold';
    default: return 'Unknown';
  }
}

// Format quest type name
export function formatQuestType(type: number): string {
  switch (type) {
    case QuestType.SCAN_QR: return 'Scanner QR';
    case QuestType.QUIZ: return 'Quiz';
    case QuestType.PREDICTION: return 'Palpite';
    case QuestType.SOCIAL: return 'Social';
    case QuestType.ATTENDANCE: return 'Presença';
    default: return 'Unknown';
  }
}

// Format reward type name
export function formatRewardType(type: number): string {
  switch (type) {
    case RewardType.DISCOUNT_COUPON: return 'Cupom de Desconto';
    case RewardType.MERCHANDISE: return 'Produto';
    case RewardType.EXPERIENCE: return 'Experiência';
    case RewardType.DIGITAL_COLLECTIBLE: return 'Colecionável';
    case RewardType.RAFFLE_ENTRY: return 'Sorteio';
    default: return 'Unknown';
  }
}
