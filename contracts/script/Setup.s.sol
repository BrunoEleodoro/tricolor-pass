// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TricolorPass.sol";
import "../src/QuestManager.sol";
import "../src/RewardDistributor.sol";

contract SetupScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        address tricolorPassAddress = vm.envAddress("TRICOLOR_PASS_ADDRESS");
        address questManagerAddress = vm.envAddress("QUEST_MANAGER_ADDRESS");
        address rewardDistributorAddress = vm.envAddress("REWARD_DISTRIBUTOR_ADDRESS");
        
        TricolorPass tricolorPass = TricolorPass(tricolorPassAddress);
        QuestManager questManager = QuestManager(questManagerAddress);
        RewardDistributor rewardDistributor = RewardDistributor(rewardDistributorAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Setting up Initial Data ===");
        console.log("Deployer:", deployer);
        console.log("TricolorPass:", tricolorPassAddress);
        console.log("QuestManager:", questManagerAddress);
        console.log("RewardDistributor:", rewardDistributorAddress);
        
        // Grant roles to QuestManager for XP awarding
        bytes32 XP_MANAGER_ROLE = keccak256("XP_MANAGER_ROLE");
        tricolorPass.grantRole(XP_MANAGER_ROLE, questManagerAddress);
        console.log("Granted XP_MANAGER_ROLE to QuestManager");
        
        // Create initial quests
        console.log("\n=== Creating Initial Quests ===");
        
        // Quest 1: Scanner QR do Estadio
        uint256 quest1 = questManager.createQuest(
            "Scanner QR do Estadio",
            "Escaneie o QR code no Morumbi para ganhar XP",
            QuestManager.QuestType.SCAN_QR,
            100, // 100 XP
            block.timestamp,
            block.timestamp + 365 days,
            true, // repeatable
            1000, // max completions
            keccak256("morumbi_stadium_qr")
        );
        console.log("Created Quest 1 (Scanner QR):", quest1);
        
        // Quest 2: Quiz Tricolor
        uint256 quest2 = questManager.createQuest(
            "Quiz Tricolor",
            "Responda perguntas sobre a historia do SPFC",
            QuestManager.QuestType.QUIZ,
            50, // 50 XP
            block.timestamp,
            block.timestamp + 365 days,
            true, // repeatable
            5000, // max completions
            keccak256("tricolor_quiz_v1")
        );
        console.log("Created Quest 2 (Quiz):", quest2);
        
        // Quest 3: Palpite do Placar
        uint256 quest3 = questManager.createQuest(
            "Palpite do Placar",
            "Adivinhe o placar do proximo jogo",
            QuestManager.QuestType.PREDICTION,
            200, // 200 XP
            block.timestamp,
            block.timestamp + 30 days,
            false, // not repeatable
            1000, // max completions
            keccak256("score_prediction_next_game")
        );
        console.log("Created Quest 3 (Prediction):", quest3);
        
        // Create initial rewards
        console.log("\n=== Creating Initial Rewards ===");
        
        // Reward 1: Cupom de Desconto 10%
        uint256 reward1 = rewardDistributor.createReward(
            "Cupom de Desconto 10%",
            "10% de desconto na loja oficial do SPFC",
            RewardDistributor.RewardType.DISCOUNT_COUPON,
            100, // requires 100 XP
            TricolorPass.PassTier.BRONZE, // any tier (Bronze)
            1000, // total supply
            block.timestamp,
            block.timestamp + 365 days,
            "https://spfc.com.br/metadata/cupom-10",
            keccak256("SPFC10OFF")
        );
        console.log("Created Reward 1 (10% Discount):", reward1);
        
        // Reward 2: Experiencia VIP
        uint256 reward2 = rewardDistributor.createReward(
            "Experiencia VIP",
            "Visita guiada ao Morumbi + meet & greet",
            RewardDistributor.RewardType.EXPERIENCE,
            1000, // requires 1000 XP
            TricolorPass.PassTier.GOLD, // Gold tier required
            50, // limited supply
            block.timestamp,
            block.timestamp + 180 days,
            "https://spfc.com.br/metadata/vip-experience",
            keccak256("SPFCVIP2024")
        );
        console.log("Created Reward 2 (VIP Experience):", reward2);
        
        // Reward 3: Camisa Oficial
        uint256 reward3 = rewardDistributor.createReward(
            "Camisa Oficial 2024",
            "Camisa oficial do SPFC temporada 2024",
            RewardDistributor.RewardType.MERCHANDISE,
            500, // requires 500 XP
            TricolorPass.PassTier.SILVER, // Silver tier required
            200, // limited supply
            block.timestamp,
            block.timestamp + 365 days,
            "https://spfc.com.br/metadata/jersey-2024",
            keccak256("JERSEY2024")
        );
        console.log("Created Reward 3 (Official Jersey):", reward3);
        
        vm.stopBroadcast();
        
        console.log("\n=== Setup Complete ===");
        console.log("Created 3 quests and 3 rewards");
        console.log("QuestManager has XP_MANAGER_ROLE for TricolorPass");
    }
}
