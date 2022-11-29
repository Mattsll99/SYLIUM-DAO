// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

interface IemergencyPools {
  function getReserve() external view returns (uint256); 
  function getReserveValue() external view returns (uint256); 
}