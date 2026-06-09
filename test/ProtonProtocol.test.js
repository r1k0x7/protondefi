const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProtonDeFi Protocol", function () {
  let protocol, priceOracle, protonToken;
  let weth, usdc, usdt, dai, wbtc;
  let owner, user1, user2, liquidator;

  beforeEach(async function () {
    [owner, user1, user2, liquidator] = await ethers.getSigners();

    // Deploy Price Oracle
    const MockPriceOracle = await ethers.getContractFactory("MockPriceOracle");
    priceOracle = await MockPriceOracle.deploy();

    // Deploy Proton Token
    const ProtonToken = await ethers.getContractFactory("ProtonToken");
    protonToken = await ProtonToken.deploy();

    // Deploy Protocol
    const ProtonProtocol = await ethers.getContractFactory("ProtonProtocol");
    protocol = await ProtonProtocol.deploy(priceOracle.address, owner.address);

    // Deploy Mock Tokens
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    weth = await MockERC20.deploy("Wrapped ETH", "WETH", 18);
    usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
    usdt = await MockERC20.deploy("Tether USD", "USDT", 6);
    dai = await MockERC20.deploy("Dai Stablecoin", "DAI", 18);
    wbtc = await MockERC20.deploy("Wrapped BTC", "WBTC", 8);

    // Set prices (USD with 8 decimals)
    await priceOracle.setPriceAndDecimals(weth.address, 350000000000, 18);  // $3500
    await priceOracle.setPriceAndDecimals(usdc.address, 100000000, 6);     // $1
    await priceOracle.setPriceAndDecimals(usdt.address, 100000000, 6);    // $1
    await priceOracle.setPriceAndDecimals(dai.address, 100000000, 18);     // $1
    await priceOracle.setPriceAndDecimals(wbtc.address, 6500000000000, 8); // $65000

    // List assets
    await protocol.listAsset(weth.address, 7500, 10000, 1000);
    await protocol.listAsset(usdc.address, 8000, 10000, 1000);
    await protocol.listAsset(usdt.address, 8000, 10000, 1000);
    await protocol.listAsset(dai.address, 8000, 10000, 1000);
    await protocol.listAsset(wbtc.address, 7500, 10000, 1000);
  });

  describe("Deposit", function () {
    it("Should allow users to deposit tokens", async function () {
      const depositAmount = ethers.utils.parseEther("10");
      await weth.transfer(user1.address, depositAmount);
      await weth.connect(user1).approve(protocol.address, depositAmount);

      await expect(protocol.connect(user1).deposit(weth.address, depositAmount))
        .to.emit(protocol, "Deposit")
        .withArgs(user1.address, weth.address, depositAmount);

      expect(await protocol.getAccountDeposit(user1.address, weth.address)).to.equal(depositAmount);
    });
  });

  describe("Borrow", function () {
    it("Should allow borrowing against collateral", async function () {
      // Deposit WETH
      const depositAmount = ethers.utils.parseEther("10"); // $35,000 worth
      await weth.transfer(user1.address, depositAmount);
      await weth.connect(user1).approve(protocol.address, depositAmount);
      await protocol.connect(user1).deposit(weth.address, depositAmount);

      // Borrow USDC
      const borrowAmount = ethers.utils.parseUnits("5000", 6); // $5,000
      await protocol.connect(user1).borrow(usdc.address, borrowAmount);

      expect(await protocol.getAccountBorrow(user1.address, usdc.address)).to.equal(borrowAmount);
    });

    it("Should not allow over-borrowing", async function () {
      const depositAmount = ethers.utils.parseEther("1"); // $3,500 worth
      await weth.transfer(user1.address, depositAmount);
      await weth.connect(user1).approve(protocol.address, depositAmount);
      await protocol.connect(user1).deposit(weth.address, depositAmount);

      // Try to borrow too much (more than collateral allows)
      const borrowAmount = ethers.utils.parseUnits("5000", 6);
      await expect(
        protocol.connect(user1).borrow(usdc.address, borrowAmount)
      ).to.be.revertedWith("Borrow would make account unhealthy");
    });
  });

  describe("Liquidation", function () {
    it("Should allow liquidation of unhealthy accounts", async function () {
      // User1 deposits WETH and borrows USDC
      const depositAmount = ethers.utils.parseEther("10");
      await weth.transfer(user1.address, depositAmount);
      await weth.connect(user1).approve(protocol.address, depositAmount);
      await protocol.connect(user1).deposit(weth.address, depositAmount);

      const borrowAmount = ethers.utils.parseUnits("20000", 6);
      await protocol.connect(user1).borrow(usdc.address, borrowAmount);

      // Drop WETH price to make account unhealthy
      await priceOracle.setPrice(weth.address, 200000000000); // $2000

      // Liquidator repays debt and seizes collateral
      const repayAmount = ethers.utils.parseUnits("5000", 6);
      await usdc.transfer(liquidator.address, repayAmount);
      await usdc.connect(liquidator).approve(protocol.address, repayAmount);

      await expect(
        protocol.connect(liquidator).liquidate(user1.address, usdc.address, weth.address, repayAmount)
      ).to.emit(protocol, "Liquidate");
    });
  });

  describe("Account Health", function () {
    it("Should correctly calculate account health", async function () {
      const depositAmount = ethers.utils.parseEther("10");
      await weth.transfer(user1.address, depositAmount);
      await weth.connect(user1).approve(protocol.address, depositAmount);
      await protocol.connect(user1).deposit(weth.address, depositAmount);

      const [collateral, borrow, isHealthy] = await protocol.getAccountHealth(user1.address);
      expect(collateral).to.equal(ethers.utils.parseEther("10").mul(3500));
      expect(borrow).to.equal(0);
      expect(isHealthy).to.be.true;
    });
  });
});
             
