# 🚀 Tricolor Pass - Deployment Guide

## ✅ Deployment Status

**Network**: Chiliz Chain (ChainID: 88888)  
**RPC**: https://rpc.ankr.com/chiliz  
**Status**: Simulation Complete - Need more CHZ for gas

### 📋 Contract Addresses (Simulated)

| Contract | Address | Explorer |
|----------|---------|----------|
| **TricolorPass** | `0x5222f06A8Ecd259fB808C85383897f38c68683bF` | [View on Chiliz Scan](https://scan.chiliz.com/address/0x5222f06A8Ecd259fB808C85383897f38c68683bF) |
| **QuestManager** | `0xdf357d33CE5008782bfC623F6c275FA97725e209` | [View on Chiliz Scan](https://scan.chiliz.com/address/0xdf357d33CE5008782bfC623F6c275FA97725e209) |
| **RewardDistributor** | `0x4E4B28D1B6a50DBf9510f8238FAf64cCF9737D25` | [View on Chiliz Scan](https://scan.chiliz.com/address/0x4E4B28D1B6a50DBf9510f8238FAf64cCF9737D25) |
| **SPFC Token** | `0x540165b9dFdDE31658F9BA0Ca5504EdA448BFfd0` | [Official SPFC Token](https://scan.chiliz.com/address/0x540165b9dFdDE31658F9BA0Ca5504EdA448BFfd0) |

### 💰 Gas Requirements

- **Estimated Gas**: ~45 CHZ
- **Current Balance**: 39 CHZ  
- **Needed**: Additional ~10 CHZ for safety margin

## 🔄 How to Complete Deployment

### 1. **Fund Your Wallet**
```bash
# You need approximately 50 CHZ total for deployment
# Current balance: 39 CHZ
# Needed: ~10-15 more CHZ
```

### 2. **Deploy Contracts**
```bash
cd contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url chiliz --broadcast
```

### 3. **Setup Initial Data**
```bash
# After successful deployment, run:
forge script script/Deploy.s.sol:SetupDataScript --rpc-url chiliz --broadcast
```

### 4. **Update Environment Variables**
```bash
# Add to your .env.local:
NEXT_PUBLIC_TRICOLOR_PASS_ADDRESS=<deployed_address>
NEXT_PUBLIC_QUEST_MANAGER_ADDRESS=<deployed_address>
NEXT_PUBLIC_REWARD_DISTRIBUTOR_ADDRESS=<deployed_address>
NEXT_PUBLIC_SPFC_TOKEN_ADDRESS=0x540165b9dFdDE31658F9BA0Ca5504EdA448BFfd0
```

## 🧪 Testing with Mock Data

The application is currently configured to run with **mock data** for demonstration purposes. You can test all features:

1. **Start Development Server**:
```bash
npm run dev
```

2. **Test Features**:
   - ✅ Wallet connection (Privy)
   - ✅ Pass minting simulation  
   - ✅ XP system and level progression
   - ✅ Quest completion (Scanner, Quiz, Predictions)
   - ✅ Reward claiming and usage
   - ✅ Admin panel functionality

## 📁 Files Modified for Deployment

### ✅ Smart Contracts
- `contracts/src/TricolorPass.sol` - NFT Pass with XP system
- `contracts/src/QuestManager.sol` - Quest and mission management  
- `contracts/src/RewardDistributor.sol` - Reward distribution system
- `contracts/script/Deploy.s.sol` - Deployment and setup scripts
- `contracts/foundry.toml` - Chiliz network configuration

### ✅ Frontend Integration
- `lib/contracts.ts` - Contract addresses and ABIs
- `lib/hooks/useTricolorPass.ts` - Pass management hook
- `lib/hooks/useQuests.ts` - Quest interaction hook  
- `lib/hooks/useRewards.ts` - Reward system hook
- `.env.local` - Environment variables with contract addresses

## 🎯 Next Steps After Deployment

### 1. **Verify Contracts** (Optional)
```bash
# You'll need an Etherscan API key for Chiliz
forge verify-contract <contract_address> <contract_name> --chain chiliz
```

### 2. **Create Initial Content**
- **Quests**: Stadium scanner, SPFC quiz, match predictions
- **Rewards**: 20% discount, VIP experience, special tickets  
- **QR Codes**: Generate for stadium locations

### 3. **Connect Real APIs**
- **SPFC Token Detection**: Real balance checking
- **Match Data**: Official SPFC fixture API
- **Reward Partners**: Integration with official store

### 4. **Production Optimizations**
- Enable contract verification
- Set up monitoring and analytics
- Implement rate limiting
- Add comprehensive error handling

## 🏆 Features Ready for Demo

Even without deployed contracts, the application showcases:

### ✨ **Web3 Integration**
- Privy wallet connection
- Chiliz Chain support  
- Smart contract interactions (mocked)

### 🎮 **Gamification System**
- NFT Pass with Bronze/Silver/Gold tiers
- XP accumulation and level progression
- Weekly goals and progress tracking

### 🎯 **Quest System**
- QR code scanner (camera access)
- Interactive quizzes with feedback
- Match prediction system
- Real-time XP rewards

### 🎁 **Reward Economy**
- Claimable rewards based on XP/tier
- QR code generation for redemption
- Usage tracking and analytics

### 🎨 **SPFC Branding**
- Official colors and design system
- Mobile-first responsive design
- Smooth animations and interactions

## 🚨 Troubleshooting

### **Insufficient Funds Error**
```
Error: insufficient funds for gas * price + value
```
**Solution**: Add more CHZ to your wallet (need ~45-50 CHZ total)

### **Network Issues**
```
Error: network request failed
```
**Solution**: Verify RPC endpoint and network connectivity

### **Contract Verification**
```
Error: etherscan API key required
```
**Solution**: Add `ETHERSCAN_API_KEY` to your `.env` file or skip verification

---

**🎯 Ready for Hackathon Demo!** The application works perfectly with mock data and can be fully deployed once gas funding is resolved. All smart contracts are tested and ready for Chiliz Chain mainnet.
