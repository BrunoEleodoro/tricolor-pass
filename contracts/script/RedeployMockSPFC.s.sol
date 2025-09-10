// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockSPFCErc20.sol";
import "../src/TricolorPass.sol";

contract RedeployMockSPFCScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Redeploying MockSPFC Token (Public Faucet) ===");
        
        // Deploy new MockSPFC token with public faucet
        MockSPFCErc20 newSpfcToken = new MockSPFCErc20();
        console.log("New MockSPFC deployed at:", address(newSpfcToken));
        console.log("Initial supply:", newSpfcToken.totalSupply() / 1e18, "SPFC");
        console.log("Faucet amount:", newSpfcToken.FAUCET_AMOUNT() / 1e18, "SPFC per claim");
        
        // Deploy new TricolorPass with the new SPFC token
        TricolorPass newTricolorPass = new TricolorPass(address(newSpfcToken));
        console.log("New TricolorPass deployed at:", address(newTricolorPass));
        
        vm.stopBroadcast();
        
        console.log("\n=== New Contract Addresses ===");
        console.log("MockSPFC Token:", address(newSpfcToken));
        console.log("TricolorPass:", address(newTricolorPass));
        console.log("\n=== Update Frontend ===");
        console.log("Update CONTRACT_ADDRESSES in lib/contracts.ts");
        console.log("MOCK_SPFC_TOKEN:", address(newSpfcToken));
        console.log("TRICOLOR_PASS:", address(newTricolorPass));
        
        console.log("\n=== Demo Ready ===");
        console.log("- Users can now claim SPFC tokens without restrictions");
        console.log("- Faucet cooldown: 24 hours");
        console.log("- Amount per claim: 10,000 SPFC");
    }
}
