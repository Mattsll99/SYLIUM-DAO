// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "hardhat/console.sol"; 
import "../mockToken/IERC20.sol";
import "../oracle/Ioracle.sol";
import "../aquafina/IAquafina.sol";
import "../SYLI/ISYLI.sol";
import "../SYLIX/ISYLIX.sol";
import "../stSYLIX/IstSYLIX.sol";
import "../poolFactory/IpoolFactory.sol";
import "../poolRewards/IpoolRewards.sol";
import "../emergencyPools/IemergencyPools.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract SYLIUMPools {
  /* ========================= STATE VARIABLES ======================== */
  address governanceAddress; 
  address controllerAddress;
  address volatileAddress; 
  address stableAddress; 
  address oracleAddress; 
  address aquafinaAddress; 
  address poolFactoryAddress;
  address syliAddress; 
  address sylixAddress; 
  address poolRewardsAddress;
  address emergencyPoolsAddress;

  string volatile;
  string stable;
 
  IpoolFactory public poolFactory;
  Ioracle public Oracle; 
  IAquafina public Aquafina; 
  ISYLI public SYLI;
  ISYLIX public SYLIX;
  IpoolRewards public poolRewards;
  IemergencyPools public emergencyPools;
  
  mapping(string => address) tokenAddress; 

  uint256 public constant mathPRECISION = 1e20;
  uint256 public constant algoPRECISION = 1e20;
  uint256 public constant PRECISION = 1e18;
  uint256 public constant BETA_PRECISION = 1e21;
  uint256 public beta;
  uint256 public alpha;
  uint256 public constant YEAR = 365;
  uint256 public constant MONTH = 86400;

  uint256 public mintingFees;
  uint256 public redemptionFees; 
  uint256 public constant feesPrecision = 1e18;
  mapping(address => uint256) stSYLIXTracker;

  uint256 SYLISupply;
  uint256 SYLIXSupply; 
  uint256 stSYLIXSupply;
  uint256 circulatingBoosts;

  //Variation related
  uint256 volatileStarter; 
  uint256 stableStarter;
  uint256 genesisVolatilePrice;

  //Stopper 
  bool mintingOn; 
  bool redemptionOn;
  //Pool shares related
  mapping(address => uint256) poolShares;
  mapping(address => uint256) SYLIMinted;
  mapping(address => uint256) providedFunds;
  mapping(address => uint256) lockTime;
  mapping(address => uint256) lockStarter;
  mapping(address => uint256) shareBoost;
  //Reserves filling related
  uint256 fillAmount;
  uint256 genesisAmount;
  uint256 amountGiven;
  bool isFillingOpen;
  uint256 maxRate; 
  uint256 minRate;

  // USE THE EMERGENCY INTERFACE TO BUILD EMERGENCY FUNCTIONS
  // EX: IN CASE THE PROTOCOL HAS TO REFUND THE USERS
  

  /* ========================= MODIFIERS ======================== */
  modifier onlyByGovernance() {
    require(msg.sender == governanceAddress);
    _;
  }
  /* ========================= CONSTRUCTOR ======================== */
  constructor
  (address _governanceAddress, string memory _volatile, address _volatileAddress, string memory _stable, address _stableAddress, address _oracleAddress, address _aquafinaAddress, address _poolFactoryAddress, address _syliAddress, address _sylixAddress) {
    governanceAddress = _governanceAddress;
    volatile = _volatile; 
    stable = _stable;
    volatileAddress = _volatileAddress; 
    stableAddress = _stableAddress; 
    oracleAddress = _oracleAddress; 
    aquafinaAddress = _aquafinaAddress; 
    poolFactoryAddress = _poolFactoryAddress;
    syliAddress = _syliAddress; 
    sylixAddress = _sylixAddress; 
    Oracle = Ioracle(oracleAddress); 
    Aquafina = IAquafina(aquafinaAddress);
    poolFactory = IpoolFactory(poolFactoryAddress);
    SYLI = ISYLI(syliAddress);
    SYLIX = ISYLIX(sylixAddress);
    tokenAddress[volatile] = volatileAddress;
    tokenAddress[stable] = stableAddress;
    genesisVolatilePrice = Oracle.getRightPrice(volatile);
    poolFactory.addVolatileToken(volatile, volatileAddress);
    poolFactory.addStableToken(stable, stableAddress);
    poolFactory.addPair(volatile, stable, address(this));
    mintingOn = true; 
    redemptionOn = true;
    isFillingOpen = false;
  }
  /* ========================= VIEW ======================== */
  // Get reserves
  function getReserve() public view returns (uint256, uint256){
    uint256 volatileReserve = IERC20(volatileAddress).balanceOf(address(this));
    uint256 stableReserve = IERC20(stableAddress).balanceOf(address(this));
    return(volatileReserve, stableReserve);
  }

  function getReserveValue() public returns (uint256, uint256, uint256) {
    uint256 volatileReserve = SafeMath.div(SafeMath.mul(IERC20(volatileAddress).balanceOf(address(this)), Oracle.getRightPrice(volatile)), PRECISION);
    uint256 stableReserve = SafeMath.div(SafeMath.mul(IERC20(stableAddress).balanceOf(address(this)), Oracle.getRightPrice(stable)), PRECISION);
    uint256 totalReserve = volatileReserve + stableReserve;
    return (volatileReserve, stableReserve, totalReserve);
  }

  function getTotalReserveValue() public returns (uint256) {
    (,,uint256 poolReserve) = getReserveValue();
    return poolReserve + emergencyPools.getReserveValue();
  }

  function getTotalStableReserveValue() public returns (uint256) {
    (,uint256 fromPool,) = getReserveValue();
    return fromPool + emergencyPools.getReserveValue();
  }

  // Get Stable/Volatile ratio
  function getInterRatio() public returns (uint256, uint256) {
    (uint256 volatileReserve, uint256 stableReserve,) = getReserveValue();
    uint256 volatileRatio = SafeMath.div(SafeMath.mul(volatileReserve, PRECISION), volatileReserve + stableReserve);
    uint256 stableRatio = SafeMath.div(SafeMath.mul(stableReserve, PRECISION), volatileReserve + stableReserve);
    return (volatileRatio, stableRatio);
  }

  function getSafetyRatio() public returns (uint256) {
    uint256 safetyRatio;
    uint256 _SYLISupply = getSyliSupply();
    uint256 totalStable = IERC20(stableAddress).balanceOf(address(this)) + IERC20(stableAddress).balanceOf(emergencyPoolsAddress);
    uint256 balanceInUSD = SafeMath.div(SafeMath.mul(totalStable, Oracle.getRightPrice(stable)), PRECISION);
    if(balanceInUSD > _SYLISupply) {
      safetyRatio = SafeMath.div(SafeMath.mul(balanceInUSD - _SYLISupply, PRECISION), balanceInUSD);
    } else {
      safetyRatio = 0;
    }
    return safetyRatio;
  }
  // Get Regulator
  function getRegulator() public returns (uint256, uint256) {
    uint256 variation = Aquafina.mockVariation(volatile);
    uint256 regulator; 
    if(variation <= 1e3) {
      regulator = 1e3;
    } else {
      regulator = variation; 
    }
    return (variation, regulator);
  }

  /* ///////////////////////////////////////////////////////// */
  /* ///////////////////////////////////////////////////////// */
                    /* MINTING RELATED */
  /* ///////////////////////////////////////////////////////// */
  /* ///////////////////////////////////////////////////////// */

  // Get Equalizer
  function getMintingEqualizer() public returns (uint256) {
    uint256 equalizer;
    (uint256 volVariation, uint256 volRegulator) = getRegulator(); 
    uint256 safetyRatio = getSafetyRatio();
    beta = 1e3 - SafeMath.div(SafeMath.mul((volRegulator-volVariation), safetyRatio), PRECISION);
    equalizer = SafeMath.div(SafeMath.mul(PRECISION - alpha, mathPRECISION), (volRegulator - volVariation) * safetyRatio + beta * PRECISION);
    return equalizer;
  }

  function getMintingAlgorithmicDesign() public returns (uint256, uint256, uint256) {
    uint256 volatileAmount;
    uint256 stableAmount;
    uint256 sylixAmount;
    uint256 equalizer = getMintingEqualizer();
    (uint256 volVariation, uint256 volRegulator) = getRegulator();
    uint256 safetyRatio = getSafetyRatio();
    volatileAmount = SafeMath.div((equalizer * (volRegulator - volVariation) * safetyRatio), algoPRECISION);
    stableAmount = SafeMath.div((equalizer * beta * PRECISION), algoPRECISION);
    sylixAmount = poolFactory.setAlpha();
    return (volatileAmount, stableAmount, sylixAmount);
  }

  function getSyliInCollateralForMinting() public returns (uint256, uint256, uint256) {
    (uint256 _volatileAmount, uint256 _stableAmount, uint256 _sylixAmount) = getMintingAlgorithmicDesign();
    uint256 numVolatile = SafeMath.div(SafeMath.mul(_volatileAmount, PRECISION), Oracle.getRightPrice(volatile)); 
    uint256 numStable = SafeMath.div(SafeMath.mul(_stableAmount, PRECISION), Oracle.getRightPrice(stable));
    uint256 numSylix = SafeMath.div(SafeMath.mul(_sylixAmount, PRECISION), Oracle.getSylixPrice());
    return (numVolatile, numStable, numSylix);
  }

  /* ///////////////////////////////////////////////////////// */
  /* ///////////////////////////////////////////////////////// */
                    /* REDEMPTION RELATED */
  /* ///////////////////////////////////////////////////////// */
  /* ///////////////////////////////////////////////////////// */

  function getRedemptionEqualizer() public returns (uint256) {
    uint256 equalizer; 
    (uint256 volatileRatio, uint256 stableRatio) = getInterRatio();
    equalizer = SafeMath.div(SafeMath.mul(PRECISION - alpha, mathPRECISION), volatileRatio + stableRatio);
    return equalizer;
  }

  function getRedemptionAlgorithmicDesign() public returns (uint256, uint256, uint256) {
    uint256 volatileAmount; 
    uint256 stableAmount; 
    uint256 sylixAmount;
    uint256 equalizer = getRedemptionEqualizer();
    (uint256 volatileRatio, uint256 stableRatio) = getInterRatio();
    volatileAmount = SafeMath.div(SafeMath.mul(equalizer, volatileRatio), PRECISION);
    stableAmount = SafeMath.div(SafeMath.mul(equalizer, stableRatio), PRECISION);
    sylixAmount = poolFactory.setAlpha();
    return (volatileAmount, stableAmount, sylixAmount);
  }

  function getSyliInCollateralForRedemption() public returns (uint256, uint256, uint256) {}

  function getSyliSupply() public view returns (uint256) {
    return SYLISupply;
  }

  function getSylixSupply() public view returns (uint256) {
    return SYLIXSupply;
  }

  function getSyliAndBoostSupply() public view returns (uint256) {
    return SYLISupply + circulatingBoosts;
  }

  function getBoostSupply() public view returns (uint256) {
    return circulatingBoosts;
  }

  function getVolatileVariation() public returns (uint256) {
    return Aquafina.getVariation(volatile);
  }

  function getStableVariation() public returns (uint256) {
    return Aquafina.getVariation(stable);
  }

  function mintSYLI(uint256 _amount) public {
    require(isFillingOpen == false, "Provide some stablecoins instead");
    require(mintingOn == true, "Minting is not available");
    (uint256 _volatileAmount, uint256 _stableAmount, uint256 _sylixAmount) = getSyliInCollateralForMinting();
    uint256 governanceFees = SafeMath.div(SafeMath.mul(_amount, mintingFees), feesPrecision);
    IERC20(volatileAddress).transferFrom(msg.sender, governanceAddress, SafeMath.div(SafeMath.mul(governanceFees, _volatileAmount), PRECISION));
    IERC20(stableAddress).transferFrom(msg.sender, governanceAddress, SafeMath.div(SafeMath.mul(governanceFees, _stableAmount), PRECISION));
    IERC20(volatileAddress).transferFrom(msg.sender, address(this), SafeMath.div(SafeMath.mul(_amount - governanceFees, _volatileAmount), PRECISION));
    IERC20(stableAddress).transferFrom(msg.sender, address(this), SafeMath.div(SafeMath.mul(_amount - governanceFees, _stableAmount), PRECISION));
    SYLIX.burnSylix(msg.sender, SafeMath.div(SafeMath.mul(_amount, _sylixAmount), PRECISION));
    SYLI.mintSyli(msg.sender, _amount - governanceFees);
    SYLIMinted[msg.sender] += _amount - governanceFees;
    SYLISupply += _amount - governanceFees;
    SYLIXSupply -= SafeMath.div(SafeMath.mul(_amount, _sylixAmount), PRECISION);
    lockStarter[msg.sender] = block.timestamp;
  }

  function redeemSYLI(uint256 _amount) public {
    require(redemptionOn == true, "Redemption is not available");
    (uint256 _volatileAmount, uint256 _stableAmount, uint256 _sylixAmount) = getSyliInCollateralForRedemption();
    uint256 governanceFees = SafeMath.div(SafeMath.mul(_amount, redemptionFees), feesPrecision);
    SYLI.burnSyli(msg.sender, _amount);
    IERC20(volatileAddress).transfer(governanceAddress, SafeMath.div(SafeMath.mul(governanceFees, _volatileAmount), PRECISION));
    IERC20(stableAddress).transfer(governanceAddress, SafeMath.div(SafeMath.mul(governanceFees, _stableAmount), PRECISION));
    IERC20(volatileAddress).transfer(msg.sender, SafeMath.div(SafeMath.mul(_amount - governanceFees, _volatileAmount), PRECISION));
    IERC20(stableAddress).transfer(msg.sender, SafeMath.div(SafeMath.mul(_amount - governanceFees, _stableAmount), PRECISION));
    SYLIX.mintSylix(msg.sender, SafeMath.div(SafeMath.mul(_amount - governanceFees, _sylixAmount), PRECISION));
    SYLIMinted[msg.sender] -= _amount;
    SYLISupply -= _amount;
    SYLIXSupply += SafeMath.div(SafeMath.mul(_amount - governanceFees, _sylixAmount), PRECISION);
  }

  function getSupplyVariation() public returns (uint256) {}

  /* ========================= REWARDS RELATED ========================= */
  /* ========================= REWARDS RELATED ========================= */
  /* ========================= REWARDS RELATED ========================= */
  function sharesFromMinting() public view returns (uint256) {
    return SafeMath.div(SafeMath.mul(SYLIMinted[msg.sender], PRECISION), SYLISupply + circulatingBoosts);
  }

  function sharesFromBoost() public view returns (uint256) {
    return SafeMath.div(SafeMath.mul(shareBoost[msg.sender], PRECISION), SYLISupply + circulatingBoosts);
  }

  function totalShares() public view returns (uint256) {
    return sharesFromMinting() + sharesFromBoost();
  }

  function totalRewardsFromMinting() public returns (uint256) {
    return SafeMath.div(SafeMath.mul(sharesFromMinting(), poolRewards.rewardsFund()), PRECISION);
  }

  function totalRewardsFromSharesBoost() public returns (uint256) {
    return SafeMath.div(SafeMath.mul(sharesFromBoost(), poolRewards.rewardsFund()), PRECISION);
  }

  function totalRewards() public returns (uint256) {
    return totalRewardsFromMinting() + totalRewardsFromSharesBoost();
  }

  function getEstimatedAPR() public returns (uint256) {
    return SafeMath.div(SafeMath.mul(poolRewards.rewardsFund(), PRECISION),SYLISupply + circulatingBoosts);
  } //THE APR SHOULD ALSO DEPEND ON THE SYLIX PRICE 
  //Find a way to get the daily volume of the pool each day
  //Find a way to get the daily fees sent to the pool each day
  //(dailyFees/dailyVolume) * 3650


  function availableRewardsFromMinting() public returns (uint256) {
    return SafeMath.div(SafeMath.mul(totalRewardsFromMinting(), rewardsLocker()), PRECISION);
  }

  function availableRewardsFromBoost() public returns (uint256) {
    return totalRewardsFromSharesBoost();
  }

  function totalAvailableRewards() public returns (uint256) {
    return availableRewardsFromMinting() + availableRewardsFromBoost();
  }

  function claimMintingRewards() public {
    require(availableRewardsFromMinting() > 0, "No claimable rewards");
    SYLIX.mintSylix(msg.sender, poolRewards.mockRewardsInSylixFromMinting());
  }

  function claimBoostRewards() public {
    require(availableRewardsFromBoost() > 0, "No claimable rewards");
    SYLIX.mintSylix(msg.sender, poolRewards.mockRewardsInSylixFromBoost());
  } 


  function rewardsLocker() public view returns (uint256) {
    uint256 duration = block.timestamp - lockStarter[msg.sender];
    uint256 percentage;
    if(duration <= MONTH) {
      percentage = SafeMath.div(SafeMath.mul(duration, PRECISION), MONTH);
    }
    else percentage = PRECISION; //find the precision for percentages
    return percentage;
  }

  function fillReserve(uint256 _amount) public {
    require(isFillingOpen = true, "You can't provide for the moment");
    //Governance Fees & rewardsFund fees
    uint256 governanceFees = SafeMath.div(SafeMath.mul(_amount, mintingFees), 2 * feesPrecision);
    uint256 controllerFees = SafeMath.div(SafeMath.mul(_amount, mintingFees), 2 * feesPrecision);
    //Transfering to the Governance & rewardsFund
    IERC20(stableAddress).transferFrom(msg.sender, governanceAddress, governanceFees);
    IERC20(stableAddress).transferFrom(msg.sender, controllerAddress, controllerFees);
    //Tranfering to the pool 
    IERC20(stableAddress).transferFrom(msg.sender, emergencyPoolsAddress, _amount - governanceFees - controllerFees);
    //Calculating the shares boosts
    uint256 rate = SafeMath.div(SafeMath.mul(genesisAmount, maxRate + minRate) - SafeMath.mul(maxRate, amountGiven), genesisAmount);
    uint256 amountInUsd = SafeMath.mul((_amount - governanceFees - controllerFees), Oracle.getRightPrice(stable)); //Use the real SYLI price when it's possible

    providedFunds[msg.sender] += amountInUsd;
    shareBoost[msg.sender] += SafeMath.div(SafeMath.mul(amountInUsd, rate), PRECISION);
    amountGiven += amountInUsd;
    //NO STSYLIX: THE ADVANTAGE COME FROM BEING ABLE TO KEEP THE SHARE FOR LIFE AS LONG AS YOU DON'T CLAIM THE REWARDS
  }


  // Si on est dans emergency: 
      // 1 envoyer tous les fonds à la pool Factory
      // 2 Fermer la pool (avec modifier)
      // Keep a track of all pool owners for refund

  /* ========================= RATIO MANAGEMENT RELATED ========================= */
  /* ========================= RATIO MANAGEMENT RELATED ========================= */
  /* ========================= RATIO MANAGEMENT RELATED ========================= */
  
  function ratioController() public returns (uint256) {
    uint256 tokenAmount; 
    uint256 currentPrice = Oracle.getRightPrice(volatile);
    (,,uint256 totalReserve) = getReserveValue(); 
    uint256 variation; 
    uint256 amountInUsd; 
    if(genesisVolatilePrice > currentPrice) {
      variation = SafeMath.div(SafeMath.mul(genesisVolatilePrice - currentPrice, PRECISION), currentPrice);
      amountInUsd = SafeMath.div(2 * variation * totalReserve, PRECISION);
      if(amountInUsd < SafeMath.div(SafeMath.mul(IERC20(volatileAddress).balanceOf(address(this)), Oracle.getRightPrice(volatile)), PRECISION)) {
        tokenAmount = SafeMath.div(SafeMath.mul(amountInUsd, PRECISION), Oracle.getRightPrice(volatile));
      } else {
        tokenAmount = IERC20(volatileAddress).balanceOf(address(this));
      }
      genesisVolatilePrice = currentPrice;
    }
    return tokenAmount;
  }

  function emergencyPoolFunding() public {
    //The pool has to fund the emergency pool automatically
    //Pool Reserve + emergencyPool Reserve >= 1.2 SYLI Supply
    //We want to keep the ratio inside the minting pool (30/70) 
    //But the pool Reserve could represent let's say 10% of total minted (with respect of the 30/70 ratio)
    //And the emergency pool could represent the remaining amount
  }

  function mockRatioController(uint256 _variation) public {
    uint256 toSwap;
    uint256 amountVolatile;
    uint256 amountStable;
    uint256 swapPRECISION;
    uint256 variation;
    uint256 currentPrice = SafeMath.div(SafeMath.mul(Oracle.getRightPrice(volatile), PRECISION - _variation), PRECISION);
    if(genesisVolatilePrice != currentPrice) {
      if(genesisVolatilePrice > currentPrice) {
        //uint256 variation = SafeMath.mul((genesisVolatilePrice - currentPrice), PRECISION);
        variation = SafeMath.div(SafeMath.mul(genesisVolatilePrice - currentPrice, PRECISION), genesisVolatilePrice);
        (,,uint256 totalReserve) = getReserveValue();
        if(variation >= 1e20) {
          swapPRECISION = 1e22;
        }
        else if(variation >= 1e19) {
          swapPRECISION = 1e21;
        }
        else if(variation >= 1e18) {
          swapPRECISION = 1e20;
        }
        else if(variation >=1e17) {
          swapPRECISION = 1e19;
        }
        else if(variation >= 1e16) {
          swapPRECISION = 1e18;
        }
        toSwap = (2 * variation * totalReserve)/(swapPRECISION);
        amountVolatile = SafeMath.div(SafeMath.mul(toSwap, PRECISION),Oracle.getRightPrice(volatile));
        amountStable = SafeMath.div(SafeMath.mul(toSwap, PRECISION),Oracle.getRightPrice(stable));
        IERC20(tokenAddress[volatile]).transfer(governanceAddress, amountVolatile);
        IERC20(tokenAddress[stable]).transfer(address(this), amountStable);
      }
    }
  }


  function openReserveFilling() public {
    //For the Reserve Filling: 
      //Minimum amount to get 
      //But is there a max ? 
      //A max margin ? 
    if(getTotalReserveValue() < SafeMath.div(SafeMath.mul(getSyliSupply(),120), 100)) {
      isFillingOpen = true;
      fillAmount = SafeMath.div(SafeMath.mul(getSyliSupply(),120), 100) - getTotalReserveValue();
      genesisAmount = fillAmount;
    }
  }

  function closeReserveFilling() public {
    if(getTotalReserveValue() >= SafeMath.div(SafeMath.mul(getSyliSupply(),120), 100)) {
      isFillingOpen = false; 
      fillAmount = 0;
    }
  }
  /* ========================= PUBLIC FUNCTIONS ======================== */
  /* ========================= RESTRICTED FUNCTIONS ======================== */
  /*function setAlpha(uint256 _percentage) public onlyByGovernance returns (uint256) {
    alpha = SafeMath.mul(_percentage,1e16);
    return alpha; //alpha in wei xe17
  }*/

  function setMintingFees(uint256 _fees) public onlyByGovernance returns (uint256) {
    mintingFees = _fees; 
    return mintingFees;
    //Fees in wei, e.g. 3% = 3e16
  }

  function setRedemptionFees(uint256 _fees) public onlyByGovernance returns (uint256) {
    redemptionFees = _fees;
    return redemptionFees;
    //Fees in wei, e.g. 3% = 3e16
  }

  function stopMinting() public onlyByGovernance {
    require(mintingOn == true, "The minting in not available"); 
    mintingOn = false;
  }

  function stopRedemption() public onlyByGovernance {
    require(redemptionOn == true, "The redemption is not available"); 
    redemptionOn = false;
  } 

  function linkRewardsPool(address _poolRewardsAddress) public onlyByGovernance {
    require(_poolRewardsAddress != address(0), "The address is not valid");
    poolRewardsAddress = _poolRewardsAddress;
    poolRewards = IpoolRewards(poolRewardsAddress);
  }

  function linkEmergencyPool(address _emergencyPoolsAddress) public onlyByGovernance {
    require(_emergencyPoolsAddress != address(0), "The address is not valid");
    emergencyPoolsAddress = _emergencyPoolsAddress;
    emergencyPools = IemergencyPools(emergencyPoolsAddress);
  }

  function linkRewardsController(address _controllerAddress) public onlyByGovernance {
    require(_controllerAddress != address(0)); 
    controllerAddress = _controllerAddress;
  }

  function setFillingRate(uint256 _maxRate, uint256 _minRate) public onlyByGovernance {
    //Rates in wei (e.g 1e17)
    maxRate = _maxRate; 
    minRate = _minRate;
  }
  /* ========================= EVENTS ======================== */

}