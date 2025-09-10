// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockSPFCErc20.sol";
import "../src/TricolorPass.sol";
import "../src/QuestManager.sol";
import "../src/RewardDistributor.sol";

contract DeployWithMockSPFCScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Deploying Complete Tricolor Pass System ===");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance / 1e18, "CHZ");
        
        // Step 1: Deploy MockSPFC Token
        console.log("\n=== Step 1: Deploy MockSPFC Token ===");
        MockSPFCErc20 spfcToken = new MockSPFCErc20();
        console.log("MockSPFC deployed at:", address(spfcToken));
        console.log("Initial supply:", spfcToken.totalSupply() / 1e18, "SPFC");
        
        // Step 2: Deploy TricolorPass
        console.log("\n=== Step 2: Deploy TricolorPass ===");
        TricolorPass tricolorPass = new TricolorPass(address(spfcToken));
        console.log("TricolorPass deployed at:", address(tricolorPass));
        
        // Step 3: Deploy QuestManager
        console.log("\n=== Step 3: Deploy QuestManager ===");
        QuestManager questManager = new QuestManager(address(tricolorPass));
        console.log("QuestManager deployed at:", address(questManager));
        
        // Step 4: Deploy RewardDistributor
        console.log("\n=== Step 4: Deploy RewardDistributor ===");
        RewardDistributor rewardDistributor = new RewardDistributor(address(tricolorPass));
        console.log("RewardDistributor deployed at:", address(rewardDistributor));
        
        // Step 5: Setup roles and permissions
        console.log("\n=== Step 5: Setup Roles ===");
        bytes32 XP_MANAGER_ROLE = keccak256("XP_MANAGER_ROLE");
        tricolorPass.grantRole(XP_MANAGER_ROLE, address(questManager));
        console.log("Granted XP_MANAGER_ROLE to QuestManager");
        
        // Step 6: Create initial quests
        console.log("\n=== Step 6: Creating Initial Quests ===");
        
        uint256 quest1 = questManager.createQuest(
            "Scanner QR do Estadio",
            "Escaneie o QR code no Morumbi para ganhar XP",
            QuestManager.QuestType.SCAN_QR,
            100,
            block.timestamp,
            block.timestamp + 365 days,
            true,
            1000,
            keccak256("morumbi_stadium_qr")
        );
        console.log("Created Quest 1 (Scanner QR):", quest1);
        
        uint256 quest2 = questManager.createQuest(
            "Quiz Tricolor",
            "Responda perguntas sobre a historia do SPFC",
            QuestManager.QuestType.QUIZ,
            50,
            block.timestamp,
            block.timestamp + 365 days,
            true,
            5000,
            keccak256("tricolor_quiz_v1")
        );
        console.log("Created Quest 2 (Quiz):", quest2);
        
        uint256 quest3 = questManager.createQuest(
            "Palpite do Placar",
            "Adivinhe o placar do proximo jogo",
            QuestManager.QuestType.PREDICTION,
            200,
            block.timestamp,
            block.timestamp + 30 days,
            false,
            1000,
            keccak256("score_prediction_next_game")
        );
        console.log("Created Quest 3 (Prediction):", quest3);
        
        // Step 7: Create initial rewards
        console.log("\n=== Step 7: Creating Initial Rewards ===");
        
        uint256 reward1 = rewardDistributor.createReward(
            "Cupom de Desconto 10%",
            "10% de desconto na loja oficial do SPFC",
            RewardDistributor.RewardType.DISCOUNT_COUPON,
            100,
            TricolorPass.PassTier.BRONZE,
            1000,
            block.timestamp,
            block.timestamp + 365 days,
            "https://spfc.com.br/metadata/cupom-10",
            keccak256("SPFC10OFF")
        );
        console.log("Created Reward 1 (10% Discount):", reward1);
        
        uint256 reward2 = rewardDistributor.createReward(
            "Experiencia VIP",
            "Visita guiada ao Morumbi + meet & greet",
            RewardDistributor.RewardType.EXPERIENCE,
            1000,
            TricolorPass.PassTier.GOLD,
            50,
            block.timestamp,
            block.timestamp + 180 days,
            "https://spfc.com.br/metadata/vip-experience",
            keccak256("SPFCVIP2024")
        );
        console.log("Created Reward 2 (VIP Experience):", reward2);
        
        uint256 reward3 = rewardDistributor.createReward(
            "Camisa Oficial 2024",
            "Camisa oficial do SPFC temporada 2024",
            RewardDistributor.RewardType.MERCHANDISE,
            500,
            TricolorPass.PassTier.SILVER,
            200,
            block.timestamp,
            block.timestamp + 365 days,
            "https://spfc.com.br/metadata/jersey-2024",
            keccak256("JERSEY2024")
        );
        console.log("Created Reward 3 (Official Jersey):", reward3);
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Complete ===");
        console.log("MockSPFC Token:", address(spfcToken));
        console.log("TricolorPass:", address(tricolorPass));
        console.log("QuestManager:", address(questManager));
        console.log("RewardDistributor:", address(rewardDistributor));
        
        console.log("\n=== Next Steps ===");
        console.log("1. Update frontend with new contract addresses");
        console.log("2. Users can claim SPFC tokens from faucet:");
        console.log("   spfcToken.faucet() - gives 10,000 SPFC tokens");
        console.log("3. Test complete flow: claim SPFC -> mint pass -> complete quests -> claim rewards");
        
        console.log("\n=== Demo Instructions ===");
        console.log("- Call spfcToken.faucet() to get free SPFC tokens");
        console.log("- Use SPFC tokens to mint Tricolor Pass");
        console.log("- Complete quests to earn XP");
        console.log("- Claim rewards based on XP and tier");
    }
}
