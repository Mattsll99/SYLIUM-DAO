// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "hardhat/console.sol";
import "../mockToken/IERC20.sol";
import "../SYLIUMPools/ISYLIUMPools.sol";
import "../oracle/Ioracle.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract poolRewards {
  /* ========================= STATE VARIABLES ========================= */
  address governanceAddress;
  address oracleAddress;
  address syliumPoolsAddress;

  ISYLIUMPools public SYLIUMPools;

  mapping(string => address) stablecoinAddress;
  mapping(string => bool) isListed;
  string[] stablecoinList;
  uint256 public constant MONTH = 86400;
  uint256 public constant PRECISION = 1e18;

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
  function rewardsFund() public returns (uint256) {
    //Loop through all the stablecoin addresses and add the amount*price to the total 
    uint256 totalFunds;
    for(uint i = 0; i < stablecoinList.length; i++) {
      uint256 balance = IERC20(stablecoinAddress[stablecoinList[i]]).balanceOf(address(this));
      totalFunds += SafeMath.mul(balance, Oracle.getRightPrice(stablecoinList[i]));
    }
    return totalFunds;
  }
  /* ========================= PUBLIC FUNCTIONS ========================= */
  function mockRewardsInSylixFromShares() public returns (uint256) {
    uint256 amountRewards = SYLIUMPools.availableRewardsFromMinting();
    uint256 amountSylix = SafeMath.div(SafeMath.mul(amountRewards, PRECISION), Oracle.getSylixPrice());
    return amountSylix;
  }

  function mockRewardInSylixFromBoost () public returns (uint256) {
    uint256 amountRewards = SYLIUMPools.availableRewardsFromBoost();
    uint256 amountSylix = SafeMath.div(SafeMath.mul(amountRewards, PRECISION), Oracle.getSylixPrice());
    return amountSylix;
  }

  function RewardsInSylixFromMinting(uint256 _amount) public {
    //Loop through the stablecoins held by the contract
    //Use the best swap strategy
  } //Called when a user claims his rewards

  function rewardsInSylixFromBoost(uint256 _amount) public {}

  /* ========================= RESTRICTED FUNCTIONS ========================= */
  function addStablecoinAddress(string memory _stablecoin, address _stablecoinAddress) public onlyByGovernance {
    require(isListed[_stablecoin] == false, "Stablecoin already listed");
    stablecoinAddress[_stablecoin] = _stablecoinAddress;
    stablecoinList.push(_stablecoin);
  }

  function linkSyliumPools(address _syliumPoolsAddress) public onlyByGovernance {
    syliumPoolsAddress = _syliumPoolsAddress;
    SYLIUMPools = ISYLIUMPools(syliumPoolsAddress);
  }
  /* ========================= EVENTS ========================= */
}