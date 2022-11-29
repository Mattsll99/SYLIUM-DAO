//SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "hardhat/console.sol";
import "./IAggregationRouterV4.sol"; 
import "./IAggregationExecutor.sol";

contract oneInchxSYLIUM {
  /* ========================= STATE VARIABLE ========================= */
  address routerV4Address; 

  IAggregationRouterV4 public ROUTER;
  /* ========================= MODIFIERS ========================= */
  /* ========================= CONSTRUCTOR ========================= */
  /* ========================= VIEWS ========================= */
  /* ========================= PUBLIC FUNCTIONS ========================= */
  function exchange(address _fromToken, address _toToken, uint256 _amount) public returns (bool) {}

  function sendToPool(address _poolAddress, address _fromToken, address _toToken, uint256 _amount) public returns (bool) {}
  /* ========================= RESTRICTED FUNCTIONS ========================= */
  /* ========================= EVENTS ========================= */
}