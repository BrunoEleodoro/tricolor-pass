// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

contract ForceCancelScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Force Cancel with High Gas ===");
        console.log("Account:", deployer);
        console.log("Current nonce should be 0");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Force a simple transaction with extremely high gas price
        // This should replace any pending transaction
        deployer.call{value: 0, gas: 21000}("");
        
        vm.stopBroadcast();
        
        console.log("Force cancel transaction sent");
    }
}
