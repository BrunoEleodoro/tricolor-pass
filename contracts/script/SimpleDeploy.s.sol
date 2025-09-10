// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TricolorPass} from "../src/TricolorPass.sol";

contract SimpleDeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Simple Deployment - TricolorPass Only ===");
        console.log("Chain ID: 88888");
        console.log("Account:", deployer);
        console.log("Balance:", deployer.balance / 1e18, "CHZ");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy only TricolorPass first
        console.log("Deploying TricolorPass...");
        TricolorPass tricolorPass = new TricolorPass();
        console.log("TricolorPass deployed to:", address(tricolorPass));

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("TricolorPass:", address(tricolorPass));
        console.log("Remaining balance:", deployer.balance / 1e18, "CHZ");
    }
}
