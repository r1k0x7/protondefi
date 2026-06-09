# ⚡ ProtonDeFi - Decentralized Lending Protocol

ProtonDeFi adalah protokol DeFi terdesentralisasi untuk lending dan borrowing yang dibangun di atas Ethereum. Protokol ini memungkinkan pengguna untuk menyetor aset sebagai collateral, meminjam aset lain, dan berpartisipasi dalam governance protokol.

## 🏗️ Arsitektur

```
ProtonDeFi/
├── contracts/           # Smart Contracts (Solidity)
│   ├── ProtonProtocol.sol      # Kontrak utama protokol
│   ├── ProtonToken.sol         # Governance token
│   ├── MockPriceOracle.sol     # Price oracle (mock untuk testing)
│   ├── MockERC20.sol           # Mock tokens untuk testing
│   ├── interfaces/             # Interface contracts
│   └── libraries/              # Utility libraries
├── frontend/            # Frontend Application (React + TypeScript)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utilities & constants
│   │   └── abi/               # Contract ABIs
│   └── public/               # Static assets
├── scripts/             # Deployment scripts
├── test/               # Test suite
└── docs/               # Documentation
```

## 🚀 Fitur Utama

### 1. Supply (Deposit)
- Setor aset sebagai collateral untuk memperoleh yield
- Dukungan multi-aset (WETH, USDC, USDT, DAI, WBTC, PROTON)
- APY dinamis berdasarkan utilisasi pasar
- Collateral factor yang dapat disesuaikan per aset

### 2. Borrow (Pinjam)
- Pinjam aset dengan collateral yang telah disetor
- Health factor real-time monitoring
- Liquidation protection otomatis
- Borrow limit berdasarkan nilai collateral

### 3. Liquidation
- Mekanisme liquidasi untuk akun yang tidak sehat
- Bonus liquidasi 8% untuk liquidator
- Close factor 50% per transaksi
- Otomatis menjaga solvabilitas protokol

### 4. Governance
- PROTON token untuk voting
- Proposal untuk perubahan parameter protokol
- Timelock untuk keamanan
- Community-driven development

## 📊 Parameter Protokol

| Parameter | Nilai | Deskripsi |
|-----------|-------|-----------|
| Collateral Factor (WETH) | 75% | Max borrow per $1 collateral |
| Collateral Factor (Stablecoins) | 80% | Max borrow per $1 collateral |
| Collateral Factor (PROTON) | 50% | Max borrow per $1 collateral |
| Liquidation Incentive | 8% | Bonus untuk liquidator |
| Close Factor | 50% | Max % debt yang bisa dilikuidasi |
| Reserve Factor | 10% | Protocol fee dari interest |
| Base Borrow Rate | 2% APR | Rate dasar peminjaman |
| Rate Multiplier | 20% APR | Multiplier utilisasi |

## 🔧 Smart Contracts

### ProtonProtocol.sol
Kontrak utama yang menangani:
- Manajemen aset (list/delist)
- Deposit dan withdraw
- Borrow dan repay
- Liquidation
- Interest accrual
- Health factor calculation

### ProtonToken.sol
Governance token dengan fitur:
- ERC20 standard
- Minting terbatas (max 100M)
- Initial supply 10M
- Owner-only minting

### MockPriceOracle.sol
Price oracle untuk testing:
- Set price manual per token
- Decimals support
- Owner-only price updates

## 🎨 Frontend

### Tech Stack
- **React 18** + TypeScript
- **Tailwind CSS** untuk styling
- **Wagmi** + **RainbowKit** untuk Web3 integration
- **Recharts** untuk data visualization
- **Framer Motion** untuk animations

### Pages
1. **Landing** - Halaman utama dengan informasi protokol
2. **Dashboard** - Overview portfolio dan aktivitas
3. **Markets** - Daftar semua pasar lending
4. **Portfolio** - Manajemen posisi supply/borrow
5. **Liquidate** - Liquidasi akun yang tidak sehat
6. **Governance** - Voting dan proposal

## 🛠️ Instalasi & Setup

### Prerequisites
- Node.js >= 18
- npm atau yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ProtonDeFi.git
cd ProtonDeFi
```

### 2. Install Dependencies (Smart Contracts)
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

### 4. Compile Contracts
```bash
npx hardhat compile
```

### 5. Run Tests
```bash
npx hardhat test
```

### 6. Deploy ke Local Network
```bash
npx hardhat node
# Di terminal lain:
npx hardhat run scripts/deploy.js --network localhost
```

### 7. Setup Frontend
```bash
cd frontend
npm install
```

### 8. Jalankan Frontend
```bash
npm run dev
# Buka http://localhost:3000
```

## 🧪 Testing

### Unit Tests
```bash
npx hardhat test
```

### Coverage Report
```bash
npx hardhat coverage
```

### Test Scenarios
- ✅ Deposit tokens
- ✅ Withdraw tokens
- ✅ Borrow against collateral
- ✅ Repay borrowed amount
- ✅ Liquidate unhealthy accounts
- ✅ Interest accrual
- ✅ Health factor calculation

## 🔒 Keamanan

### Best Practices yang Diterapkan
- **ReentrancyGuard** - Perlindungan terhadap reentrancy attacks
- **Pausable** - Emergency pause mechanism
- **Ownable** - Admin controls dengan ownership
- **SafeERC20** - Safe token transfers
- **Timelock** - Delay untuk perubahan kritis
- **Input Validation** - Validasi input yang komprehensif

### Audit Recommendations
- [ ] Audit oleh firma keamanan terpercaya
- [ ] Bug bounty program
- [ ] Formal verification untuk logic kritis
- [ ] Penetration testing

## 📈 Roadmap

### Phase 1 - MVP (Current)
- [x] Smart contracts dasar
- [x] Frontend dashboard
- [x] Mock oracle untuk testing
- [x] Basic liquidation mechanism

### Phase 2 - Mainnet Preparation
- [ ] Chainlink Price Feed integration
- [ ] Multi-sig admin controls
- [ ] Comprehensive test coverage
- [ ] Security audit
- [ ] Documentation complete

### Phase 3 - Launch
- [ ] Mainnet deployment
- [ ] Liquidity mining program
- [ ] Governance activation
- [ ] Community onboarding

### Phase 4 - Enhancement
- [ ] Flash loans
- [ ] Cross-chain bridges
- [ ] Advanced analytics
- [ ] Mobile app

## 🤝 Contributing

Kami menyambut kontribusi dari komunitas! Silakan:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- OpenZeppelin untuk library smart contract yang aman
- Hardhat untuk development environment
- Wagmi & RainbowKit untuk Web3 integration
- Komunitas DeFi untuk inspirasi dan best practices

## 📞 Kontak

- Website: [protondefi.io](https://protondefi.io)
- Twitter: [@ProtonDeFi](https://twitter.com/ProtonDeFi)
- Discord: [discord.gg/protondefi](https://discord.gg/protondefi)
- Email: hello@protondefi.io

---

⚡ Built with passion for decentralized finance
