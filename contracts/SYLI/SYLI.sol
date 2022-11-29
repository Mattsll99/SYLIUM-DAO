// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract SYLI is ERC20, ERC20Burnable, Ownable {
  /* ==================== STATE VARIABLES ==================== */
  address public governanceAddress; 
  mapping(address => bool) isVerifiedPool;
  /* ==================== MODIFIERS ==================== */
  modifier onlyByGovernance() {
    require(msg.sender == governanceAddress);
    _;
  }

  modifier onlyByPool() {
    require(isVerifiedPool[msg.sender] == true);
    _; 
  }

  modifier byPoolOrGovernance() {
    require(msg.sender == governanceAddress || isVerifiedPool[msg.sender] == true);
    _; 
  }

  
  /* ==================== CONSTRUCTOR ==================== */
  constructor(address _governanceAddress) ERC20("Syli stablecoin", "SYLI"){
    governanceAddress = _governanceAddress; 
  }
  /* ==================== VIEW ==================== */
  /* ==================== PUBLIC FUNCTIONS ==================== */
  /* ==================== RESTRICTED FUNCTION ==================== */
  // set Pool Allowance
  function setPoolAllowance(address _poolAddress) public onlyByGovernance {
    require(_poolAddress != address(0), "Non-valid address");
    require(isVerifiedPool[_poolAddress] == false, "The pool is already verified");
    isVerifiedPool[_poolAddress] = true; 
    emit poolAdded(_poolAddress);
  }
  // remove Pool Allowance 
  function removePoolAllowance(address _poolAddress) public onlyByGovernance {
    require(_poolAddress != address(0), "Non-valid address");
    require(isVerifiedPool[_poolAddress] == true, "Not a verified pool");
    isVerifiedPool[_poolAddress] = false;
    emit poolRemoved(_poolAddress);
  }

  function mintSyli(address _receiver, uint256 _amount) public byPoolOrGovernance {
    _mint(_receiver, _amount); 
    emit SYLIMinted(_receiver, _amount);
  }

  function burnSyli(address _from, uint256 _amount) public byPoolOrGovernance {
    burnFrom(_from, _amount);
    emit SYLIBurned(_from, _amount);
  }

  /* ==================== EVENTS ==================== */
  event SYLIMinted(address _receiver, uint256 _amount);
  event SYLIBurned(address _from, uint256 _amount);
  event poolAdded(address _poolAddress);
  event poolRemoved(address _poolAddress);
}