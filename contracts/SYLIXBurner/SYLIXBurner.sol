//SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "../SYLIX/ISYLIX.sol";

contract SYLIXBurner {
  /* ========================= STATE VARIABLES ========================= */
  address sylixAddress;
  ISYLIX public SYLIX;
  uint256 MONTH = 30 * 24 * 60 * 60;
  uint256 STARTER;
  /* ========================= MODIFIERS ========================= */
  /* ========================= CONSTRUCTOR ========================= */
  constructor(address _sylixAddress) {
    sylixAddress = _sylixAddress;
    SYLIX = ISYLIX(sylixAddress);
  }
  /* ========================= VIEWS ========================= */
  /* ========================= PUBLIC FUNCTIONS ========================= */
  function burnExcessFunds() public {
    uint256 excessFunds;
    if(block.timestamp - STARTER >= MONTH) {
      excessFunds = SYLIX.balanceOf(address(this)); 
      if(excessFunds > 0) {
        SYLIX.burnSylix(address(this), excessFunds);
      }
    }
    emit excessFundsBurned(excessFunds);
  }
  /* ========================= EVENTS ========================= */
  event excessFundsBurned(uint256 _amount);
}