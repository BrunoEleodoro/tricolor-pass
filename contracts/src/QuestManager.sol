// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TricolorPass.sol";

/**
 * @title QuestManager
 * @dev Manages quests and XP rewards for Tricolor Pass holders
 */
contract QuestManager is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant QUEST_CREATOR_ROLE = keccak256("QUEST_CREATOR_ROLE");
    bytes32 public constant QUEST_VERIFIER_ROLE = keccak256("QUEST_VERIFIER_ROLE");

    TricolorPass public tricolorPass;

    enum QuestType {
        SCAN_QR,      // 0 - Scan QR code at stadium
        QUIZ,         // 1 - Answer quiz question
        PREDICTION,   // 2 - Match prediction
        SOCIAL,       // 3 - Social media interaction
        ATTENDANCE    // 4 - Stadium attendance
    }

    enum QuestStatus {
        ACTIVE,       // 0
        PAUSED,       // 1
        ENDED         // 2
    }

    struct Quest {
        uint256 id;
        string title;
        string description;
        QuestType questType;
        uint256 xpReward;
        uint256 startTime;
        uint256 endTime;
        QuestStatus status;
        bool isRepeatable;
        uint256 maxCompletions;
        uint256 currentCompletions;
        bytes32 verificationData; // Hash for verification (QR code hash, quiz answer hash, etc.)
    }

    struct QuestCompletion {
        uint256 questId;
        address user;
        uint256 completedAt;
        uint256 xpAwarded;
        bytes32 proofHash;
    }

    // Storage
    uint256 private nextQuestId;
    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => uint256)) public userQuestCompletions; // user => questId => completion count
    mapping(address => mapping(uint256 => bool)) public hasCompletedQuest; // user => questId => completed
    
    // Track completions for analytics
    QuestCompletion[] public completions;
    mapping(uint256 => uint256[]) public questCompletions; // questId => completion indices

    // Events
    event QuestCreated(uint256 indexed questId, string title, QuestType questType, uint256 xpReward);
    event QuestCompleted(uint256 indexed questId, address indexed user, uint256 xpAwarded);
    event QuestStatusChanged(uint256 indexed questId, QuestStatus newStatus);
    event QuestUpdated(uint256 indexed questId);

    constructor(address _tricolorPass) {
        tricolorPass = TricolorPass(_tricolorPass);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(QUEST_CREATOR_ROLE, msg.sender);
        _grantRole(QUEST_VERIFIER_ROLE, msg.sender);
        nextQuestId = 1;
    }

    /**
     * @dev Create a new quest
     */
    function createQuest(
        string memory title,
        string memory description,
        QuestType questType,
        uint256 xpReward,
        uint256 startTime,
        uint256 endTime,
        bool isRepeatable,
        uint256 maxCompletions,
        bytes32 verificationData
    ) external onlyRole(QUEST_CREATOR_ROLE) returns (uint256) {
        require(startTime < endTime, "Invalid time range");
        require(xpReward > 0, "XP reward must be positive");
        require(maxCompletions > 0, "Max completions must be positive");

        uint256 questId = nextQuestId++;

        quests[questId] = Quest({
            id: questId,
            title: title,
            description: description,
            questType: questType,
            xpReward: xpReward,
            startTime: startTime,
            endTime: endTime,
            status: QuestStatus.ACTIVE,
            isRepeatable: isRepeatable,
            maxCompletions: maxCompletions,
            currentCompletions: 0,
            verificationData: verificationData
        });

        emit QuestCreated(questId, title, questType, xpReward);
        return questId;
    }

    /**
     * @dev Complete a quest (requires verification)
     */
    function completeQuest(
        uint256 questId,
        bytes32 proof
    ) external nonReentrant whenNotPaused {
        require(tricolorPass.hasPass(msg.sender), "User must have a Tricolor Pass");
        
        Quest storage quest = quests[questId];
        require(quest.id != 0, "Quest does not exist");
        require(quest.status == QuestStatus.ACTIVE, "Quest is not active");
        require(block.timestamp >= quest.startTime, "Quest not started yet");
        require(block.timestamp <= quest.endTime, "Quest has ended");
        require(quest.currentCompletions < quest.maxCompletions, "Quest completion limit reached");

        // Check if user can complete this quest
        if (!quest.isRepeatable) {
            require(!hasCompletedQuest[msg.sender][questId], "Quest already completed");
        }

        // Verify proof based on quest type
        require(_verifyQuestProof(questId, proof), "Invalid proof");

        // Award XP
        tricolorPass.awardXP(msg.sender, quest.xpReward);

        // Update completion tracking
        userQuestCompletions[msg.sender][questId]++;
        hasCompletedQuest[msg.sender][questId] = true;
        quest.currentCompletions++;

        // Record completion
        uint256 completionIndex = completions.length;
        completions.push(QuestCompletion({
            questId: questId,
            user: msg.sender,
            completedAt: block.timestamp,
            xpAwarded: quest.xpReward,
            proofHash: proof
        }));
        questCompletions[questId].push(completionIndex);

        emit QuestCompleted(questId, msg.sender, quest.xpReward);
    }

    /**
     * @dev Verify quest proof based on quest type
     */
    function _verifyQuestProof(uint256 questId, bytes32 proof) internal view returns (bool) {
        Quest memory quest = quests[questId];
        
        if (quest.questType == QuestType.SCAN_QR) {
            // For QR scanning, proof should match the stored QR hash
            return proof == quest.verificationData;
        } else if (quest.questType == QuestType.QUIZ) {
            // For quiz, proof should be hash of correct answer
            return proof == quest.verificationData;
        } else if (quest.questType == QuestType.PREDICTION) {
            // For predictions, verification happens after match ends
            // This could be more complex logic
            return true; // Simplified for demo
        } else if (quest.questType == QuestType.SOCIAL) {
            // Social quests might require off-chain verification
            return true; // Simplified for demo
        } else if (quest.questType == QuestType.ATTENDANCE) {
            // Stadium attendance verification
            return proof == quest.verificationData;
        }
        
        return false;
    }

    /**
     * @dev Get active quests for display
     */
    function getActiveQuests() external view returns (Quest[] memory) {
        uint256 activeCount = 0;
        
        // Count active quests
        for (uint256 i = 1; i < nextQuestId; i++) {
            if (quests[i].status == QuestStatus.ACTIVE && 
                block.timestamp >= quests[i].startTime && 
                block.timestamp <= quests[i].endTime &&
                quests[i].currentCompletions < quests[i].maxCompletions) {
                activeCount++;
            }
        }

        Quest[] memory activeQuests = new Quest[](activeCount);
        uint256 index = 0;

        for (uint256 i = 1; i < nextQuestId; i++) {
            if (quests[i].status == QuestStatus.ACTIVE && 
                block.timestamp >= quests[i].startTime && 
                block.timestamp <= quests[i].endTime &&
                quests[i].currentCompletions < quests[i].maxCompletions) {
                activeQuests[index] = quests[i];
                index++;
            }
        }

        return activeQuests;
    }

    /**
     * @dev Get user's quest completion status
     */
    function getUserQuestStatus(address user, uint256 questId) external view returns (
        bool canComplete,
        bool hasCompleted,
        uint256 completionCount
    ) {
        Quest memory quest = quests[questId];
        
        canComplete = tricolorPass.hasPass(user) &&
                     quest.status == QuestStatus.ACTIVE &&
                     block.timestamp >= quest.startTime &&
                     block.timestamp <= quest.endTime &&
                     quest.currentCompletions < quest.maxCompletions &&
                     (quest.isRepeatable || !hasCompletedQuest[user][questId]);

        hasCompleted = hasCompletedQuest[user][questId];
        completionCount = userQuestCompletions[user][questId];
    }

    /**
     * @dev Get quest completions for analytics
     */
    function getQuestCompletions(uint256 questId) external view returns (uint256[] memory) {
        return questCompletions[questId];
    }

    /**
     * @dev Update quest status
     */
    function updateQuestStatus(uint256 questId, QuestStatus newStatus) 
        external 
        onlyRole(QUEST_CREATOR_ROLE) 
    {
        require(quests[questId].id != 0, "Quest does not exist");
        quests[questId].status = newStatus;
        emit QuestStatusChanged(questId, newStatus);
    }

    /**
     * @dev Update quest verification data (for admin purposes)
     */
    function updateQuestVerificationData(uint256 questId, bytes32 newVerificationData) 
        external 
        onlyRole(QUEST_CREATOR_ROLE) 
    {
        require(quests[questId].id != 0, "Quest does not exist");
        quests[questId].verificationData = newVerificationData;
        emit QuestUpdated(questId);
    }

    /**
     * @dev Emergency complete quest (admin only)
     */
    function adminCompleteQuest(uint256 questId, address user, bytes32 proof) 
        external 
        onlyRole(QUEST_VERIFIER_ROLE) 
    {
        require(tricolorPass.hasPass(user), "User must have a Tricolor Pass");
        
        Quest storage quest = quests[questId];
        require(quest.id != 0, "Quest does not exist");

        // Award XP
        tricolorPass.awardXP(user, quest.xpReward);

        // Update completion tracking
        userQuestCompletions[user][questId]++;
        hasCompletedQuest[user][questId] = true;
        quest.currentCompletions++;

        // Record completion
        uint256 completionIndex = completions.length;
        completions.push(QuestCompletion({
            questId: questId,
            user: user,
            completedAt: block.timestamp,
            xpAwarded: quest.xpReward,
            proofHash: proof
        }));
        questCompletions[questId].push(completionIndex);

        emit QuestCompleted(questId, user, quest.xpReward);
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
