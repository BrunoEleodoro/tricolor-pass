// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TricolorPass} from "../src/TricolorPass.sol";
import {QuestManager} from "../src/QuestManager.sol";
import {RewardDistributor} from "../src/RewardDistributor.sol";

contract DeployScript is Script {
    TricolorPass public tricolorPass;
    QuestManager public questManager;
    RewardDistributor public rewardDistributor;
    
    // SPFC Token address on Chiliz Chain
    address constant SPFC_TOKEN_ADDRESS = 0x540165b9dFdDE31658F9BA0Ca5504EdA448BFfd0;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Chiliz Chain Deployment ===");
        console.log("Chain ID: 88888");
        console.log("RPC: https://rpc.ankr.com/chiliz");
        console.log("SPFC Token:", SPFC_TOKEN_ADDRESS);
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance / 1e18, "CHZ");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy TricolorPass
        console.log("Deploying TricolorPass...");
        tricolorPass = new TricolorPass();
        console.log("TricolorPass deployed to:", address(tricolorPass));

        // Deploy QuestManager
        console.log("Deploying QuestManager...");
        questManager = new QuestManager(address(tricolorPass));
        console.log("QuestManager deployed to:", address(questManager));

        // Deploy RewardDistributor
        console.log("Deploying RewardDistributor...");
        rewardDistributor = new RewardDistributor(address(tricolorPass));
        console.log("RewardDistributor deployed to:", address(rewardDistributor));

        // Grant roles
        console.log("Setting up roles...");
        
        // Grant MINTER_ROLE to QuestManager for awarding XP
        tricolorPass.grantRole(tricolorPass.MINTER_ROLE(), address(questManager));
        console.log("Granted MINTER_ROLE to QuestManager");

        // Grant QUEST_CREATOR_ROLE and QUEST_VERIFIER_ROLE to deployer
        questManager.grantRole(questManager.QUEST_CREATOR_ROLE(), deployer);
        questManager.grantRole(questManager.QUEST_VERIFIER_ROLE(), deployer);
        console.log("Granted QUEST roles to deployer");

        // Grant REWARD_MANAGER_ROLE to deployer
        rewardDistributor.grantRole(rewardDistributor.REWARD_MANAGER_ROLE(), deployer);
        console.log("Granted REWARD_MANAGER_ROLE to deployer");

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("Network: Chiliz Chain (ChainID: 88888)");
        console.log("SPFC Token:", SPFC_TOKEN_ADDRESS);
        console.log("TricolorPass:", address(tricolorPass));
        console.log("QuestManager:", address(questManager));
        console.log("RewardDistributor:", address(rewardDistributor));
        console.log("Deployer:", deployer);
        console.log("Gas used: Approximately", (deployer.balance / 1e18), "CHZ");
        
        console.log("\n=== Next Steps ===");
        console.log("1. Update your .env.local file with these contract addresses:");
        console.log("NEXT_PUBLIC_TRICOLOR_PASS_ADDRESS=", address(tricolorPass));
        console.log("NEXT_PUBLIC_QUEST_MANAGER_ADDRESS=", address(questManager));
        console.log("NEXT_PUBLIC_REWARD_DISTRIBUTOR_ADDRESS=", address(rewardDistributor));
        console.log("NEXT_PUBLIC_SPFC_TOKEN_ADDRESS=", SPFC_TOKEN_ADDRESS);
        console.log("\n2. Verify contracts on Chiliz Scan:");
        console.log("https://scan.chiliz.com/address/", address(tricolorPass));
        console.log("https://scan.chiliz.com/address/", address(questManager));
        console.log("https://scan.chiliz.com/address/", address(rewardDistributor));
        console.log("\n3. Run setup script to create initial quests and rewards:");
        console.log("forge script script/Deploy.s.sol:SetupDataScript --rpc-url chiliz --broadcast");
    }
}

// Separate script for initial data setup
contract SetupDataScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Read deployed contract addresses from environment variables
        // Make sure to set these in your .env file after deployment
        address tricolorPassAddress = vm.envAddress("TRICOLOR_PASS_ADDRESS");
        address questManagerAddress = vm.envAddress("QUEST_MANAGER_ADDRESS");
        address rewardDistributorAddress = vm.envAddress("REWARD_DISTRIBUTOR_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        QuestManager questManager = QuestManager(questManagerAddress);
        RewardDistributor rewardDistributor = RewardDistributor(rewardDistributorAddress);

        console.log("Setting up initial quests and rewards...");

        // Create initial quests
        createInitialQuests(questManager);
        
        // Create initial rewards  
        createInitialRewards(rewardDistributor);

        vm.stopBroadcast();
        console.log("Initial data setup completed!");
    }

    function createInitialQuests(QuestManager questManager) internal {
        // Quest 1: Stadium Scanner
        questManager.createQuest(
            "Escanear no Estadio",
            "Escaneie o QR code oficial no Morumbi durante o jogo",
            QuestManager.QuestType.SCAN_QR,
            100, // XP reward
            block.timestamp,
            block.timestamp + 30 days,
            false, // not repeatable
            1000, // max completions
            keccak256("STADIUM_QR_CODE_HASH") // verification data
        );
        console.log("Created Stadium Scanner quest");

        // Quest 2: Quiz
        questManager.createQuest(
            "Quiz Relampago",
            "Pergunta sobre a historia do SPFC",
            QuestManager.QuestType.QUIZ,
            50, // XP reward
            block.timestamp,
            block.timestamp + 7 days,
            true, // repeatable
            10000, // max completions
            keccak256("1992") // correct answer hash
        );
        console.log("Created Quiz quest");

        // Quest 3: Match Prediction
        questManager.createQuest(
            "Palpite do Placar",
            "Qual sera o placar de SPFC x Palmeiras?",
            QuestManager.QuestType.PREDICTION,
            75, // XP reward
            block.timestamp,
            block.timestamp + 14 days,
            false, // not repeatable
            500, // max completions
            keccak256("MATCH_PREDICTION") // verification data
        );
        console.log("Created Match Prediction quest");
    }

    function createInitialRewards(RewardDistributor rewardDistributor) internal {
        // Reward 1: 20% Discount
        rewardDistributor.createReward(
            "20% OFF Loja Oficial",
            "Desconto em qualquer produto da loja oficial do SPFC",
            RewardDistributor.RewardType.DISCOUNT_COUPON,
            100, // XP required
            TricolorPass.PassTier.BRONZE,
            1000, // total supply
            block.timestamp,
            block.timestamp + 90 days,
            "https://tricolorpass.com/metadata/discount20",
            keccak256("DISCOUNT_20_OFF")
        );
        console.log("Created 20% Discount reward");

        // Reward 2: VIP Experience
        rewardDistributor.createReward(
            "Experiencia VIP",
            "Tour exclusivo pelo CT da Barra Funda",
            RewardDistributor.RewardType.EXPERIENCE,
            500, // XP required
            TricolorPass.PassTier.SILVER,
            50, // total supply
            block.timestamp,
            block.timestamp + 60 days,
            "https://tricolorpass.com/metadata/vip-tour",
            keccak256("VIP_EXPERIENCE")
        );
        console.log("Created VIP Experience reward");

        // Reward 3: Special Ticket
        rewardDistributor.createReward(
            "Ingresso Setor Especial",
            "Ingresso para arquibancada especial no proximo jogo",
            RewardDistributor.RewardType.MERCHANDISE,
            300, // XP required
            TricolorPass.PassTier.BRONZE,
            100, // total supply
            block.timestamp,
            block.timestamp + 30 days,
            "https://tricolorpass.com/metadata/special-ticket",
            keccak256("SPECIAL_TICKET")
        );
        console.log("Created Special Ticket reward");
    }
}
