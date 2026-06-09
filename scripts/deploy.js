const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Mock Price Oracle
  const MockPriceOracle = await ethers.getContractFactory("MockPriceOracle");
  const priceOracle = await MockPriceOracle.deploy();
  await priceOracle.deployed();
  console.log("MockPriceOracle deployed to:", priceOracle.address);

  // Deploy Proton Token
  const ProtonToken = await ethers.getContractFactory("ProtonToken");
  const protonToken = await ProtonToken.deploy();
  await protonToken.deployed();
  console.log("ProtonToken deployed to:", protonToken.address);

  // Deploy Proton Protocol
  const ProtonProtocol = await ethers.getContractFactory("ProtonProtocol");
  const protocol = await ProtonProtocol.deploy(priceOracle.address, deployer.address);
  await protocol.deployed();
  console.log("ProtonProtocol deployed to:", protocol.address);

  // Deploy Mock Tokens
  const tokens = [
    { name: "Wrapped ETH", symbol: "WETH", decimals: 18 },
    { name: "USD Coin", symbol: "USDC", decimals: 6 },
    { name: "Tether USD", symbol: "USDT", decimals: 6 },
    { name: "Dai Stablecoin", symbol: "DAI", decimals: 18 },
    { name: "Wrapped BTC", symbol: "WBTC", decimals: 8 },
  ];

  const deployedTokens = [];
  for (const token of tokens) {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy(token.name, token.symbol, token.decimals);
    await mockToken.deployed();
    deployedTokens.push({ ...token, address: mockToken.address, contract: mockToken });
    console.log(`${token.symbol} deployed to:`, mockToken.address);
  }

  // Set prices (in USD with 8 decimals)
  const prices = {
    [deployedTokens.find(t => t.symbol === "WETH").address]: 350000000000,  // $3500
    [deployedTokens.find(t => t.symbol === "USDC").address]: 100000000,       // $1
    [deployedTokens.find(t => t.symbol === "USDT").address]: 100000000,       // $1
    [deployedTokens.find(t => t.symbol === "DAI").address]: 100000000,       // $1
    [deployedTokens.find(t => t.symbol === "WBTC").address]: 6500000000000, // $65000
    [protonToken.address]: 50000000,                                          // $0.50
  };

  for (const [token, price] of Object.entries(prices)) {
    const decimals = deployedTokens.find(t => t.address === token)?.decimals || 18;
    await priceOracle.setPriceAndDecimals(token, price, decimals);
    console.log(`Set price for ${token}: $${price / 10**8}`);
  }

  // List assets in protocol
  for (const token of deployedTokens) {
    const collateralFactor = token.symbol === "USDC" || token.symbol === "USDT" || token.symbol === "DAI" 
      ? 8000  // 80% for stablecoins
      : 7500; // 75% for volatile assets

    await protocol.listAsset(
      token.address,
      collateralFactor,
      10000, // borrow factor 100%
      1000   // 10% reserve factor
    );
    console.log(`Listed ${token.symbol} with collateral factor ${collateralFactor/100}%`);
  }

  // List PROTON token
  await protocol.listAsset(protonToken.address, 5000, 10000, 1000);
  console.log("Listed PROTON with collateral factor 50%");

  console.log("\nðŸš€ Deployment complete!");
  console.log("\nContract Addresses:");
  console.log("  Price Oracle:", priceOracle.address);
  console.log("  Proton Token:", protonToken.address);
  console.log("  Protocol:", protocol.address);
  deployedTokens.forEach(t => console.log(`  ${t.symbol}:`, t.address));

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    priceOracle: priceOracle.address,
    protonToken: protonToken.address,
    protocol: protocol.address,
    tokens: deployedTokens.map(t => ({
      symbol: t.symbol,
      name: t.name,
      address: t.address,
      decimals: t.decimals,
    })),
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    `deployments-${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
                         
