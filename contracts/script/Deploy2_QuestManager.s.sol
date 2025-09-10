// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/QuestManager.sol";

contract Deploy2QuestManagerScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address tricolorPass = vm.envAddress("TRICOLOR_PASS_ADDRESS");

        console.log("=== Step 2: Deploy QuestManager ===");
        console.log("Deployer:", deployer);
        console.log("TricolorPass:", tricolorPass);
        console.log("Balance:", deployer.balance / 1e18, "CHZ");

        vm.startBroadcast(deployerPrivateKey);
        QuestManager quest = new QuestManager(tricolorPass);
        vm.stopBroadcast();

        console.log("SUCCESS: QuestManager deployed at:", address(quest));
    }
}


