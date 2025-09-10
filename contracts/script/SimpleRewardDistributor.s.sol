// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/RewardDistributor.sol";

contract SimpleRewardDistributorScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tricolorPassAddress = vm.envAddress("TRICOLOR_PASS_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Deploy RewardDistributor Only ===");
        console.log("TricolorPass:", tricolorPassAddress);
        
        RewardDistributor rewardDistributor = new RewardDistributor(tricolorPassAddress);
        console.log("RewardDistributor deployed at:", address(rewardDistributor));
        
        vm.stopBroadcast();
        
        console.log("\nRewardDistributor:", address(rewardDistributor));
        console.log("Next: Run setup script to create rewards");
    }
}
