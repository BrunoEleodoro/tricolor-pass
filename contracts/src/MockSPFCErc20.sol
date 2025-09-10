// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockSPFCErc20
 * @dev Mock SPFC token for demo purposes
 * Allows anyone to mint tokens for testing
 */
contract MockSPFCErc20 is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant FAUCET_AMOUNT = 10000 * 10**18; // 10,000 tokens per faucet claim
    
    mapping(address => uint256) public lastFaucetClaim;
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    
    event FaucetClaim(address indexed user, uint256 amount);
    
    constructor() ERC20("SPFC Token", "SPFC") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 100000000 * 10**18); // 100M tokens to deployer
    }
    
    /**
     * @dev Faucet function - allows ANY user to claim free SPFC tokens for testing
     * Can be called once per 24 hours per address
     * No restrictions - open for all users!
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown active"
        );
        require(
            totalSupply() + FAUCET_AMOUNT <= MAX_SUPPLY,
            "Max supply reached"
        );
        
        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
        
        emit FaucetClaim(msg.sender, FAUCET_AMOUNT);
    }
    
    /**
     * @dev Get time until user can claim from faucet again
     */
    function timeUntilNextClaim(address user) external view returns (uint256) {
        uint256 nextClaim = lastFaucetClaim[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaim) {
            return 0;
        }
        return nextClaim - block.timestamp;
    }
    
    /**
     * @dev Check if user can claim from faucet
     */
    function canClaimFaucet(address user) external view returns (bool) {
        return block.timestamp >= lastFaucetClaim[user] + FAUCET_COOLDOWN;
    }
    
    /**
     * @dev Owner can mint additional tokens if needed
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Max supply reached"
        );
        _mint(to, amount);
    }
    
    /**
     * @dev Get user's SPFC balance in human-readable format
     */
    function balanceOfFormatted(address user) external view returns (uint256) {
        return balanceOf(user) / 10**18;
    }
}
