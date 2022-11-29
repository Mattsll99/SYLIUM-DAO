// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

interface IpoolFactory {
  function getPairBalance(address _pairAddress) external returns (uint256);
  function getPairVolatileBalance(address _pairAddress) external returns (uint256);
  function getPairStableBalance(address _pairAddress) external returns (uint256);
  function getPairTotalRatio(address _pairAddress) external returns (uint256);
  function getPairVolatileRatio(address _pairAddress) external returns (uint256);
  function getPairStableRatio(address _pairAddress) external returns (uint256);
  function getSyliSupply() external view returns (uint256); 
  function getSyliSupplyFrom(address _pairAddress) external returns (uint256);
  function setAlpha() external returns (uint256);
  function addVolatileToken(string memory _volatile, address _volatileAddress) external;
  function removeVolatileToken(string memory _volatile, address _volatileAddress) external;
  function addStableToken(string memory _stable, address _stableAddress) external;
  function removeStableToken(string memory _stable, address _stableAddress) external;
  function addPair(string memory _volatile, string memory _stable, address _pairAddress) external;
  function removePair(string memory _volatile, string memory _stable, address _pairAddress) external;
  function setMaxPercentage(uint256 _maxPercentage) external returns (uint256);
  function emergencyManagement(address _pairAddress) external;
}