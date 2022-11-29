// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "hardhat/console.sol";
import "../oracle/Ioracle.sol";
import "../mockToken/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract emergencyPools {
  /* ========================= STATE VARIABLES ========================= */
  uint256 constant PRECISION = 1e18;
  address syliumPoolsAddress; 
  address poolStableAddress;
  address governanceAddress;
  string poolStable;
  address oracleAddress; 
  Ioracle public Oracle;
  /* ========================= MODIFIERS ========================= */
  modifier onlyByGovernance() {
    require(msg.sender == governanceAddress);
    _;
  }
  /* ========================= CONSTRUCTOR ========================= */
  constructor(address _governanceAddress, address _oracleAddress) {
    governanceAddress = _governanceAddress; 
    oracleAddress = _oracleAddress; 
    Oracle = Ioracle(oracleAddress);
  }
  /* ========================= VIEWS ========================= */
   function getReserve() public view returns (uint256) {
    return IERC20(poolStableAddress).balanceOf(address(this));
   }

    function getReserveValue() public returns (uint256) {
      return SafeMath.div(SafeMath.mul(getReserve(), Oracle.getRightPrice(poolStable)), PRECISION);
    }
  /* ========================= PUBLIC FUNCTIONS ========================= */
  /* ========================= RESTRICTED FUNCTIONS ========================= */
  function linkSyliumPools(address _syliumPoolsAddress, string memory _poolStable, address _poolStableAddress) public onlyByGovernance {
    require(_syliumPoolsAddress != address(0) && _poolStableAddress != address(0), "Non-valid address");
    syliumPoolsAddress = _syliumPoolsAddress; 
    poolStableAddress = _poolStableAddress; 
    poolStable = _poolStable;
  }
  /* ========================= EVENTS ========================= */
}