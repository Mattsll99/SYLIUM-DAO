// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract syLINK is ERC20, ERC20Burnable, Ownable {
  /* ====================== CONSTRUCTOR =============================== */
  constructor() ERC20("SyliumLINK", "syLINK") {
  }

  /* ====================== VIEWS ===================================== */
  
  /* ====================== PUBLIC & EXTERNAL FUNCTIONS ========================== */
  // Function to Mint SYLI
  function mint_syLINK(address receiver, uint256 amount) public {
    _mint(receiver, amount);
    emit minting(receiver, amount);
  }

  // Function to burn SYLI 
  function burn_syLINK(address burnedFrom, uint256 amount) public {
    burnFrom(burnedFrom, amount); 
    emit burningFrom(burnedFrom, amount);
  } 

  /* ====================== RESTRICTED FUNCTIONS ====================== */
  /* ====================== EVENTS ==================================== */
  // Minting event 
  event minting(address _receiver, uint256 _amount); 
  // Burning from event 
  event burningFrom(address _burnedFrom, uint256 _amount); 
}
