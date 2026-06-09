# ProtonDeFi Architecture Documentation

## System Overview

ProtonDeFi adalah protokol lending terdesentralisasi yang terdiri dari 3 komponen utama:

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + TypeScript + Tailwind + Wagmi + RainbowKit       │
│                                                             │
│  Pages: Dashboard | Markets | Portfolio | Liquidate | Gov │
└──────────────────────┬──────────────────────────────────────┘
                       │ Web3 / JSON-RPC
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     SMART CONTRACTS                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  ProtonToken │  │MockPriceOracle│  │ProtonProtocol│      │
│  │  (ERC20)     │  │  (Price Feed)│  │  (Main)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MockERC20  │  │   SafeMath   │  │   IERC20     │      │
│  │  (Test Tokens)│  │  (Library)   │  │  (Interface) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Contract Interactions

### Deposit Flow
```
User → approve(token, protocol, amount) → ERC20
User → deposit(token, amount) → ProtonProtocol
       → transferFrom(user, protocol, amount) → ERC20
       → update user deposits
       → update total deposits
       → emit Deposit event
```

### Borrow Flow
```
User → borrow(token, amount) → ProtonProtocol
       → check account health
       → check liquidity
       → update user borrows
       → update total borrows
       → transfer(token, user, amount) → ERC20
       → emit Borrow event
```

### Liquidation Flow
```
Liquidator → liquidate(borrower, debtToken, collateralToken, amount) → ProtonProtocol
             → check borrower is unhealthy
             → calculate seize tokens (with 8% bonus)
             → transferFrom(liquidator, protocol, repayAmount) → debtToken
             → update borrower debt
             → update borrower collateral
             → transfer(collateralToken, liquidator, seizeTokens) → ERC20
             → emit Liquidate event
```

## Data Flow

### Interest Accrual
```
Every interaction triggers _accrueInterest(token):
1. Calculate time delta since last update
2. Calculate utilization rate
3. Calculate borrow rate based on utilization
4. Calculate interest accumulated
5. Split interest: protocol fees + supplier rewards
6. Update total borrows and deposits
7. Update rates per second
```

### Health Factor Calculation
```
getAccountHealth(user):
1. Iterate through all listed tokens
2. For each token:
   - Calculate collateral value (deposits * price * collateralFactor)
   - Calculate borrow value (borrows * price)
3. Sum all collateral values
4. Sum all borrow values
5. Account is healthy if collateral >= borrow
```

## Security Model

### Access Control
- **Owner**: Admin functions (list/delist assets, pause, update oracle)
- **Users**: Deposit, withdraw, borrow, repay, liquidate
- **Protocol**: Internal functions for interest accrual

### Risk Parameters
| Asset | Collateral Factor | Liquidation Threshold | Reserve Factor |
|-------|------------------|----------------------|----------------|
| WETH | 75% | 80% | 10% |
| USDC | 80% | 85% | 10% |
| USDT | 80% | 85% | 10% |
| DAI | 80% | 85% | 10% |
| WBTC | 75% | 80% | 10% |
| PROTON | 50% | 60% | 10% |

### Liquidation Logic
- Trigger: Health factor < 100%
- Close Factor: Max 50% of debt per liquidation
- Liquidation Incentive: 8% bonus for liquidator
- Seized collateral: (repayAmount * price * 1.08) / collateralPrice

## Frontend Architecture

### State Management
- **Wagmi**: Web3 state (account, balances, contract reads/writes)
- **React Query**: Server state caching
- **React State**: UI state (modals, filters, forms)

### Component Hierarchy
```
App
├── Layout
│   ├── Sidebar (Navigation)
│   └── ConnectButton
├── Pages
│   ├── Landing (Unconnected)
│   ├── Dashboard
│   │   ├── StatsCards
│   │   ├── HealthBar
│   │   ├── Chart (TVL)
│   │   ├── RecentActivity
│   │   └── AssetTable
│   ├── Markets
│   │   └── MarketCards
│   ├── Portfolio
│   │   ├── PositionList
│   │   └── HealthBar
│   ├── Liquidate
│   │   └── LiquidatableAccounts
│   └── Governance
│       └── ProposalList
└── Modals
    └── SupplyModal
```

## Gas Optimization

### Techniques Used
1. **Unchecked math**: Using SafeMath for overflow protection
2. **Storage packing**: Grouping related variables
3. **Event indexing**: Indexed parameters for efficient filtering
4. **View functions**: Pure/view for read-only operations
5. **Batch operations**: Single transaction for multiple updates

### Gas Estimates (approximate)
| Operation | Gas Cost |
|-----------|----------|
| Deposit | ~80,000 |
| Withdraw | ~100,000 |
| Borrow | ~120,000 |
| Repay | ~90,000 |
| Liquidate | ~150,000 |

## Upgradeability

Current implementation is **not upgradeable** (for simplicity and security). Future versions may implement:
- Proxy pattern (UUPS or Transparent)
- Diamond pattern for modularity
- Governance-controlled upgrades with timelock

## Testing Strategy

### Unit Tests
- Individual function testing
- Edge cases (zero amounts, max values)
- Access control validation
- Event emission verification

### Integration Tests
- Full user flows (deposit → borrow → repay → withdraw)
- Liquidation scenarios
- Interest accrual over time
- Multi-user interactions

### Fuzzing (Recommended)
- Random input testing
- Invariant testing
- Property-based testing

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Code coverage > 90%
- [ ] Security audit complete
- [ ] Documentation updated
- [ ] Mainnet fork testing

### Deployment
- [ ] Deploy MockPriceOracle
- [ ] Deploy ProtonToken
- [ ] Deploy ProtonProtocol
- [ ] Deploy MockERC20 tokens
- [ ] Set prices in oracle
- [ ] List assets in protocol
- [ ] Verify contracts on Etherscan
- [ ] Transfer ownership to timelock/multisig

### Post-deployment
- [ ] Monitor for anomalies
- [ ] Set up alerting
- [ ] Enable governance
- [ ] Launch liquidity mining
- [ ] Community announcement
