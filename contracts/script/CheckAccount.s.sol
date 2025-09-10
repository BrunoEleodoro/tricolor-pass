// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

contract CheckAccountScript is Script {
    function run() external view {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Account Information ===");
        console.log("Address:", deployer);
        console.log("Balance:", deployer.balance / 1e18, "CHZ");
        console.log("Nonce would be checked on-chain");
    }
}
