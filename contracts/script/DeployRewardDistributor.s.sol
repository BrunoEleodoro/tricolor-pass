// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/RewardDistributor.sol";
import "../src/TricolorPass.sol";

contract DeployRewardDistributorScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tricolorPassAddress = vm.envAddress("TRICOLOR_PASS_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Deploy RewardDistributor ===");
        console.log("TricolorPass:", tricolorPassAddress);
        
        RewardDistributor rewardDistributor = new RewardDistributor(tricolorPassAddress);
        console.log("RewardDistributor deployed at:", address(rewardDistributor));
        
        // Create initial rewards
        console.log("\n=== Creating Initial Rewards ===");
        
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
        
        console.log("\nRewardDistributor:", address(rewardDistributor));
    }
}
