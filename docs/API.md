# ProtonDeFi API Documentation

## Smart Contract API

### ProtonProtocol

#### Events

##### Deposit
```solidity
event Deposit(address indexed user, address indexed token, uint256 amount);
```
Emitted when a user deposits tokens.

##### Withdraw
```solidity
event Withdraw(address indexed user, address indexed token, uint256 amount);
```
Emitted when a user withdraws tokens.

##### Borrow
```solidity
event Borrow(address indexed user, address indexed token, uint256 amount);
```
Emitted when a user borrows tokens.

##### Repay
```solidity
event Repay(address indexed user, address indexed token, uint256 amount);
```
Emitted when a user repays borrowed tokens.

##### Liquidate
```solidity
event Liquidate(
    address indexed liquidator,
    address indexed borrower,
    address indexed collateralToken,
    address debtToken,
    uint256 repayAmount,
    uint256 seizeTokens
);
```
Emitted when a liquidation occurs.

#### View Functions

##### getAccountHealth
```solidity
function getAccountHealth(address user) 
    external 
    view 
    returns (uint256 collateralValue, uint256 borrowValue, bool isHealthy);
```
Returns the health status of an account.

**Parameters:**
- `user`: Address of the account to check

**Returns:**
- `collateralValue`: Total collateral value in USD (8 decimals)
- `borrowValue`: Total borrow value in USD (8 decimals)
- `isHealthy`: True if account is healthy

##### getAccountDeposit
```solidity
function getAccountDeposit(address user, address token) 
    external 
    view 
    returns (uint256);
```
Returns the deposit amount of a specific token for a user.

##### getAccountBorrow
```solidity
function getAccountBorrow(address user, address token) 
    external 
    view 
    returns (uint256);
```
Returns the borrow amount of a specific token for a user.

##### getAssetInfo
```solidity
function getAssetInfo(address token) 
    external 
    view 
    returns (Asset memory);
```
Returns information about a listed asset.

**Returns (Asset struct):**
- `isListed`: Whether the asset is listed
- `collateralFactor`: Collateral factor in basis points
- `borrowFactor`: Borrow factor in basis points
- `totalDeposits`: Total deposits of the asset
- `totalBorrows`: Total borrows of the asset
- `reserveFactor`: Protocol fee in basis points
- `lastUpdateTime`: Last interest accrual timestamp
- `supplyRatePerSecond`: Current supply rate
- `borrowRatePerSecond`: Current borrow rate
- `accrualBlockNumber`: Last accrual block

##### getTokenList
```solidity
function getTokenList() external view returns (address[] memory);
```
Returns array of all listed token addresses.

##### getMaxBorrowAmount
```solidity
function getMaxBorrowAmount(address user, address token) 
    external 
    view 
    returns (uint256);
```
Returns maximum amount a user can borrow of a specific token.

##### getAccountLiquidity
```solidity
function getAccountLiquidity(address user) external view returns (uint256);
```
Returns available borrowing power in USD.

##### getUtilizationRate
```solidity
function getUtilizationRate(address token) external view returns (uint256);
```
Returns current utilization rate (0-1e18).

##### getSupplyAPY
```solidity
function getSupplyAPY(address token) external view returns (uint256);
```
Returns current supply APY (0-1e18).

##### getBorrowAPY
```solidity
function getBorrowAPY(address token) external view returns (uint256);
```
Returns current borrow APY (0-1e18).

#### Write Functions

##### deposit
```solidity
function deposit(address token, uint256 amount) external;
```
Deposit tokens as collateral.

**Parameters:**
- `token`: Address of the token to deposit
- `amount`: Amount to deposit (in token decimals)

**Requirements:**
- Token must be listed
- Amount > 0
- User must have approved protocol to spend tokens

##### withdraw
```solidity
function withdraw(address token, uint256 amount) external;
```
Withdraw deposited tokens.

**Parameters:**
- `token`: Address of the token to withdraw
- `amount`: Amount to withdraw

**Requirements:**
- Token must be listed
- Amount > 0
- User must have sufficient deposit balance
- Withdrawal must not make account unhealthy

##### borrow
```solidity
function borrow(address token, uint256 amount) external;
```
Borrow tokens against collateral.

**Parameters:**
- `token`: Address of the token to borrow
- `amount`: Amount to borrow

**Requirements:**
- Token must be listed
- Amount > 0
- Sufficient liquidity available
- Borrow must not make account unhealthy

##### repay
```solidity
function repay(address token, uint256 amount) external;
```
Repay borrowed tokens.

**Parameters:**
- `token`: Address of the token to repay
- `amount`: Amount to repay (use type(uint256).max for full repayment)

**Requirements:**
- Token must be listed
- Amount > 0
- User must have borrow balance

##### liquidate
```solidity
function liquidate(
    address borrower,
    address debtToken,
    address collateralToken,
    uint256 repayAmount
) external;
```
Liquidate an unhealthy borrower.

**Parameters:**
- `borrower`: Address of the borrower to liquidate
- `debtToken`: Token to repay
- `collateralToken`: Token to seize as collateral
- `repayAmount`: Amount of debt to repay

**Requirements:**
- Borrower must be unhealthy
- Liquidator cannot be the borrower
- Repay amount <= close factor * borrow balance

#### Admin Functions

##### listAsset
```solidity
function listAsset(
    address token,
    uint256 collateralFactor,
    uint256 borrowFactor,
    uint256 reserveFactor
) external onlyOwner;
```

##### delistAsset
```solidity
function delistAsset(address token) external onlyOwner;
```

##### updatePriceOracle
```solidity
function updatePriceOracle(address newOracle) external onlyOwner;
```

##### updateCollateralFactor
```solidity
function updateCollateralFactor(address token, uint256 newFactor) external onlyOwner;
```

##### pause / unpause
```solidity
function pause() external onlyOwner;
function unpause() external onlyOwner;
```

## Frontend Hooks

### useProtocol
```typescript
const { 
  accountHealth, 
  tokenList, 
  deposit, 
  withdraw, 
  borrow, 
  repay,
  isDepositing,
  isWithdrawing,
  isBorrowing,
  isRepaying 
} = useProtocol();
```

### useTokenBalance
```typescript
const { balance, formattedBalance } = useTokenBalance(tokenAddress);
```

### useTokenAllowance
```typescript
const { allowance, approve } = useTokenAllowance(tokenAddress, spenderAddress);
```

## Error Codes

| Error Message | Description |
|--------------|-------------|
| "Token not listed" | Asset belum didaftarkan di protokol |
| "Amount must be greater than 0" | Input amount tidak valid |
| "Insufficient deposit balance" | Balance deposit tidak cukup |
| "Insufficient liquidity" | Likuiditas protokol tidak cukup |
| "Borrow would make account unhealthy" | Borrow akan membuat akun tidak sehat |
| "Withdrawal would make account unhealthy" | Withdraw akan membuat akun tidak sehat |
| "No borrow balance" | Tidak ada pinjaman untuk direpay |
| "Cannot liquidate self" | Tidak bisa melikuidasi diri sendiri |
| "Borrower is healthy" | Akun target masih sehat |
| "Insufficient collateral" | Collateral tidak cukup untuk liquidasi |

## Event Filtering

### Deposit Events
```typescript
const filter = protocol.filters.Deposit(userAddress, null);
const events = await protocol.queryFilter(filter);
```

### Liquidation Events
```typescript
const filter = protocol.filters.Liquidate(null, borrowerAddress, null, null, null, null);
const events = await protocol.queryFilter(filter);
```

