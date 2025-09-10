# 🔴⚫⚪ Tricolor Pass - SPFC

> **Viva o SPFC todos os dias. Ganhe XP e desbloqueie benefícios de verdade.**

Um projeto desenvolvido para hackathon que revoluciona a experiência dos torcedores do São Paulo FC através de tecnologia blockchain e gamificação.

---

## 📋 Sobre o Projeto

O **Tricolor Pass** é uma plataforma inovadora que combina a paixão dos torcedores do São Paulo FC com tecnologia blockchain Web3. Através de um sistema de NFTs dinâmicos e missões gamificadas, os torcedores podem:

- ✅ **Completar missões** no estádio e online
- ⭐ **Ganhar XP** e evoluir seu nível de torcedor  
- 🎁 **Resgatar recompensas** exclusivas
- 🏆 **Competir** no ranking global
- 🎫 **Acessar benefícios** VIP únicos

## 🏗️ Arquitetura Técnica

### Frontend
- **Next.js 13+** - Framework React para produção
- **TypeScript** - Tipagem estática e desenvolvimento seguro
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas e interativas
- **React Hot Toast** - Notificações elegantes

### Blockchain & Web3
- **Chiliz Spicy Testnet** - Rede blockchain para esportes
- **Ethers.js v6** - Interação com contratos inteligentes
- **Privy** - Autenticação Web3 simplificada
- **Solidity** - Smart contracts para NFTs e recompensas

### Smart Contracts
- **TricolorPass.sol** - NFT dinâmico principal
- **QuestManager.sol** - Sistema de missões e XP
- **RewardDistributor.sol** - Distribuição de recompensas
- **MockSPFC.sol** - Token utilitário do ecosistema

### Ferramentas de Desenvolvimento
- **Foundry** - Framework para smart contracts
- **OpenZeppelin** - Contratos seguros e auditados
- **Headless UI** - Componentes acessíveis
- **Heroicons** - Ícones SVG consistentes

## 🚀 Como Executar

### Pré-requisitos
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/username/tricolor-pass.git
cd tricolor-pass

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves da Privy
```

### Desenvolvimento
```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse em http://localhost:3000
```

### Smart Contracts
```bash
# Entre na pasta dos contratos
cd contracts

# Compile os contratos
forge build

# Execute os testes
forge test

# Deploy na testnet (configure .env primeiro)
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## 🎨 Design System

### Cores Principais
- **Vermelho SPFC**: `#C10016` - Cor oficial do clube
- **Preto**: `#000000` - Segunda cor oficial  
- **Branco**: `#FFFFFF` - Terceira cor oficial
- **Dourado**: `#FFD700` - Elementos premium
- **Cinzas**: Escala de `#F8F9FA` a `#202124`

### Componentes Visuais
- **Logo SPFC**: Integração do escudo oficial
- **Animações SVG**: Fundos dinâmicos temáticos
- **Bordas arredondadas**: Design moderno com `border-radius` de até `2rem`
- **Gradientes**: Transições suaves entre cores
- **Sombras**: Profundidade com `shadow-lg` e `shadow-xl`

## 🎮 Funcionalidades

### Sistema de Passes
- **Bronze**: Entrada no mundo Tricolor (100 $SPFC)
- **Prata**: Experiência aprimorada (1.000 $SPFC)  
- **Ouro**: Máxima experiência (5.000 $SPFC)

### Tipos de Missões
- **📱 Scan QR**: Escaneie códigos no estádio
- **🧠 Quiz**: Responda sobre história do SPFC
- **🎯 Palpites**: Preveja resultados dos jogos
- **📍 Check-in**: Presença em eventos oficiais

### Sistema de Recompensas
- **Descontos**: Loja oficial e ingressos
- **Experiências VIP**: Bastidores e treinamentos
- **NFTs Exclusivos**: Colecionáveis raros
- **Tokens $SPFC**: Moeda do ecosistema

## 🔗 Contratos Deployed

### **Chiliz Spicy Testnet (ChainID: 88882)**

- **MockSPFC Token** (Faucet): [`0x3c05A2De1449F2C113499A97fa7BeDF64165C5b0`](https://spicy-explorer.chiliz.com/address/0x3c05A2De1449F2C113499A97fa7BeDF64165C5b0)
- **TricolorPass NFT**: [`0x218e55aeF350110f7b95ec1EB2e9ef3175CbDEF4`](https://spicy-explorer.chiliz.com/address/0x218e55aeF350110f7b95ec1EB2e9ef3175CbDEF4)
- **QuestManager**: [`0xFBdb303D86C9d0FB19D651C5374BCAFfBF168eC8`](https://spicy-explorer.chiliz.com/address/0xFBdb303D86C9d0FB19D651C5374BCAFfBF168eC8)
- **RewardDistributor**: [`0x841F0DAe8493844b227b7eCB2Fb6ea77a4A2d6e9`](https://spicy-explorer.chiliz.com/address/0x841F0DAe8493844b227b7eCB2Fb6ea77a4A2d6e9)

> 🌐 **Explorer:** [Chiliz Spicy Explorer](https://spicy-explorer.chiliz.com/)

## 🤝 Contribuindo

### Como Contribuir
1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### Padrões de Code
- Use **TypeScript** para type safety
- Siga o **ESLint** e **Prettier** configurados
- Escreva **testes** para funções críticas
- Documente **contratos** com NatSpec
- Use **commits semânticos**

## 📱 Roadmap

### Fase 1 - MVP ✅
- [x] Autenticação Web3 
- [x] Sistema básico de NFTs
- [x] Interface responsiva
- [x] Integração Chiliz

### Fase 2 - Gamificação 🚧
- [ ] Sistema completo de missões
- [ ] Ranking competitivo
- [ ] Recompensas automáticas
- [ ] Integração APIs do clube

### Fase 3 - Expansão 🔮
- [ ] Parcerias oficiais
- [ ] Mainnet deployment  
- [ ] App mobile nativo
- [ ] Outros clubes brasileiros

## 🏆 Hackathon

Este projeto foi desenvolvido para **[Nome do Hackathon]** com foco em:
- **Inovação**: Primeiro loyalty program Web3 para futebol brasileiro
- **Tecnologia**: Stack moderna e escalável
- **UX/UI**: Design centrado no usuário
- **Impacto**: Engajamento real de torcedores

### Equipe
- **Desenvolvedor Frontend**: [Seu nome]
- **Smart Contracts**: [Nome]
- **Design**: [Nome]  
- **Product**: [Nome]

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE) - veja o arquivo LICENSE para detalhes.

## 🔗 Links

- **Website**: https://tricolor-pass.vercel.app
- **GitHub**: https://github.com/username/tricolor-pass
- **Demo**: https://youtu.be/demo-video
- **Pitch Deck**: [Link da apresentação]

---

<div align="center">

**Feito com ❤️ para a melhor torcida do mundo** 

🔴⚫⚪ **SPFC - Campeão de tudo!** ⚪⚫🔴

</div>
