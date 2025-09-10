# 🔴⚫⚪ Tricolor Pass - SPFC

> **Live SPFC every day. Earn XP and unlock real benefits.**

A hackathon project that revolutionizes São Paulo FC fans' experience through blockchain technology and gamification.

---

## 📋 About the Project

**Tricolor Pass** is an innovative platform that combines São Paulo FC fans' passion with Web3 blockchain technology. Through a system of dynamic NFTs and gamified quests, fans can:

- ✅ **Complete missions** at the stadium and online
- ⭐ **Earn XP** and evolve their fan level
- 🎁 **Redeem exclusive rewards**
- 🏆 **Compete** in global rankings
- 🎫 **Access unique VIP benefits**

## 🏗️ Technical Architecture

### Frontend
- **Next.js 13+** - React framework for production
- **TypeScript** - Static typing and secure development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth and interactive animations
- **React Hot Toast** - Elegant notifications

### Blockchain & Web3
- **Chiliz Spicy Testnet** - Sports-focused blockchain network
- **Ethers.js v6** - Smart contract interaction
- **Privy** - Simplified Web3 authentication
- **Solidity** - Smart contracts for NFTs and rewards

### Smart Contracts
- **TricolorPass.sol** - Main dynamic NFT
- **QuestManager.sol** - Quest and XP system
- **RewardDistributor.sol** - Reward distribution
- **MockSPFC.sol** - Ecosystem utility token

### Development Tools
- **Foundry** - Smart contract framework
- **OpenZeppelin** - Secure and audited contracts
- **Headless UI** - Accessible components
- **Heroicons** - Consistent SVG icons

## 🚀 How to Run

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone the repository
git clone https://github.com/username/tricolor-pass.git
cd tricolor-pass

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Privy keys
```

### Development
```bash
# Start development server
npm run dev

# Access at http://localhost:3000
```

### Smart Contracts
```bash
# Enter contracts folder
cd contracts

# Compile contracts
forge build

# Run tests
forge test

# Deploy to testnet (configure .env first)
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## 🎨 Design System

### Main Colors
- **SPFC Red**: `#C10016` - Official club color
- **Black**: `#000000` - Second official color
- **White**: `#FFFFFF` - Third official color
- **Gold**: `#FFD700` - Premium elements
- **Grays**: Scale from `#F8F9FA` to `#202124`

### Visual Components
- **SPFC Logo**: Official shield integration
- **SVG Animations**: Dynamic themed backgrounds
- **Rounded corners**: Modern design with `border-radius` up to `2rem`
- **Gradients**: Smooth color transitions
- **Shadows**: Depth with `shadow-lg` and `shadow-xl`

## 🎮 Features

### Pass System
- **Bronze**: Entry to the Tricolor world (100 $SPFC)
- **Silver**: Enhanced experience (1,000 $SPFC)
- **Gold**: Maximum experience (5,000 $SPFC)

### Quest Types
- **📱 QR Scan**: Scan codes at the stadium
- **🧠 Quiz**: Answer about SPFC history
- **🎯 Predictions**: Predict match results
- **📍 Check-in**: Presence at official events

### Reward System
- **Discounts**: Official store and tickets
- **VIP Experiences**: Behind-the-scenes and training
- **Exclusive NFTs**: Rare collectibles
- **$SPFC Tokens**: Ecosystem currency

## 🔗 Deployed Contracts

### Chiliz Spicy Testnet
```
TricolorPass: 0x... (to be updated)
QuestManager: 0x... (to be updated)
RewardDistributor: 0x... (to be updated)
MockSPFC: 0x... (to be updated)
```

## 🤝 Contributing

### How to Contribute
1. **Fork** the project
2. Create a **branch** for your feature (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/new-feature`)
5. Open a **Pull Request**

### Code Standards
- Use **TypeScript** for type safety
- Follow configured **ESLint** and **Prettier**
- Write **tests** for critical functions
- Document **contracts** with NatSpec
- Use **semantic commits**

## 📱 Roadmap

### Phase 1 - MVP ✅
- [x] Web3 authentication
- [x] Basic NFT system
- [x] Responsive interface
- [x] Chiliz integration

### Phase 2 - Gamification 🚧
- [ ] Complete quest system
- [ ] Competitive ranking
- [ ] Automatic rewards
- [ ] Club API integration

### Phase 3 - Expansion 🔮
- [ ] Official partnerships
- [ ] Mainnet deployment
- [ ] Native mobile app
- [ ] Other Brazilian clubs

## 🏆 Hackathon

This project was developed for **[Hackathon Name]** focusing on:
- **Innovation**: First Web3 loyalty program for Brazilian football
- **Technology**: Modern and scalable stack
- **UX/UI**: User-centered design
- **Impact**: Real fan engagement

### Team
- **Frontend Developer**: [Your name]
- **Smart Contracts**: [Name]
- **Design**: [Name]
- **Product**: [Name]

## 📄 License

This project is under the [MIT](LICENSE) license - see the LICENSE file for details.

## 🔗 Links

- **Website**: https://tricolor-pass.vercel.app
- **GitHub**: https://github.com/username/tricolor-pass
- **Demo**: https://youtu.be/demo-video
- **Pitch Deck**: [Presentation link]

---

<div align="center">

**Made with ❤️ for the best fans in the world**

🔴⚫⚪ **SPFC - Champion of everything!** ⚪⚫🔴

</div>
