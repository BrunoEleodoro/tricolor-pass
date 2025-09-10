// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TricolorPass.sol";

contract BasicDeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        TricolorPass pass = new TricolorPass();
        console.log("TricolorPass deployed at:", address(pass));
        
        vm.stopBroadcast();
    }
}
