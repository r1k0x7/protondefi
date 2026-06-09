// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPriceOracle.sol";
import "./libraries/SafeMath.sol";

/**
 * @title ProtonDeFi Protocol
 * @notice Decentralized Lending & Borrowing Protocol
 * @dev Users can deposit assets as collateral and borrow other assets
 */
contract ProtonProtocol is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // ============ Structs ============
    struct Asset {
        bool isListed;
        uint256 collateralFactor;     // 0-10000 (basis points, e.g. 7500 = 75%)
        uint256 borrowFactor;         // 0-10000
        uint256 totalDeposits;
        uint256 totalBorrows;
        uint256 reserveFactor;        // Protocol fee (basis points)
        uint256 lastUpdateTime;
        uint256 supplyRatePerSecond;  // Interest rate for suppliers
        uint256 borrowRatePerSecond;  // Interest rate for borrowers
        uint256 accrualBlockNumber;
    }

    struct UserAccount {
        mapping(address => uint256) deposits;
        mapping(address => uint256) borrows;
        mapping(address => uint256) borrowIndex;
        bool isLiquidatable;
    }

    // ============ State Variables ============
    mapping(address => Asset) public assets;
    mapping(address => UserAccount) public accounts;
    mapping(address => bool) public allowedTokens;

    address[] public tokenList;
    IPriceOracle public priceOracle;

    uint256 public constant COLLATERAL_FACTOR_BASE = 10000;
    uint256 public constant SECONDS_PER_YEAR = 31536000;
    uint256 public constant LIQUIDATION_INCENTIVE = 10800; // 8% bonus for liquidators (basis points)
    uint256 public constant CLOSE_FACTOR = 5000; // 50% max liquidation per call

    uint256 public totalProtocolFees;
    address public feeRecipient;

    // ============ Events ============
    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event Liquidate(
        address indexed liquidator,
        address indexed borrower,
        address indexed collateralToken,
        address debtToken,
        uint256 repayAmount,
        uint256 seizeTokens
    );
    event AssetListed(address indexed token, uint256 collateralFactor);
    event AssetDelisted(address indexed token);
    event PriceOracleUpdated(address indexed newOracle);
    event InterestAccrued(address indexed token, uint256 borrowInterest, uint256 supplyInterest);

    // ============ Modifiers ============
    modifier onlyListedToken(address token) {
        require(assets[token].isListed, "Token not listed");
        _;
    }

    modifier nonZeroAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        _;
    }

    // ============ Constructor ============
    constructor(address _priceOracle, address _feeRecipient) {
        require(_priceOracle != address(0), "Invalid oracle address");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        priceOracle = IPriceOracle(_priceOracle);
        feeRecipient = _feeRecipient;
    }

    // ============ Admin Functions ============
    function listAsset(
        address token,
        uint256 collateralFactor,
        uint256 borrowFactor,
        uint256 reserveFactor
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!assets[token].isListed, "Asset already listed");
        require(collateralFactor <= COLLATERAL_FACTOR_BASE, "Invalid collateral factor");
        require(borrowFactor <= COLLATERAL_FACTOR_BASE, "Invalid borrow factor");
        require(reserveFactor <= COLLATERAL_FACTOR_BASE, "Invalid reserve factor");

        assets[token] = Asset({
            isListed: true,
            collateralFactor: collateralFactor,
            borrowFactor: borrowFactor,
            totalDeposits: 0,
            totalBorrows: 0,
            reserveFactor: reserveFactor,
            lastUpdateTime: block.timestamp,
            supplyRatePerSecond: 0,
            borrowRatePerSecond: 0,
            accrualBlockNumber: block.number
        });

        tokenList.push(token);
        allowedTokens[token] = true;

        emit AssetListed(token, collateralFactor);
    }

    function delistAsset(address token) external onlyOwner onlyListedToken(token) {
        assets[token].isListed = false;
        allowedTokens[token] = false;
        emit AssetDelisted(token);
    }

    function updatePriceOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        priceOracle = IPriceOracle(newOracle);
        emit PriceOracleUpdated(newOracle);
    }

    function updateCollateralFactor(address token, uint256 newFactor) external onlyOwner onlyListedToken(token) {
        require(newFactor <= COLLATERAL_FACTOR_BASE, "Invalid factor");
        assets[token].collateralFactor = newFactor;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawProtocolFees(address token) external onlyOwner onlyListedToken(token) {
        uint256 amount = totalProtocolFees;
        require(amount > 0, "No fees to withdraw");
        totalProtocolFees = 0;
        IERC20(token).safeTransfer(feeRecipient, amount);
    }

    // ============ Core Functions ============

    /**
     * @notice Deposit tokens as collateral
     * @param token The token to deposit
     * @param amount The amount to deposit
     */
    function deposit(address token, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyListedToken(token) 
        nonZeroAmount(amount) 
    {
        _accrueInterest(token);

        Asset storage asset = assets[token];
        UserAccount storage account = accounts[msg.sender];

        // Transfer tokens from user
        uint256 balanceBefore = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 balanceAfter = IERC20(token).balanceOf(address(this));
        uint256 actualAmount = balanceAfter - balanceBefore;

        // Update state
        account.deposits[token] = account.deposits[token].add(actualAmount);
        asset.totalDeposits = asset.totalDeposits.add(actualAmount);

        emit Deposit(msg.sender, token, actualAmount);
    }

    /**
     * @notice Withdraw deposited tokens
     * @param token The token to withdraw
     * @param amount The amount to withdraw
     */
    function withdraw(address token, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyListedToken(token) 
        nonZeroAmount(amount) 
    {
        _accrueInterest(token);

        Asset storage asset = assets[token];
        UserAccount storage account = accounts[msg.sender];

        require(account.deposits[token] >= amount, "Insufficient deposit balance");

        // Update state
        account.deposits[token] = account.deposits[token].sub(amount);
        asset.totalDeposits = asset.totalDeposits.sub(amount);

        // Check if withdrawal would make account undercollateralized
        require(_isAccountHealthy(msg.sender), "Withdrawal would make account unhealthy");

        // Transfer tokens to user
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, token, amount);
    }

    /**
     * @notice Borrow tokens against collateral
     * @param token The token to borrow
     * @param amount The amount to borrow
     */
    function borrow(address token, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyListedToken(token) 
        nonZeroAmount(amount) 
    {
        _accrueInterest(token);

        Asset storage asset = assets[token];
        UserAccount storage account = accounts[msg.sender];

        require(asset.totalDeposits >= asset.totalBorrows.add(amount), "Insufficient liquidity");

        // Update borrow state
        account.borrows[token] = account.borrows[token].add(amount);
        account.borrowIndex[token] = asset.totalBorrows;
        asset.totalBorrows = asset.totalBorrows.add(amount);

        // Check if account remains healthy
        require(_isAccountHealthy(msg.sender), "Borrow would make account unhealthy");

        // Transfer tokens to borrower
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Borrow(msg.sender, token, amount);
    }

    /**
     * @notice Repay borrowed tokens
     * @param token The token to repay
     * @param amount The amount to repay (use type(uint256).max for full repayment)
     */
    function repay(address token, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyListedToken(token) 
        nonZeroAmount(amount) 
    {
        _accrueInterest(token);

        Asset storage asset = assets[token];
        UserAccount storage account = accounts[msg.sender];

        uint256 borrowBalance = account.borrows[token];
        require(borrowBalance > 0, "No borrow balance");

        uint256 repayAmount = amount > borrowBalance ? borrowBalance : amount;

        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), repayAmount);

        // Update state
        account.borrows[token] = account.borrows[token].sub(repayAmount);
        asset.totalBorrows = asset.totalBorrows.sub(repayAmount);

        emit Repay(msg.sender, token, repayAmount);
    }

    /**
     * @notice Liquidate an undercollateralized borrower
     * @param borrower The borrower to liquidate
     * @param debtToken The token debt to repay
     * @param collateralToken The collateral token to seize
     * @param repayAmount The amount of debt to repay
     */
    function liquidate(
        address borrower,
        address debtToken,
        address collateralToken,
        uint256 repayAmount
    ) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyListedToken(debtToken) 
        onlyListedToken(collateralToken) 
        nonZeroAmount(repayAmount) 
    {
        require(borrower != msg.sender, "Cannot liquidate self");
        require(!_isAccountHealthy(borrower), "Borrower is healthy");

        _accrueInterest(debtToken);
        _accrueInterest(collateralToken);

        UserAccount storage borrowerAccount = accounts[borrower];
        Asset storage debtAsset = assets[debtToken];
        Asset storage collateralAsset = assets[collateralToken];

        uint256 borrowBalance = borrowerAccount.borrows[debtToken];
        require(borrowBalance > 0, "No borrow balance");

        // Cap repay amount to close factor
        uint256 maxRepay = borrowBalance.mul(CLOSE_FACTOR).div(COLLATERAL_FACTOR_BASE);
        uint256 actualRepay = repayAmount > maxRepay ? maxRepay : repayAmount;

        // Calculate collateral to seize (with liquidation incentive)
        (uint256 debtPrice, uint8 debtDecimals) = priceOracle.getPrice(debtToken);
        (uint256 collateralPrice, uint8 collateralDecimals) = priceOracle.getPrice(collateralToken);

        uint256 debtValue = actualRepay.mul(debtPrice).div(10**debtDecimals);
        uint256 seizeValue = debtValue.mul(LIQUIDATION_INCENTIVE).div(COLLATERAL_FACTOR_BASE);
        uint256 seizeTokens = seizeValue.mul(10**collateralDecimals).div(collateralPrice);

        require(borrowerAccount.deposits[collateralToken] >= seizeTokens, "Insufficient collateral");

        // Transfer debt token from liquidator
        IERC20(debtToken).safeTransferFrom(msg.sender, address(this), actualRepay);

        // Update states
        borrowerAccount.borrows[debtToken] = borrowerAccount.borrows[debtToken].sub(actualRepay);
        debtAsset.totalBorrows = debtAsset.totalBorrows.sub(actualRepay);

        borrowerAccount.deposits[collateralToken] = borrowerAccount.deposits[collateralToken].sub(seizeTokens);
        collateralAsset.totalDeposits = collateralAsset.totalDeposits.sub(seizeTokens);

        // Transfer seized collateral to liquidator
        IERC20(collateralToken).safeTransfer(msg.sender, seizeTokens);

        emit Liquidate(msg.sender, borrower, collateralToken, debtToken, actualRepay, seizeTokens);
    }

    // ============ Internal Functions ============

    function _accrueInterest(address token) internal {
        Asset storage asset = assets[token];
        uint256 currentTime = block.timestamp;
        uint256 timeDelta = currentTime - asset.lastUpdateTime;

        if (timeDelta == 0 || asset.totalBorrows == 0) {
            asset.lastUpdateTime = currentTime;
            return;
        }

        // Simple interest model: borrow rate = base rate + utilization * multiplier
        uint256 utilizationRate = asset.totalBorrows.mul(1e18).div(asset.totalDeposits);
        uint256 borrowRatePerYear = _calculateBorrowRate(utilizationRate);
        uint256 borrowRatePerSecond = borrowRatePerYear.div(SECONDS_PER_YEAR);

        uint256 interestAccumulated = asset.totalBorrows.mul(borrowRatePerSecond).mul(timeDelta).div(1e18);
        uint256 reserveInterest = interestAccumulated.mul(asset.reserveFactor).div(COLLATERAL_FACTOR_BASE);
        uint256 supplyInterest = interestAccumulated.sub(reserveInterest);

        asset.totalBorrows = asset.totalBorrows.add(interestAccumulated);
        asset.totalDeposits = asset.totalDeposits.add(supplyInterest);
        totalProtocolFees = totalProtocolFees.add(reserveInterest);

        asset.borrowRatePerSecond = borrowRatePerSecond;
        asset.supplyRatePerSecond = supplyInterest.mul(1e18).div(asset.totalDeposits).div(timeDelta);
        asset.lastUpdateTime = currentTime;

        emit InterestAccrued(token, interestAccumulated, supplyInterest);
    }

    function _calculateBorrowRate(uint256 utilizationRate) internal pure returns (uint256) {
        // Base rate: 2% APR, Multiplier: 20% APR at 100% utilization
        uint256 baseRate = 0.02e18; // 2%
        uint256 multiplier = 0.20e18; // 20%

        return baseRate.add(utilizationRate.mul(multiplier).div(1e18));
    }

    function _isAccountHealthy(address user) internal view returns (bool) {
        uint256 totalCollateralValue = 0;
        uint256 totalBorrowValue = 0;

        for (uint256 i = 0; i < tokenList.length; i++) {
            address token = tokenList[i];
            Asset storage asset = assets[token];
            UserAccount storage account = accounts[user];

            if (!asset.isListed) continue;

            // Calculate collateral value
            if (account.deposits[token] > 0) {
                (uint256 price, uint8 decimals) = priceOracle.getPrice(token);
                uint256 collateralValue = account.deposits[token].mul(price).div(10**decimals);
                totalCollateralValue = totalCollateralValue.add(
                    collateralValue.mul(asset.collateralFactor).div(COLLATERAL_FACTOR_BASE)
                );
            }

            // Calculate borrow value
            if (account.borrows[token] > 0) {
                (uint256 price, uint8 decimals) = priceOracle.getPrice(token);
                uint256 borrowValue = account.borrows[token].mul(price).div(10**decimals);
                totalBorrowValue = totalBorrowValue.add(borrowValue);
            }
        }

        return totalCollateralValue >= totalBorrowValue;
    }

    // ============ View Functions ============

    function getAccountHealth(address user) external view returns (uint256 collateralValue, uint256 borrowValue, bool isHealthy) {
        uint256 totalCollateralValue = 0;
        uint256 totalBorrowValue = 0;

        for (uint256 i = 0; i < tokenList.length; i++) {
            address token = tokenList[i];
            Asset storage asset = assets[token];
            UserAccount storage account = accounts[user];

            if (!asset.isListed) continue;

            if (account.deposits[token] > 0) {
                (uint256 price, uint8 decimals) = priceOracle.getPrice(token);
                uint256 value = account.deposits[token].mul(price).div(10**decimals);
                totalCollateralValue = totalCollateralValue.add(value);
            }

            if (account.borrows[token] > 0) {
                (uint256 price, uint8 decimals) = priceOracle.getPrice(token);
                uint256 value = account.borrows[token].mul(price).div(10**decimals);
                totalBorrowValue = totalBorrowValue.add(value);
            }
        }

        return (totalCollateralValue, totalBorrowValue, totalCollateralValue >= totalBorrowValue);
    }

    function getAccountDeposit(address user, address token) external view returns (uint256) {
        return accounts[user].deposits[token];
    }

    function getAccountBorrow(address user, address token) external view returns (uint256) {
        return accounts[user].borrows[token];
    }

    function getAssetInfo(address token) external view returns (Asset memory) {
        return assets[token];
    }

    function getTokenList() external view returns (address[] memory) {
        return tokenList;
    }

    function getMaxBorrowAmount(address user, address token) external view returns (uint256) {
        (uint256 collateralValue, uint256 borrowValue, ) = this.getAccountHealth(user);
        uint256 availableCollateral = collateralValue > borrowValue ? collateralValue - borrowValue : 0;

        (uint256 price, uint8 decimals) = priceOracle.getPrice(token);
        return availableCollateral.mul(10**decimals).div(price);
    }

    function getAccountLiquidity(address user) external view returns (uint256) {
        (uint256 collateralValue, uint256 borrowValue, ) = this.getAccountHealth(user);
        return collateralValue > borrowValue ? collateralValue - borrowValue : 0;
    }

    function getUtilizationRate(address token) external view returns (uint256) {
        Asset storage asset = assets[token];
        if (asset.totalDeposits == 0) return 0;
        return asset.totalBorrows.mul(1e18).div(asset.totalDeposits);
    }

    function getSupplyAPY(address token) external view returns (uint256) {
        Asset storage asset = assets[token];
        if (asset.totalDeposits == 0) return 0;
        uint256 utilization = this.getUtilizationRate(token);
        uint256 borrowRate = _calculateBorrowRate(utilization);
        return borrowRate.mul(utilization).div(1e18).mul(COLLATERAL_FACTOR_BASE.sub(asset.reserveFactor)).div(COLLATERAL_FACTOR_BASE);
    }

    function getBorrowAPY(address token) external view returns (uint256) {
        uint256 utilization = this.getUtilizationRate(token);
        return _calculateBorrowRate(utilization);
    }
}
