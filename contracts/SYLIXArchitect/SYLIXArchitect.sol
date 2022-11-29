//SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "hardhat/console.sol";
import "../SYLIX/ISYLIX.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract SYLIXArchitect {
  using SafeMath for uint256;
  /* ========================= STATE VARIABLES ========================= */
  address governanceAddress; 
  address sylixArchitectAddress;
  address sylixAddress;
  address emergencyPoolFactoryAddress; 
  address rewardsPoolFactoryAddress;
  address stakingPoolAddress;
  address sylixBurnerAddress;

  address[] rewardsPoolsList;
  mapping(address => bool) isListed;

  uint256 lastBlock;
  bool timeElapsed;
  uint256 MULTIPLIER;
  uint256 numRewardsPools;
  uint256 public constant PRECISION = 1e18;
  uint256 public constant SYLIX_PER_BLOCK = 36 * 1e18;
  uint256 public constant SYLIXToRewardsPools = 7 * 1e18;
  uint256 public constant SYLIXToStakingPool = 2 * 1e18;
  uint256 public constant SYLIXForFunding = 27 * 1e18;
  uint256 public constant SYLIXToGovernance = 1e18; //How many??? 
  ISYLIX public SYLIX;


  /* ========================= MODIFIERS ========================= */
  modifier byArchitect() {
    require(msg.sender == sylixArchitectAddress);
    _; 
  }

  modifier byGovernance() {
    require(msg.sender == governanceAddress); 
    _;
  }
  /* ========================= CONSTRUCTOR ========================= */
  constructor(address _governanceAddress, address _sylixAddress, address _emergencyPoolFactoryAddress, address _rewardsPoolFactoryAddress) {
    governanceAddress = _governanceAddress;
    sylixAddress = _sylixAddress;
    _emergencyPoolFactoryAddress = _emergencyPoolFactoryAddress; 
    _rewardsPoolFactoryAddress = _rewardsPoolFactoryAddress;
    SYLIX = ISYLIX(sylixAddress);
    lastBlock = block.number;
  }
  /* ========================= VIEWS ========================= */
  /* ========================= PUBLIC FUNCTIONS ========================= */
  function pendingBlock() public returns (bool, uint256) { 
    if(block.number > lastBlock) {
      timeElapsed = true;
      MULTIPLIER = block.number - lastBlock; 
    }
    return (timeElapsed, MULTIPLIER);
  }

  /* ========================= RESTRICTED FUNCTIONS ========================= */
  //Send funds to Emergency pool factory
  function emergencyPoolFactoryFunding() public {
    if(timeElapsed == true) {
      SYLIX.mintSylix(emergencyPoolFactoryAddress, SafeMath.div(SafeMath.mul(SYLIXForFunding, MULTIPLIER), PRECISION));
    }
  } //if pendingBlock good go 
  //Send funds to Rewards pool factory 
  
  function stakingPoolFunding() public {
    if(timeElapsed == true) {
      SYLIX.mintSylix(stakingPoolAddress, SafeMath.div(SafeMath.mul(SYLIXToStakingPool, MULTIPLIER), PRECISION));
    }
  }

  function rewardsPoolsFunding() public {
    uint256 portion = SafeMath.div(SYLIXToRewardsPools, numRewardsPools);
    if(timeElapsed == true) {
      for(uint i = 0; i < rewardsPoolsList.length; i++) {
        SYLIX.mintSylix(rewardsPoolsList[i], portion);
      }
    }
  }

  function addRewardsPool(address _rewardsPoolAddress) public byGovernance {
    require(_rewardsPoolAddress != address(0), "Invalid address"); 
    require(isListed[_rewardsPoolAddress] == false, "The pool is already listed"); 
    isListed[_rewardsPoolAddress] = true; 
    rewardsPoolsList.push(_rewardsPoolAddress);
    numRewardsPools += 1;
  }

  function removeRewardsPool(address _rewardsPoolAddress) public byGovernance {
    require(isListed[_rewardsPoolAddress] == true, "The pool is not listed"); 
    isListed[_rewardsPoolAddress] = false; 
    for(uint i = 0; i < rewardsPoolsList.length; i++) {
      if(rewardsPoolsList[i] == _rewardsPoolAddress) {
        rewardsPoolsList[i] == address(0); 
        break;
      }
    }
    numRewardsPools -= 1;
  }
  
  /* ========================= EVENTS ========================= */
  event burnedSYLIXSent(uint256 _amount);
  event SYLIXForEmergencySent(uint256 _amount); 
  event SYLIXForRewardsSent(uint256 _amount);
}