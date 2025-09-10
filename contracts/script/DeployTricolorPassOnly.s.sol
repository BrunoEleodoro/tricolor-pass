// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TricolorPass.sol";

contract DeployTricolorPassOnlyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address mockSpfcToken = 0x3c05A2De1449F2C113499A97fa7BeDF64165C5b0; // New MockSPFC
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Deploy TricolorPass with New MockSPFC ===");
        console.log("MockSPFC Token:", mockSpfcToken);
        
        TricolorPass tricolorPass = new TricolorPass(mockSpfcToken);
        console.log("TricolorPass deployed at:", address(tricolorPass));
        
        vm.stopBroadcast();
        
        console.log("\nTricolorPass:", address(tricolorPass));
        console.log("Update CONTRACT_ADDRESSES.TRICOLOR_PASS to:", address(tricolorPass));
    }
}
