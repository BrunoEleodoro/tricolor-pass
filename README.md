# 🔴⚫⚪ Tricolor Pass - São Paulo FC Fan Experience Platform

> **Plataforma Web3 que conecta torcedores do SPFC através de missões, XP e recompensas exclusivas.**

🏆 **Construído para Hackathon Chiliz** - Utilizando smart contracts na Chiliz Chain para NFTs, XP e recompensas.

---

## 📚 Documentação

- **🇧🇷 [README em Português](README-PT.md)** - Documentação completa em português
- **🇺🇸 [English README](README-EN.md)** - Complete documentation in English

---

## 🎯 Visão Geral

O Tricolor Pass é uma plataforma inovadora que gamifica a experiência de ser torcedor do São Paulo FC. Os fãs podem:

- **🎫 Mintar NFT Pass** (Bronze/Prata/Ouro) com base em holdings $SPFC
- **⚡ Completar Missões** (scanner QR no estádio, quiz, palpites)
- **📈 Ganhar XP** e evoluir níveis do passe
- **🎁 Resgatar Recompensas** (descontos, produtos, experiências VIP)

## 🚀 Demo MVP (4 Telas Principais)

### 1. **Welcome / Conectar & Mintar Passe**
- Conecta carteira Web3 via Privy
- Detecta holdings $SPFC 
- Seleção de tier (Bronze/Prata/Ouro)
- Minting do NFT Pass on-chain

### 2. **Home (Dashboard)**
- Badge + barra de XP com metas semanais
- Próximo jogo do SPFC
- Quests do dia (3 missões ativas)
- Preview de recompensas disponíveis

### 3. **Quest Detalhe + Provas**
- Detalhes da missão com instruções
- **Scanner QR** (overlay com câmera)
- **Quiz interativo** com feedback
- **Sistema de palpites** para jogos
- Feedback de XP ganho

### 4. **Recompensas**
- Lista de recompensas disponíveis/resgatadas
- Modal com QR code para resgate
- Sistema de cupons com códigos únicos
- Marcação como "usada"

### 5. **Admin Panel** (Opcional)
- Criação de quests e recompensas
- Geração de QR codes em lote
- Relatórios de engagement

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 13+** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling responsivo
- **Framer Motion** - Animações
- **Privy** - Autenticação Web3
- **React Hot Toast** - Notificações

### **Blockchain**
- **Solidity ^0.8.20** - Smart contracts
- **Foundry** - Development framework
- **OpenZeppelin** - Security standards
- **Chiliz Chain** - Target blockchain
- **Ethers.js** - Blockchain interaction

### **Smart Contracts**
1. **TricolorPass.sol** - NFT ERC-721 soulbound
2. **QuestManager.sol** - Sistema de missões
3. **RewardDistributor.sol** - Distribuição de recompensas

## 📦 Instalação e Setup

### **1. Clone o Repositório**
```bash
git clone <repo-url>
cd tricolor-pass
```

### **2. Instalar Dependências**
```bash
# Frontend
npm install

# Smart Contracts
cd contracts
forge install
cd ..
```

### **3. Configurar Variáveis de Ambiente**

Crie `.env.local`:
```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# Contract Addresses (após deploy)
NEXT_PUBLIC_TRICOLOR_PASS_ADDRESS=0x...
NEXT_PUBLIC_QUEST_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_REWARD_DISTRIBUTOR_ADDRESS=0x...
```

Crie `contracts/.env`:
```env
# Deployment
PRIVATE_KEY=your_private_key
CHILIZ_RPC_URL=https://rpc.chiliz.com
ETHERSCAN_API_KEY=your_etherscan_key
```

### **4. Deploy dos Smart Contracts**

```bash
cd contracts

# Compile
forge build

# Deploy na Chiliz
forge script script/Deploy.s.sol --rpc-url $CHILIZ_RPC_URL --broadcast --verify

# Setup dados iniciais
forge script script/Deploy.s.sol:SetupDataScript --rpc-url $CHILIZ_RPC_URL --broadcast
```

### **5. Executar Aplicação**

```bash
# Development server
npm run dev

# Build production
npm run build
npm start
```

## 🎮 Como Usar (Demo Script)

### **Fluxo Completo em 2-3 Minutos:**

1. **Conectar Carteira** → Badge do passe aparece
2. **Ir para Home** → Ver "Quests do dia"
3. **Abrir Quest Scanner** → Ler QR → **+100 XP**
4. **Abrir Quest Quiz** → Responder → **+50 XP + Level Up**
5. **Ir em Recompensas** → **Resgatar** cupom → Mostrar QR → "Usada"

### **Funcionalidades Demonstráveis:**

✅ **Conectividade Web3** (Privy + Chiliz)  
✅ **NFT Minting** (com tiers baseados em $SPFC)  
✅ **Sistema XP** (ganho, acúmulo, level up)  
✅ **Quests Interativas** (QR scanner, quiz, palpites)  
✅ **Economia de Recompensas** (claim, uso, tracking)  
✅ **Interface Responsiva** (mobile-first)  
✅ **Painel Admin** (criação de conteúdo)  

## 🔧 Arquitetura dos Contratos

### **TricolorPass.sol**
- NFT ERC-721 soulbound (não-transferível)
- Tiers: Bronze (0-2000 XP), Prata (2000-5000), Ouro (5000+)
- Sistema de XP on-chain com auto-upgrade
- Mapeamento 1:1 (usuário → passe)

### **QuestManager.sol**
- Tipos: SCAN_QR, QUIZ, PREDICTION, SOCIAL, ATTENDANCE
- Sistema de provas (hash verification)
- Cooldowns e limites de completação
- Integração com TricolorPass para XP

### **RewardDistributor.sol**
- Tipos: DISCOUNT, MERCHANDISE, EXPERIENCE, DIGITAL
- Requirement gates (XP mínimo, tier mínimo)
- Supply limitado com tracking
- Códigos únicos de resgate

## 🎨 Design System

### **Cores SPFC**
- **Primary Red**: `#C10016`
- **Dark Background**: `#0F1115`
- **Gray Variants**: `#1A1D23`, `#252A33`, `#3A3F4A`
- **Tier Colors**: Gold `#FFD700`, Silver `#C0C0C0`, Bronze `#CD7F32`

### **Componentes UI**
- Cards responsivos com hover effects
- Progress bars animadas (XP)
- Modal overlays para scanner/quiz
- Toast notifications
- Loading states

## 🏆 Qualificação Bounty Chiliz

### **Smart Contracts na Chiliz:**
✅ **NFT System** - Tricolor Pass como ERC-721  
✅ **Token Economics** - XP como sistema de pontos  
✅ **Utility** - Recompensas reais desbloqueáveis  
✅ **Fan Engagement** - Missões conectadas ao clube  

### **Inovações Web3:**
- **Soulbound NFTs** - Passes não-transferíveis
- **Dynamic Metadata** - Tier upgrades automáticos  
- **Proof Systems** - Verificação de ações off-chain
- **Decentralized Rewards** - Economia de pontos on-chain

## 📱 Mobile-First UX

- Interface otimizada para celular
- Scanner QR nativo (camera API)
- Gestos touch-friendly
- Responsive grid layouts
- Progressive Web App (PWA) ready

## 🔮 Roadmap Futuro

### **V2 Features:**
- Integração $SPFC token real
- Marketplace P2P de recompensas
- Sistema de rankings/leaderboards
- Integração APIs oficiais do clube
- Multi-chain support (Polygon, Arbitrum)

### **Advanced Gamification:**
- Achievements/badges colecionáveis
- Seasonal events e campanhas
- Parcerias com patrocinadores
- Social features (compartilhamento)

## 👥 Time & Contribuições

Desenvolvido para **Hackathon Chiliz** focando em:
- **User Experience** excepcional
- **Smart Contracts** seguros e auditáveis  
- **Real Utility** para torcedores
- **Scalable Architecture** para crescimento

## 📄 Licença

MIT License - Livre para uso e modificação.

---

**⚡ Ready for Demo!** - Aplicação completa rodando com mock data para apresentação, preparada para integração real com contratos deployados na Chiliz Chain.

**🎯 Business Case:** Plataforma escala para qualquer clube esportivo, criando nova economia digital para engajamento de fãs com utility real através de Web3.