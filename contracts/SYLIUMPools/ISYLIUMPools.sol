// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 


interface ISYLIUMPools {
  function getVolatileReserve() external returns (uint256);
  function getStableReserve() external returns (uint256);
  function getReserve() external returns (uint256, uint256); 
  function getReserveValue() external returns (uint256, uint256, uint256); 
  function getTotalReserveValue() external returns (uint256);
  function getTotalStableReserveValue() external returns (uint256);
  function getInterRatio() external returns (uint256, uint256); 
  function getSafetyRatio() external returns (uint256);
  function getRegulator() external returns (uint256, uint256);
  function getEqualizer() external returns (uint256);
  function getAlgorithmicDesign() external returns (uint256);
  function getSyliInCollateral() external returns (uint256, uint256, uint256);
  function getSyliSupply() external view returns (uint256);
  function getSylixSupply() external view returns (uint256); 
  function getStSylixSupply() external view returns (uint256);
  function getVolatileVariation() external returns (uint256);
  function getStableVariation() external returns (uint256);
  function mintSYLI(uint256 _amount) external;
  function redeemSYLI(uint256 _amount) external;
  function setAlpha(uint256 _percentage) external;
  function getPoolShares() external returns (uint256);
  function sharesFromMinting() external view returns (uint256);
  function sharesFromBoost() external view returns (uint256);
  function totalShares() external view returns (uint256);
  function totalRewardsFromMinting() external returns (uint256);
  function totalRewardsFromSharesBoost() external returns (uint256);
  function totalRewards() external returns (uint256);
  function getEstimatedAPR() external returns (uint256);
  function availableRewardsFromMinting() external returns (uint256);
  function availableRewardsFromBoost() external returns (uint256);
  function totalAvailableRewards() external returns (uint256);
  function claimMintingRewards() external;
  function claimBoostRewards() external;
  function rewardsLocker() external view returns (uint256);
  function setMintingFees(uint256 _percentage) external;
  function setRedemptionFees(uint256 _percentage) external;
  function stopMinting() external;
  function stopRedemption() external;
}