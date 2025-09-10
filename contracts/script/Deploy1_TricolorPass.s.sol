// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TricolorPass.sol";

contract Deploy1Script is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Step 1: Deploy TricolorPass ===");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance / 1e18, "CHZ");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying TricolorPass...");
        TricolorPass tricolorPass = new TricolorPass();
        
        vm.stopBroadcast();
        
        console.log("SUCCESS: TricolorPass deployed at:", address(tricolorPass));
        console.log("Remaining balance:", deployer.balance / 1e18, "CHZ");
        
        console.log("\n=== Next Steps ===");
        console.log("1. Verify this transaction was successful");
        console.log("2. Check the contract on Chiliz Scan:");
        console.log("   https://scan.chiliz.com/address/", address(tricolorPass));
        console.log("3. Then run Deploy2_QuestManager script");
    }
}
