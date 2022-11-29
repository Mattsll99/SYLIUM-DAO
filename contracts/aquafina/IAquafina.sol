// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

interface IAquafina {
  function getVariation(string memory _name) external returns (uint256);
  function mockVariation(string memory _name) external returns (uint256);
  function setTokenStarter(string memory _name) external;
}