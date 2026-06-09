export const PROTOCOL_ADDRESS = '0x...' // Replace with deployed address

export const PROTOCOL_ABI = [
  // Events
  'event Deposit(address indexed user, address indexed token, uint256 amount)',
  'event Withdraw(address indexed user, address indexed token, uint256 amount)',
  'event Borrow(address indexed user, address indexed token, uint256 amount)',
  'event Repay(address indexed user, address indexed token, uint256 amount)',
  'event Liquidate(address indexed liquidator, address indexed borrower, address indexed collateralToken, address debtToken, uint256 repayAmount, uint256 seizeTokens)',

  // View Functions
  'function getAccountHealth(address user) external view returns (uint256 collateralValue, uint256 borrowValue, bool isHealthy)',
  'function getAccountDeposit(address user, address token) external view returns (uint256)',
  'function getAccountBorrow(address user, address token) external view returns (uint256)',
  'function getAssetInfo(address token) external view returns (tuple(bool isListed, uint256 collateralFactor, uint256 borrowFactor, uint256 totalDeposits, uint256 totalBorrows, uint256 reserveFactor, uint256 lastUpdateTime, uint256 supplyRatePerSecond, uint256 borrowRatePerSecond, uint256 accrualBlockNumber))',
  'function getTokenList() external view returns (address[] memory)',
  'function getMaxBorrowAmount(address user, address token) external view returns (uint256)',
  'function getAccountLiquidity(address user) external view returns (uint256)',
  'function getUtilizationRate(address token) external view returns (uint256)',
  'function getSupplyAPY(address token) external view returns (uint256)',
  'function getBorrowAPY(address token) external view returns (uint256)',

  // Write Functions
  'function deposit(address token, uint256 amount) external',
  'function withdraw(address token, uint256 amount) external',
  'function borrow(address token, uint256 amount) external',
  'function repay(address token, uint256 amount) external',
  'function liquidate(address borrower, address debtToken, address collateralToken, uint256 repayAmount) external',

  // Admin Functions
  'function listAsset(address token, uint256 collateralFactor, uint256 borrowFactor, uint256 reserveFactor) external',
  'function pause() external',
  'function unpause() external',
]

export const ERC20_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string memory)',
  'function name() external view returns (string memory)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]

export const SUPPORTED_TOKENS = [
  { symbol: 'WETH', name: 'Wrapped ETH', decimals: 18, logo: 'Ξ' },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, logo: '$' },
  { symbol: 'USDT', name: 'Tether USD', decimals: 6, logo: '₮' },
  { symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, logo: '◈' },
  { symbol: 'WBTC', name: 'Wrapped BTC', decimals: 8, logo: '₿' },
  { symbol: 'PROTON', name: 'Proton Token', decimals: 18, logo: '⚡' },
]
