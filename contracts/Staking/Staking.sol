//SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "../oracle/Ioracle.sol";
import "../SYLIX/ISYLIX.sol"; 
import "../stSYLIX/IstSYLIX.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Staking {
  using SafeMath for uint256;
  /* ========================= STATE VARIABLES ========================= */
  uint256 DURATION;
  uint256 NINETY_DAYS = 90 * 24 * 60 * 60;
  uint256 constant PRECISION = 1e18;
  uint256 totalProvidedFunds;

  address governanceAddress; 
  address oracleAddress;
  address sylixAddress; 
  mapping(address => uint256) starter;
  mapping(address => uint256) providedSYLIX;
  mapping(address => uint256) claimedRewards;

  ISYLIX public SYLIX;
  Ioracle public Oracle;

  /* ========================= MODIFIERS ========================= */
  modifier byGovernance() {
    require(msg.sender == governanceAddress); 
    _;
  }
  /* ========================= CONSTRUCTOR ========================= */
  constructor(address _governanceAddress, address _oracleAddress, address _sylixAddress) {
    governanceAddress = _governanceAddress; 
    oracleAddress = _oracleAddress; 
    sylixAddress = _sylixAddress;
    SYLIX = ISYLIX(sylixAddress);
    DURATION = NINETY_DAYS;
  }
  /* ========================= VIEWS ========================= */
  function rewardsFund() public view returns (uint256) {
    return SYLIX.balanceOf(address(this)) - getTotalProvidedFunds();
  }

  function getTimeElapsed() public view returns (uint256) {
    return block.timestamp - starter[msg.sender];
  }

  function getRemainingTime() public view returns (uint256) {
    return DURATION - getTimeElapsed();
  } //Remaining time before receiving 100% of rewards

  function getDivider() public view returns (uint256) {
    uint256 divider = SafeMath.div(SafeMath.mul(getTimeElapsed(), PRECISION), DURATION);
    return divider;
  }

  function getEstimatedAPR() public view returns (uint256) {
    uint256 APR = SafeMath.div(SafeMath.mul(rewardsFund(), PRECISION), getTotalProvidedFunds());
    return APR;
  }

  function getTotalProvidedFunds() public view returns (uint256) {
    return totalProvidedFunds;
  }

   function getTotalRewards() public  view returns (uint256) {
    return SafeMath.div(SafeMath.mul(getDivider(), rewardsFund()), PRECISION);
  }

  function totalRewardsInUSD() public view returns (uint256) {
    return SafeMath.div(SafeMath.mul(getTotalRewards(), Oracle.getSylixPrice()), PRECISION);
  }

   function claimableRewards() public view returns (uint256) {
    return SafeMath.div(SafeMath.mul(getDivider(), getTotalRewards()), PRECISION) - claimedRewards[msg.sender];
  }
  /* ========================= PUBLIC FUNCTIONS ========================= */
  function deposit(uint256 _amount) public {
    require(_amount > 0, "Insufficient amount"); 
    SYLIX.transferFrom(msg.sender, address(this), _amount);
    if(providedSYLIX[msg.sender] == 0) {
      starter[msg.sender] = block.timestamp;
    }
    providedSYLIX[msg.sender] = _amount;
    totalProvidedFunds += _amount;
    emit SYLIXDeposited(_amount);
  }

  function withdraw(uint256 _amount) public {
    require(providedSYLIX[msg.sender] != 0, "No claimable SYLIX"); 
    require(_amount <= providedSYLIX[msg.sender], "Insufficient provided funds"); 
    SYLIX.transfer(msg.sender, _amount);
    providedSYLIX[msg.sender] -= _amount; 
    if(providedSYLIX[msg.sender] == 0){
      delete starter[msg.sender];
    }
    totalProvidedFunds -= _amount;
    emit SYLIXWidthdrew(_amount);
  }

  function claimRewards() public {}//Send all the claimable rewards, incentive to reinvest rewards in the staking pool
 
  /* ========================= RESTRICTED FUNCTIONS ========================= */
  function setDuration(uint256 _duration) public byGovernance {
    DURATION = _duration;
    emit durationSet(_duration);
  }
  /* ========================= EVENTS ========================= */
  event SYLIXWidthdrew(uint256 _amount); 
  event SYLIXDeposited(uint256 _amount);
  event rewardsClaimed(uint256 _amount);
  event durationSet(uint256 _time);
}