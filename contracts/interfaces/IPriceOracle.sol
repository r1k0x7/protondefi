// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IPriceOracle {
    function getPrice(address token) external view returns (uint256 price, uint8 decimals);
    function setPrice(address token, uint256 price) external;
}
