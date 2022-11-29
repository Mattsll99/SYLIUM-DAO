//SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "../mockToken/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract feesSwapper {
  /* ========================= STATE VARIABLES ========================= */
  address governanceAddress; 
  address[] poolsList;
  address ETHAddress;

  mapping(address => address) poolStable;
  mapping(address => address) poolVolatile;
  mapping(address => mapping(address => mapping(address => bool))) isTripletListed;

  uint256 constant DAY = 24 * 60 * 60;
  uint256 STARTER;
  uint256 NUM_POOLS;

  bool feesSwappedToETH;
  /* ========================= MODIFIERS ========================= */
  modifier byGovernance() {
    require(msg.sender == governanceAddress); 
    _;
  }
  /* ========================= CONSTRUCTOR ========================= */
  constructor(address _governanceAddress) {}
  /* ========================= VIEWS ========================= */
  function getBalance(address _tokenAddress) public view returns (uint256) {
    return IERC20(_tokenAddress).balanceOf(address(this));
  }
  /* ========================= PUBLIC FUNCTIONS ========================= */
  //set the timestamp (every hour)
  //function swapToETH
  function toETH(address _tokenAddress, uint256 _amount) public {
    emit toETHed(_tokenAddress, _amount);
  }

  function tokensToETH() public {
    if(block.timestamp - STARTER >= DAY) {
      for(uint i = 0; i < poolsList.length; i++) {
        if(poolVolatile[poolsList[i]] != ETHAddress && IERC20(poolVolatile[poolsList[i]]).balanceOf(address(this)) > 0) {
          uint256 balance = IERC20(poolVolatile[poolsList[i]]).balanceOf(address(this));
          toETH(poolVolatile[poolsList[i]], balance);
        }
        if(poolStable[poolsList[i]] != ETHAddress && IERC20(poolStable[poolsList[i]]).balanceOf(address(this)) > 0) {
          uint256 balance = IERC20(poolStable[poolsList[i]]).balanceOf(address(this));
          toETH(poolStable[poolsList[i]], balance);
        }
      }
      feesSwappedToETH = true;
    }
  }

  function rewardsPoolsFunding() public {
    if(feesSwappedToETH == true) {
      uint256 ETHBalance = IERC20(ETHAddress).balanceOf(address(this));
      uint256 ETHPortion = SafeMath.div(ETHBalance, NUM_POOLS);
      for(uint i = 0; i < poolsList.length; i++) {
        IERC20(ETHAddress).transferFrom(address(this), poolsList[i], ETHPortion);
      }
      emit ETHRewardsSent(ETHBalance);
    }
  }
  /* ========================= RESTRICTED FUNCTIONS ========================= */
  function addRewardsPool(address _poolAddress, address _volatileAddress, address _stableAddress) public byGovernance {
    require(_poolAddress != address(0) && _volatileAddress != address(0) && _stableAddress != address(0), "Invalid address");
    require(isTripletListed[_poolAddress][_volatileAddress][_stableAddress] == false, "Triplet already listed");
    poolsList.push(_poolAddress);
    poolVolatile[_poolAddress] = _volatileAddress; 
    poolStable[_poolAddress] = _stableAddress; 
    isTripletListed[_poolAddress][_volatileAddress][_stableAddress] = true;
    NUM_POOLS += 1;
    emit tripletAdded(_poolAddress, _volatileAddress, _stableAddress);
  }

  function removeRewardsPool(address _poolAddress, address _volatileAddress, address _stableAddress) public byGovernance {
    require(isTripletListed[_poolAddress][_volatileAddress][_stableAddress] == true, "Triplet is not listed");
    for(uint i = 0; i < poolsList.length; i++) {
      if(poolsList[i] == _poolAddress) {
        poolsList[i] = address(0); 
        break;
      }
    }
    isTripletListed[_poolAddress][_volatileAddress][_stableAddress] = false;
    delete poolStable[_poolAddress]; 
    delete poolVolatile[_poolAddress];
    NUM_POOLS -= 1;
    emit tripletRemoved(_poolAddress, _volatileAddress, _stableAddress);
  }

  /* ========================= EVENTS ========================= */
  event tripletAdded(address _poolAddress, address _volatileAddress, address _stableAddress); 
  event tripletRemoved(address _poolAddress, address _volatileAddress, address _stableAddress);
  event toETHed(address _fromToken, uint256 _amount);
  event ETHRewardsSent(uint256 _amount);
}