//SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "hardhat/console.sol";
import "../SYLIUMPools/ISYLIUMPools.sol";
import "../poolFactory/IpoolFactory.sol";
import "../oracle/Ioracle.sol";
import "../SYLIX/ISYLIX.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract emergencyPoolsFactory {
  using SafeMath for uint256;
  /* ========================= STATE VARIABLES ======================== */
  uint256 constant PRECISION = 1e18;
  uint256 DAY_STARTER;
  uint256 constant DAY = 24 * 60 * 60;
  uint256 WEEK_STARTER; 
  uint256 constant WEEK = 7 * DAY;
  uint256 SUPPLY_STARTER;
  uint256 genesisSYLIXSupply;
  uint256 UPPER_SAFETY = 200000000000000000;
  //uint256 genesisTotalSupply;

  address governanceAddress;
  address oracleAddress; 
  address sylixBurnerAddress;
  address sylixAddress; 
  address[] poolsList;

  bool poolsSecured;
  bool excessFundsSending;

  IpoolFactory public poolFactory;
  Ioracle public Oracle;
  ISYLIX public SYLIX;

  mapping(address => mapping(address => mapping(address => bool))) isTripletListed;
  mapping(address => address) emergencyPool; 
  mapping(address => mapping(address => address)) stablecoin;
  /* ========================= MODIFIERS ======================== */
  modifier byGovernance() {
    require(msg.sender == governanceAddress); 
    _;
  }
  /* ========================= CONSTRUCTOR ======================== */
  constructor(address _governanceAddress, address _oracleAddress, address _sylixAddress) {
    governanceAddress = _governanceAddress; 
    oracleAddress = _oracleAddress;
    sylixAddress = _sylixAddress; 
    Oracle = Ioracle(oracleAddress);
    SYLIX = ISYLIX(sylixAddress);
    genesisSYLIXSupply = 0;
    excessFundsSending = false;
  }
  /* ========================= VIEWS ======================== */

  function getDailySupplyFrom(address _poolAddress) public view returns (uint256) {
    return ISYLIUMPools(_poolAddress).getSyliSupply();
  }

  function getTotalStableReserveFrom(address _poolAddress) public returns (uint256) {
    return ISYLIUMPools(_poolAddress).getTotalStableReserveValue();
  }

  function getGlobalStableReserve() public returns (uint256) {
    uint256 globalReserve;
    for(uint i = 0; i < poolsList.length; i++) {
      globalReserve += getTotalStableReserveFrom(poolsList[i]);
    }
    return globalReserve;
  }


  function getTotalDailySupply() public view returns (uint256) {
    uint256 totalDailySupply;
    for(uint i = 0; i < poolsList.length; i++) {
      totalDailySupply += getDailySupplyFrom(poolsList[i]);
    }
    return totalDailySupply;
  }

  function getSYLIXPrice() public view returns (uint256) {
    return Oracle.getSylixPrice();
  }

  function getSYLIXSupplyFrom(address _poolAddress) public view returns (uint256) {
    return ISYLIUMPools(_poolAddress).getStSylixSupply();
  }

  function getTotalSYLIXSupply() public view returns (uint256) {
    uint256 totalSYLIXSupply;
    for(uint i = 0; i < poolsList.length; i++) {
      totalSYLIXSupply += getSYLIXSupplyFrom(poolsList[i]);
    }
    return totalSYLIXSupply;
  }

  /* ========================= PUBLIC FUNCTIONS ======================== */
    function getSYLIXSupplyVariation() public returns (bool, uint256) {
    bool isDeflationary;
    uint256 difference;
    if(block.timestamp - SUPPLY_STARTER >= DAY) {
      uint256 currentSYLIXSupply = getTotalSYLIXSupply();
      if(currentSYLIXSupply < genesisSYLIXSupply) {
        isDeflationary = true; 
        difference = genesisSYLIXSupply - currentSYLIXSupply;
      } else {
        isDeflationary = false;
        difference = currentSYLIXSupply - genesisSYLIXSupply;
      }
      genesisSYLIXSupply = getTotalSYLIXSupply();
    }
    return (isDeflationary, difference);
  }

  function arePoolsSecured() public returns (bool) {
    poolsSecured = true;
    for(uint i = 0; i < poolsList.length; i++) {
      if(getDailySupplyFrom(poolsList[i]) > getTotalStableReserveFrom(poolsList[i])) {
        poolsSecured = false;
      }
    }
    return poolsSecured;
  }

  function poolFunding(address _poolAddress, uint256 _amountSylixSwapped) public {} //Act as a swap funding for each pool with the right stablecoin
  //Then in roundFunging() only loop through the pools list and execute this function with the right amount for needy pools

  function firstStepFunding() public { //Execute this function every 24 hours
    uint256 amountInUSD;
    uint256 totalSupply = getTotalDailySupply();
    uint256 globalReserve = getGlobalStableReserve();
    if(totalSupply > globalReserve) {
      amountInUSD = totalSupply - globalReserve;
      uint256 availableSYLIX = SYLIX.balanceOf(address(this));
      uint256 availableSYLIXInUSD = SafeMath.div(SafeMath.mul(SYLIX.balanceOf(address(this)), getSYLIXPrice()), PRECISION);
      if(availableSYLIXInUSD > amountInUSD) {
        for(uint i = 0; i < poolsList.length; i++) {
          if(getTotalStableReserveFrom(poolsList[i]) < getDailySupplyFrom(poolsList[i])) {
            uint256 amountSYLIXNeeded = SafeMath.div(SafeMath.mul(getDailySupplyFrom(poolsList[i]) - getTotalStableReserveFrom(poolsList[i]), PRECISION), getSYLIXPrice());
            poolFunding(poolsList[i], amountSYLIXNeeded);
          }
        }
      }
      else {
        for(uint i = 0; i < poolsList.length; i++) {
          if(getTotalStableReserveFrom(poolsList[i]) < getDailySupplyFrom(poolsList[i])) {
            uint256 ratio = SafeMath.div(SafeMath.mul(getDailySupplyFrom(poolsList[i]) - getTotalStableReserveFrom(poolsList[i]), PRECISION), amountInUSD);
            uint256 allocatedSYLIX = SafeMath.div(SafeMath.mul(ratio, availableSYLIX), PRECISION);
            poolFunding(poolsList[i], allocatedSYLIX);
          }
        }
      }
    }
  } //Loop through the pool and poolFunding() according to reserveRatio (every 24hours)

  function secondStepFunding() public { //Execute this function every 24 hours
    (bool isDeflationary, uint256 difference) = getSYLIXSupplyVariation();
    if(poolsSecured == true && isDeflationary == true) {
      uint256 numSYLIX = SafeMath.div(difference, poolsList.length -1);
      for(uint i = 0; i < poolsList.length; i++) {
        if(ISYLIUMPools(poolsList[i]).getSafetyRatio() < UPPER_SAFETY) {
          poolFunding(poolsList[i], numSYLIX);
        }
      }
      excessFundsSending = true;
    }
  }

  function sendExcessFunds() public {
    if(excessFundsSending == true && SYLIX.balanceOf(address(this)) > 0) {
      SYLIX.transfer(sylixBurnerAddress, SYLIX.balanceOf(address(this)));
      excessFundsSending = false;
    }
  }



  /* ========================= RESTRICTED FUNCTIONS ======================== */
  function addTriplet(address _poolAddress, address _emergencyPoolAddress, address _stableAddress) public byGovernance {
    require(_poolAddress != address(0) && _emergencyPoolAddress != address(0) && _stableAddress != address(0), "Invalid address");
    require(isTripletListed[_poolAddress][_emergencyPoolAddress][_stableAddress] == false, "Triplet already listed");
    poolsList.push(_poolAddress);
    isTripletListed[_poolAddress][_emergencyPoolAddress][_stableAddress] = true;
    emergencyPool[_poolAddress] = _emergencyPoolAddress; 
    stablecoin[_poolAddress][_emergencyPoolAddress] = _stableAddress;
  }

  function removeTriplet(address _poolAddress, address _emergencyPoolAddress, address _stableAddress) public byGovernance {
    require(isTripletListed[_poolAddress][_emergencyPoolAddress][_stableAddress] == true, "Triplet not listed");
    isTripletListed[_poolAddress][_emergencyPoolAddress][_stableAddress] = false;
    for(uint i = 0; i < poolsList.length; i++) {
      if(poolsList[i] == _poolAddress) {
        poolsList[i] = address(0); 
        break;
      }
    }
    delete emergencyPool[_poolAddress];
    delete stablecoin[_poolAddress][_emergencyPoolAddress];
  }
  /* ========================= EVENTS ======================== */
}

//Tous les fonds servent à alimenter les réserves
//Funding toutes les 24h???
