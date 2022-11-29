// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

interface Ioracle {
  function getLatestPrice() external view returns (int256);
  function getDecimals() external view returns (uint8);
  function getRightPrice(string memory _name) external returns (uint256);
  function getSylixPrice() external view returns (uint256);
  function addPriceFeed(string memory _name, address _addressFeed) external; 
  function removePriceFeed(string memory _name) external; 
}