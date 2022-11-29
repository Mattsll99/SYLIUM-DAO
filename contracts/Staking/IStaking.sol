//SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

interface IStaking {
  function rewardsFund() external view returns (uint256); 
  function getTimeElapsed() external view returns (uint256);
  function getRemainingTime() external view returns (uint256);
  function getDivider() external view returns (uint256);
  function getEstimatedAPR() external view returns (uint256);
  function getTotalProvidedFunds() external view returns (uint256);
  function getTotalRewards() external view returns (uint256);
  function totalRewardsInUSD() external view returns (uint256);
  function claimableRewards() external view returns (uint256);
  function deposit(uint256 _amount) external;
  function withdraw(uint256 _amount) external;
  function claimRewards() external;
  function setDuration(uint256 _duration) external;

  event SYLIXWidthdrew(uint256 _amount); 
  event SYLIXDeposited(uint256 _amount);
  event rewardsClaimed(uint256 _amount);
  event durationSet(uint256 _time);
}