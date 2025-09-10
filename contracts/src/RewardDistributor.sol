// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TricolorPass.sol";

/**
 * @title RewardDistributor
 * @dev Manages rewards distribution for Tricolor Pass holders
 */
contract RewardDistributor is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");

    TricolorPass public tricolorPass;

    enum RewardType {
        DISCOUNT_COUPON,  // 0 - Discount coupons
        MERCHANDISE,      // 1 - Exclusive merchandise
        EXPERIENCE,       // 2 - VIP experiences
        DIGITAL_COLLECTIBLE, // 3 - Digital collectibles
        RAFFLE_ENTRY     // 4 - Raffle/lottery entries
    }

    enum RewardStatus {
        AVAILABLE,        // 0 - Available for claim
        CLAIMED,          // 1 - Claimed by user
        USED,            // 2 - Used/redeemed
        EXPIRED          // 3 - Expired
    }

    struct Reward {
        uint256 id;
        string title;
        string description;
        RewardType rewardType;
        uint256 xpRequired;
        TricolorPass.PassTier minTierRequired;
        uint256 totalSupply;
        uint256 claimedSupply;
        uint256 validFrom;
        uint256 validUntil;
        bool isActive;
        string metadataURI; // For images, descriptions, etc.
        bytes32 redeemCode; // Hash of redemption code
    }

    struct UserReward {
        uint256 rewardId;
        address user;
        uint256 claimedAt;
        RewardStatus status;
        string redemptionCode; // Actual code for redemption
        uint256 usedAt;
    }

    // Storage
    uint256 private nextRewardId;
    mapping(uint256 => Reward) public rewards;
    mapping(address => mapping(uint256 => UserReward)) public userRewards; // user => rewardId => UserReward
    mapping(address => uint256[]) public userClaimedRewards; // user => rewardIds[]
    mapping(uint256 => address[]) public rewardClaimers; // rewardId => user addresses

    // Events
    event RewardCreated(uint256 indexed rewardId, string title, RewardType rewardType);
    event RewardClaimed(uint256 indexed rewardId, address indexed user, string redemptionCode);
    event RewardUsed(uint256 indexed rewardId, address indexed user);
    event RewardUpdated(uint256 indexed rewardId);

    constructor(address _tricolorPass) {
        tricolorPass = TricolorPass(_tricolorPass);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REWARD_MANAGER_ROLE, msg.sender);
        nextRewardId = 1;
    }

    /**
     * @dev Create a new reward
     */
    function createReward(
        string memory title,
        string memory description,
        RewardType rewardType,
        uint256 xpRequired,
        TricolorPass.PassTier minTierRequired,
        uint256 totalSupply,
        uint256 validFrom,
        uint256 validUntil,
        string memory metadataURI,
        bytes32 redeemCode
    ) external onlyRole(REWARD_MANAGER_ROLE) returns (uint256) {
        require(validFrom < validUntil, "Invalid validity period");
        require(totalSupply > 0, "Total supply must be positive");

        uint256 rewardId = nextRewardId++;

        rewards[rewardId] = Reward({
            id: rewardId,
            title: title,
            description: description,
            rewardType: rewardType,
            xpRequired: xpRequired,
            minTierRequired: minTierRequired,
            totalSupply: totalSupply,
            claimedSupply: 0,
            validFrom: validFrom,
            validUntil: validUntil,
            isActive: true,
            metadataURI: metadataURI,
            redeemCode: redeemCode
        });

        emit RewardCreated(rewardId, title, rewardType);
        return rewardId;
    }

    /**
     * @dev Claim a reward
     */
    function claimReward(uint256 rewardId) external nonReentrant whenNotPaused {
        require(tricolorPass.hasPass(msg.sender), "User must have a Tricolor Pass");
        
        Reward storage reward = rewards[rewardId];
        require(reward.id != 0, "Reward does not exist");
        require(reward.isActive, "Reward is not active");
        require(block.timestamp >= reward.validFrom, "Reward not available yet");
        require(block.timestamp <= reward.validUntil, "Reward has expired");
        require(reward.claimedSupply < reward.totalSupply, "Reward supply exhausted");
        require(userRewards[msg.sender][rewardId].claimedAt == 0, "Reward already claimed");

        // Check user eligibility
        (,TricolorPass.PassTier userTier, uint256 userXP,) = tricolorPass.getPassInfo(msg.sender);
        require(userXP >= reward.xpRequired, "Insufficient XP");
        require(userTier >= reward.minTierRequired, "Insufficient tier level");

        // Generate redemption code
        string memory redemptionCode = _generateRedemptionCode(rewardId, msg.sender);

        // Update reward supply
        reward.claimedSupply++;

        // Record user reward
        userRewards[msg.sender][rewardId] = UserReward({
            rewardId: rewardId,
            user: msg.sender,
            claimedAt: block.timestamp,
            status: RewardStatus.CLAIMED,
            redemptionCode: redemptionCode,
            usedAt: 0
        });

        // Update tracking arrays
        userClaimedRewards[msg.sender].push(rewardId);
        rewardClaimers[rewardId].push(msg.sender);

        emit RewardClaimed(rewardId, msg.sender, redemptionCode);
    }

    /**
     * @dev Mark reward as used
     */
    function useReward(uint256 rewardId, string memory providedCode) external {
        UserReward storage userReward = userRewards[msg.sender][rewardId];
        require(userReward.claimedAt != 0, "Reward not claimed");
        require(userReward.status == RewardStatus.CLAIMED, "Reward not available for use");
        require(keccak256(bytes(userReward.redemptionCode)) == keccak256(bytes(providedCode)), "Invalid redemption code");

        Reward memory reward = rewards[rewardId];
        require(block.timestamp <= reward.validUntil, "Reward has expired");

        userReward.status = RewardStatus.USED;
        userReward.usedAt = block.timestamp;

        emit RewardUsed(rewardId, msg.sender);
    }

    /**
     * @dev Admin function to mark reward as used (for offline redemptions)
     */
    function adminUseReward(uint256 rewardId, address user) external onlyRole(REWARD_MANAGER_ROLE) {
        UserReward storage userReward = userRewards[user][rewardId];
        require(userReward.claimedAt != 0, "Reward not claimed");
        require(userReward.status == RewardStatus.CLAIMED, "Reward not available for use");

        userReward.status = RewardStatus.USED;
        userReward.usedAt = block.timestamp;

        emit RewardUsed(rewardId, user);
    }

    /**
     * @dev Get available rewards for a user
     */
    function getAvailableRewards(address user) external view returns (Reward[] memory) {
        if (!tricolorPass.hasPass(user)) {
            return new Reward[](0);
        }

        (,TricolorPass.PassTier userTier, uint256 userXP,) = tricolorPass.getPassInfo(user);

        uint256 availableCount = 0;
        
        // Count available rewards
        for (uint256 i = 1; i < nextRewardId; i++) {
            if (_isRewardAvailableForUser(i, user, userTier, userXP)) {
                availableCount++;
            }
        }

        Reward[] memory availableRewards = new Reward[](availableCount);
        uint256 index = 0;

        for (uint256 i = 1; i < nextRewardId; i++) {
            if (_isRewardAvailableForUser(i, user, userTier, userXP)) {
                availableRewards[index] = rewards[i];
                index++;
            }
        }

        return availableRewards;
    }

    /**
     * @dev Check if reward is available for user
     */
    function _isRewardAvailableForUser(
        uint256 rewardId, 
        address user, 
        TricolorPass.PassTier userTier, 
        uint256 userXP
    ) internal view returns (bool) {
        Reward memory reward = rewards[rewardId];
        
        return reward.isActive &&
               block.timestamp >= reward.validFrom &&
               block.timestamp <= reward.validUntil &&
               reward.claimedSupply < reward.totalSupply &&
               userXP >= reward.xpRequired &&
               userTier >= reward.minTierRequired &&
               userRewards[user][rewardId].claimedAt == 0;
    }

    /**
     * @dev Get user's claimed rewards
     */
    function getUserRewards(address user) external view returns (UserReward[] memory) {
        uint256[] memory rewardIds = userClaimedRewards[user];
        UserReward[] memory results = new UserReward[](rewardIds.length);

        for (uint256 i = 0; i < rewardIds.length; i++) {
            results[i] = userRewards[user][rewardIds[i]];
        }

        return results;
    }

    /**
     * @dev Get reward details by ID
     */
    function getRewardDetails(uint256 rewardId) external view returns (Reward memory) {
        require(rewards[rewardId].id != 0, "Reward does not exist");
        return rewards[rewardId];
    }

    /**
     * @dev Generate redemption code
     */
    function _generateRedemptionCode(uint256 rewardId, address user) internal view returns (string memory) {
        bytes32 hash = keccak256(abi.encodePacked(rewardId, user, block.timestamp, blockhash(block.number - 1)));
        return _toHexString(uint256(hash) % 1000000); // 6-digit code
    }

    /**
     * @dev Convert uint to hex string
     */
    function _toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "000000";
        }
        
        string memory result = "";
        while (value > 0) {
            uint256 remainder = value % 10;
            result = string(abi.encodePacked(bytes1(uint8(48 + remainder)), result));
            value /= 10;
        }
        
        // Pad with zeros to make it 6 digits
        while (bytes(result).length < 6) {
            result = string(abi.encodePacked("0", result));
        }
        
        return result;
    }

    /**
     * @dev Update reward status
     */
    function updateRewardStatus(uint256 rewardId, bool isActive) external onlyRole(REWARD_MANAGER_ROLE) {
        require(rewards[rewardId].id != 0, "Reward does not exist");
        rewards[rewardId].isActive = isActive;
        emit RewardUpdated(rewardId);
    }

    /**
     * @dev Update reward supply
     */
    function updateRewardSupply(uint256 rewardId, uint256 newTotalSupply) external onlyRole(REWARD_MANAGER_ROLE) {
        require(rewards[rewardId].id != 0, "Reward does not exist");
        require(newTotalSupply >= rewards[rewardId].claimedSupply, "Cannot reduce below claimed amount");
        rewards[rewardId].totalSupply = newTotalSupply;
        emit RewardUpdated(rewardId);
    }

    /**
     * @dev Expire old rewards (cleanup function)
     */
    function expireOldRewards() external onlyRole(REWARD_MANAGER_ROLE) {
        for (uint256 i = 1; i < nextRewardId; i++) {
            if (rewards[i].isActive && block.timestamp > rewards[i].validUntil) {
                rewards[i].isActive = false;
                emit RewardUpdated(i);
            }
        }
    }

    // Admin functions
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function updateTricolorPassContract(address newContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tricolorPass = TricolorPass(newContract);
    }
}
