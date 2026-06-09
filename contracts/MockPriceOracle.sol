// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IPriceOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockPriceOracle is IPriceOracle, Ownable {
    mapping(address => uint256) public prices;
    mapping(address => uint8) public tokenDecimals;

    event PriceUpdated(address indexed token, uint256 price);

    function getPrice(address token) external view override returns (uint256 price, uint8 decimals) {
        return (prices[token], tokenDecimals[token]);
    }

    function setPrice(address token, uint256 price) external override onlyOwner {
        prices[token] = price;
        emit PriceUpdated(token, price);
    }

    function setTokenDecimals(address token, uint8 decimals) external onlyOwner {
        tokenDecimals[token] = decimals;
    }

    function setPriceAndDecimals(address token, uint256 price, uint8 decimals) external onlyOwner {
        prices[token] = price;
        tokenDecimals[token] = decimals;
        emit PriceUpdated(token, price);
    }
}
