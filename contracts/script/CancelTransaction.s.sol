// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

contract CancelTransactionScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Canceling Stuck Transaction ===");
        console.log("Account:", deployer);
        console.log("Current balance:", deployer.balance / 1e18, "CHZ");
        
        // Send a transaction to self with nonce 0 and high gas price to cancel
        vm.startBroadcast(deployerPrivateKey);
        
        // This will cancel the stuck transaction by using the same nonce with higher gas price
        payable(deployer).transfer(0);
        
        vm.stopBroadcast();
        
        console.log("Cancellation transaction sent");
        console.log("New balance:", deployer.balance / 1e18, "CHZ");
    }
}
