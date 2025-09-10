// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TricolorPass
 * @dev NFT contract for SPFC fan passes with tier-based benefits
 */
contract TricolorPass is ERC721, ERC721Enumerable, Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 private _tokenIdCounter;

    enum PassTier {
        BRONZE,   // 0
        SILVER,   // 1
        GOLD      // 2
    }

    struct PassData {
        PassTier tier;
        uint256 mintedAt;
        uint256 xpPoints;
        bool isActive;
    }

    // Mapping from token ID to pass data
    mapping(uint256 => PassData) public passData;
    
    // Mapping from user address to token ID (one pass per user)
    mapping(address => uint256) public userToPass;
    
    // Mapping to track if user already has a pass
    mapping(address => bool) public hasPass;

    // Events
    event PassMinted(address indexed to, uint256 indexed tokenId, PassTier tier);
    event XPAwarded(address indexed user, uint256 indexed tokenId, uint256 xpAmount);
    event PassUpgraded(address indexed user, uint256 indexed tokenId, PassTier newTier);

    constructor() ERC721("Tricolor Pass", "TCPASS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a new Tricolor Pass
     * @param to Address to mint the pass to
     * @param tier Initial tier of the pass
     */
    function mintPass(address to, PassTier tier) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(!hasPass[to], "User already has a pass");
        require(tier <= PassTier.GOLD, "Invalid tier");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        passData[tokenId] = PassData({
            tier: tier,
            mintedAt: block.timestamp,
            xpPoints: 0,
            isActive: true
        });

        userToPass[to] = tokenId;
        hasPass[to] = true;

        emit PassMinted(to, tokenId, tier);
    }

    /**
     * @dev Award XP points to a pass holder
     * @param user Address of the pass holder
     * @param xpAmount Amount of XP to award
     */
    function awardXP(address user, uint256 xpAmount) external onlyRole(MINTER_ROLE) {
        require(hasPass[user], "User does not have a pass");
        
        uint256 tokenId = userToPass[user];
        require(passData[tokenId].isActive, "Pass is not active");

        passData[tokenId].xpPoints += xpAmount;

        // Check for tier upgrade based on XP
        PassTier currentTier = passData[tokenId].tier;
        PassTier newTier = _calculateTierFromXP(passData[tokenId].xpPoints);

        if (newTier > currentTier) {
            passData[tokenId].tier = newTier;
            emit PassUpgraded(user, tokenId, newTier);
        }

        emit XPAwarded(user, tokenId, xpAmount);
    }

    /**
     * @dev Calculate tier based on XP points
     * @param xpPoints Total XP points
     * @return tier Calculated tier
     */
    function _calculateTierFromXP(uint256 xpPoints) internal pure returns (PassTier) {
        if (xpPoints >= 5000) {
            return PassTier.GOLD;
        } else if (xpPoints >= 2000) {
            return PassTier.SILVER;
        } else {
            return PassTier.BRONZE;
        }
    }

    /**
     * @dev Get pass information for a user
     * @param user Address of the user
     * @return tokenId Token ID of the pass
     * @return tier Current tier
     * @return xpPoints Current XP points
     * @return isActive Whether the pass is active
     */
    function getPassInfo(address user) external view returns (
        uint256 tokenId,
        PassTier tier,
        uint256 xpPoints,
        bool isActive
    ) {
        require(hasPass[user], "User does not have a pass");
        
        tokenId = userToPass[user];
        PassData memory data = passData[tokenId];
        
        return (tokenId, data.tier, data.xpPoints, data.isActive);
    }

    /**
     * @dev Get XP required for next tier
     * @param user Address of the user
     * @return xpRequired XP required for next tier (0 if already max tier)
     */
    function getXPForNextTier(address user) external view returns (uint256 xpRequired) {
        require(hasPass[user], "User does not have a pass");
        
        uint256 tokenId = userToPass[user];
        PassTier currentTier = passData[tokenId].tier;
        uint256 currentXP = passData[tokenId].xpPoints;

        if (currentTier == PassTier.BRONZE) {
            return currentXP >= 2000 ? 0 : 2000 - currentXP;
        } else if (currentTier == PassTier.SILVER) {
            return currentXP >= 5000 ? 0 : 5000 - currentXP;
        } else {
            return 0; // Already max tier
        }
    }

    /**
     * @dev Check if user can upgrade to next tier
     * @param user Address of the user
     * @return canUpgrade Whether user can upgrade
     */
    function canUpgradeToNextTier(address user) external view returns (bool canUpgrade) {
        if (!hasPass[user]) return false;
        
        uint256 tokenId = userToPass[user];
        PassTier currentTier = passData[tokenId].tier;
        uint256 currentXP = passData[tokenId].xpPoints;

        PassTier calculatedTier = _calculateTierFromXP(currentXP);
        return calculatedTier > currentTier;
    }

    // Admin functions
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function setPassActive(uint256 tokenId, bool active) external onlyRole(ADMIN_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Pass does not exist");
        passData[tokenId].isActive = active;
    }

    // Override update to prevent trading (soulbound) and update mappings
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Soulbound: transfers not allowed");
        
        // Update mappings on transfer
        if (from != address(0)) {
            hasPass[from] = false;
            delete userToPass[from];
        }
        if (to != address(0)) {
            hasPass[to] = true;
            userToPass[to] = tokenId;
        }
        
        return super._update(to, tokenId, auth);
    }

    // Override _increaseBalance for ERC721Enumerable compatibility
    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    // Required overrides
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        
        PassData memory data = passData[tokenId];
        string memory tierName;
        
        if (data.tier == PassTier.BRONZE) {
            tierName = "Bronze";
        } else if (data.tier == PassTier.SILVER) {
            tierName = "Silver";
        } else {
            tierName = "Gold";
        }
        
        // In a real implementation, this would return a proper metadata URI
        return string(abi.encodePacked("https://tricolorpass.com/metadata/", tierName, "/", Strings.toString(tokenId)));
    }
}
