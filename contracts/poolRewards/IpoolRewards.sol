// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

interface IpoolRewards {
  function rewardsFund() external returns (uint256); 
  function mockRewardsInSylixFromMinting() external returns (uint256);
  function mockRewardsInSylixFromBoost() external returns (uint256);
  function getRewardsInSylix() external; 
  function addStablecoinAddress(string memory _stablecoin, address _stablecoinAddress) external;
}