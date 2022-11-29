// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

//import "../SYLIUMPools/SYLIUMPools.sol";
import "hardhat/console.sol";
import "../oracle/Ioracle.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../mockToken/IERC20.sol";
import "../SYLIUMPools/ISYLIUMPools.sol";

contract poolFactory {
  /* ========================= STATE VARIABLES ========================= */
  //Math related
  uint256 constant PRECISION = 1e18;
  uint256 upperLimit; 
  uint256 lowerLimit;
  uint256 genesisAlpha; 
  uint256 starter; 
  uint256 constant refresh = 3600;
  uint256 genesisSupply;
  uint256 maxPercentage;

  address public governanceAddress;
  mapping(string => address) tokenAddress;
  mapping(address => mapping(address => address)) pairAddress;
  mapping(address => bool) isPairListed;
  mapping(address => bool) isListed; 
  address[] tokenList; 
  address[] volatileList; 
  address[] stableList; 
  address[] pairAddresses;

  address oracleAddress;
  Ioracle Oracle;

  // Data retrievement
  mapping(address => string) pairVolatile;
  mapping(address => string) pairStable;
  mapping(address => address) pairVolatileAddress; 
  mapping(address => address) pairStableAddress;
  mapping(address => uint256) pairTotalBalance;
  mapping(address => uint256) pairVolatileBalance; 
  mapping(address => uint256) pairStableBalance;
  mapping(address => uint256) pairTotalRatio; 
  mapping(address => uint256) pairVolatileRatio; 
  mapping(address => uint256) pairStableRatio;
  mapping(address => uint256) syliSupplyFrom;

  //SYLIUMPools public pairContract;
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
    genesisAlpha = 0;
    starter = block.timestamp;
    genesisSupply = 0;
  }
  /* ========================= VIEWS ========================= */

  function getTotalBalance() public returns (uint256) {
    uint256 totalBalance; 
    for(uint i = 0; i < pairAddresses.length; i++) {
      totalBalance += getPairBalance(pairAddresses[i]); 
    }
    return totalBalance;
  }

  function getPairBalance(address _pairAddress) public returns (uint256) {
    uint256 volatileBalance = SafeMath.div(SafeMath.mul(IERC20(pairVolatileAddress[_pairAddress]).balanceOf(_pairAddress),Oracle.getRightPrice(pairVolatile[_pairAddress])), PRECISION);
    uint256 stableBalance = SafeMath.div(SafeMath.mul(IERC20(pairStableAddress[_pairAddress]).balanceOf(_pairAddress), Oracle.getRightPrice(pairStable[_pairAddress])), PRECISION);
    pairTotalBalance[_pairAddress] = volatileBalance + stableBalance;
    return pairTotalBalance[_pairAddress];
  } // Access the volatile & stable addresses of each pair

  function getPairVolatileBalance(address _pairAddress) public returns (uint256) {
    pairVolatileBalance[_pairAddress] = SafeMath.div(SafeMath.mul(IERC20(pairVolatileAddress[_pairAddress]).balanceOf(_pairAddress), Oracle.getRightPrice(pairVolatile[_pairAddress])), PRECISION);
    return pairVolatileBalance[_pairAddress];
  }

  function getPairStableBalance(address _pairAddress) public returns (uint256) {
    pairStableBalance[_pairAddress] = SafeMath.div(SafeMath.mul(IERC20(pairStableAddress[_pairAddress]).balanceOf(_pairAddress), Oracle.getRightPrice(pairStable[_pairAddress])), PRECISION);
    return pairStableBalance[_pairAddress];
  }

  function getPairTotalRatio(address _pairAddress) public returns (uint256) {
    uint256 totalBalance;
    for(uint i = 0; i < pairAddresses.length; i++) {
      totalBalance += getPairBalance(pairAddresses[i]);
    }
    pairTotalRatio[_pairAddress] = SafeMath.div(SafeMath.mul(PRECISION, getPairBalance(_pairAddress)), totalBalance);
    return pairTotalRatio[_pairAddress];
  }

  function getPairVolatileRatio(address _pairAddress) public returns (uint256) {
    pairVolatileRatio[_pairAddress] = SafeMath.div(SafeMath.mul(getPairVolatileBalance(_pairAddress), PRECISION), getPairBalance(_pairAddress)); 
    return pairVolatileRatio[_pairAddress];
  }

  function getPairStableRatio(address _pairAddress) public returns (uint256) {
    pairStableRatio[_pairAddress] = SafeMath.div(SafeMath.mul(getPairStableBalance(_pairAddress), PRECISION), getPairBalance(_pairAddress)); 
    return pairStableRatio[_pairAddress];
  }

  // Get total SYLI Supply
  function getSyliSupply() public view returns (uint256) {
    uint256 totalSupply; 
    for(uint i = 0; i < pairAddresses.length; i++) {
      totalSupply += ISYLIUMPools(pairAddresses[i]).getSyliSupply();
    }
    return totalSupply;
  }

  // Get SYLI Supply from pair
  function getSyliSupplyFrom(address _pairAddress) public returns (uint256) {
    syliSupplyFrom[_pairAddress] = ISYLIUMPools(_pairAddress).getSyliSupply();
    return syliSupplyFrom[_pairAddress];
  }

  function setAlpha() public returns (uint256) {
    uint256 alpha;
    uint256 variationRate; 
    if(block.timestamp - starter >= refresh) {
      uint256 currentSupply = getSyliSupply();
      if(currentSupply >= genesisSupply) {
        variationRate = SafeMath.div(SafeMath.mul(currentSupply - genesisSupply, PRECISION), genesisSupply);
        if(alpha + variationRate >= maxPercentage) {
          alpha = maxPercentage;
        } else {
          alpha += variationRate;
        }
      }
      else if(currentSupply < genesisSupply) {
        variationRate = SafeMath.div(SafeMath.mul(genesisSupply - currentSupply, PRECISION), currentSupply);
        if(alpha <= variationRate) {
          alpha = 0;
        } else {
           alpha -= variationRate;
        }
      }
      starter = block.timestamp;
      genesisSupply = getSyliSupply();
    }
    return alpha;
  }

  function mockstablecoinManagement() public {
    for(uint i = 0; i < pairAddresses.length; i++) {
      if(Oracle.getRightPrice(pairStable[pairAddresses[i]]) >= upperLimit || Oracle.getRightPrice(pairStable[pairAddresses[i]]) <= lowerLimit) {
        ISYLIUMPools(pairAddresses[i]).stopMinting();
        ISYLIUMPools(pairAddresses[i]).stopRedemption();
        uint256 balanceVolatile = IERC20(tokenAddress[pairVolatile[pairAddresses[i]]]).balanceOf(pairAddresses[i]);
        uint256 balanceStable = IERC20(tokenAddress[pairStable[pairAddresses[i]]]).balanceOf(pairAddresses[i]);
        IERC20(tokenAddress[pairStable[pairAddresses[i]]]).transferFrom(pairAddresses[i],address(this), balanceStable);
        IERC20(tokenAddress[pairVolatile[pairAddresses[i]]]).transferFrom(pairAddresses[i],address(this), balanceVolatile);
        for(uint j=0; i< pairAddresses.length; j++) {
          uint256 volatileToSwap = SafeMath.mul(pairTotalRatio[pairAddresses[i]], balanceVolatile);
          uint256 stableToSwap = SafeMath.mul(pairTotalRatio[pairAddresses[i]], balanceVolatile);
          // Burning the volatile
          IERC20(tokenAddress[pairVolatile[pairAddresses[i]]]).transfer(address(0), volatileToSwap);
          // Minting the volatile
          IERC20(tokenAddress[pairVolatile[pairAddresses[j]]]).transfer(pairAddresses[j], volatileToSwap);
          // Burning the stable
          IERC20(tokenAddress[pairStable[pairAddresses[i]]]).transfer(address(0), stableToSwap);
          // Minting the Stable
          IERC20(tokenAddress[pairStable[pairAddresses[j]]]).transfer(pairAddresses[j], stableToSwap);
        }
      }
    }
  } 
  // Block the minting and the redemption of the pool 
  //Stablecoin & volatile interSwaping in case of depeg 

  function stablecoinManagement() public {}

  /* ========================= PUBLIC FUNCTIONS ========================= */
  /* ========================= RESTRICTED FUNCTIONS ========================= */
  //Add volatile token
  function addVolatileToken(string memory _volatile, address _volatileAddress) public {
    /*require(isListed[_volatileAddress] == false, "This token is already listed");
    tokenAddress[_volatile] = _volatileAddress; 
    isListed[_volatileAddress] = true;
    tokenList.push(tokenAddress[_volatile]);
    volatileList.push(tokenAddress[_volatile]);
    emit volatileTokenAdded(tokenAddress[_volatile]);*/

    require(_volatileAddress != address(0), "Invalid address");
    if(isListed[_volatileAddress] == false) {
      tokenAddress[_volatile] = _volatileAddress; 
      isListed[_volatileAddress] = true;
      tokenList.push(tokenAddress[_volatile]);
      volatileList.push(tokenAddress[_volatile]);
      emit volatileTokenAdded(tokenAddress[_volatile]);
    }
  }
  //Remove volatile token
  function removeVolatileToken(string memory _volatile, address _volatileAddress) public {
    require(isListed[_volatileAddress] == true, "This token is not listed"); 
    delete tokenAddress[_volatile];
    for(uint i =0; i < tokenList.length; i++) {
      if(tokenList[i] == _volatileAddress) {
        tokenList[i] = address(0);
        break;
      }
    }
    for(uint i = 0; i < volatileList.length; i++) {
      if(volatileList[i] == _volatileAddress) {
        volatileList[i] = address(0);
        break;
      }
    }
  }
  //Add stable token
  function addStableToken(string memory _stable, address _stableAddress) public {
    /*require(isListed[_stableAddress] == false, "This token is already listed");
    tokenAddress[_stable] = _stableAddress; 
    isListed[_stableAddress] = true;
    tokenList.push(tokenAddress[_stable]);
    stableList.push(tokenAddress[_stable]);
    emit stableTokenAdded(tokenAddress[_stable]);*/

    require(_stableAddress != address(0), "Invalid address");
    if(isListed[_stableAddress] == false) {
      tokenAddress[_stable] = _stableAddress; 
      isListed[_stableAddress] = true;
      tokenList.push(tokenAddress[_stable]);
      stableList.push(tokenAddress[_stable]);
      emit stableTokenAdded(tokenAddress[_stable]);
    }
  }
  //Remove stable token
  function removeStableToken(string memory _stable, address _stableAddress) public onlyByGovernance {
    require(isListed[_stableAddress] == true, "This token is not listed"); 
    delete tokenAddress[_stable];
    for(uint i =0; i < tokenList.length; i++) {
      if(tokenList[i] == _stableAddress) {
        tokenList[i] = address(0);
        break;
      }
    }
    for(uint i = 0; i < stableList.length; i++) {
      if(stableList[i] == _stableAddress) {
        stableList[i] = address(0);
        break;
      }
    }
  }

  function addPair(string memory _volatile, string memory _stable, address _pairAddress) public {
    require(isListed[tokenAddress[_volatile]] == true, "The volatile token is not listed");
    require(isListed[tokenAddress[_stable]] == true, "The stablecoin is not listed");
    require(isPairListed[_pairAddress] == false, "The pair is already listed");
    pairAddress[tokenAddress[_volatile]][tokenAddress[_stable]] =  _pairAddress;
    isPairListed[_pairAddress] = true;
    pairVolatile[_pairAddress] = _volatile; 
    pairStable[_pairAddress] = _stable;
    pairVolatileAddress[_pairAddress] = tokenAddress[_volatile];
    pairStableAddress[_pairAddress] = tokenAddress[_stable];
    pairAddresses.push(_pairAddress);
    emit pairAdded(_pairAddress);
  }

  function removePair(string memory _volatile, string memory _stable, address _pairAddress) public onlyByGovernance {
    require(isListed[tokenAddress[_volatile]] == true, "The volatile token is not listed");
    require(isListed[tokenAddress[_stable]] == true, "The stablecoin is not listed");
    require(isPairListed[_pairAddress] == true, "The pair is not listed");
    pairAddress[tokenAddress[_volatile]][tokenAddress[_stable]] =  address(0);
    isPairListed[_pairAddress] = true;
    for(uint i = 0; i < pairAddresses.length; i++) {
      if (pairAddresses[i] == _pairAddress) {
        pairAddresses[i] = address(0);
        break;
      }
    }
    emit pairRemoved(_pairAddress);
  } // When a pair is removed, player shouldn't be able to mint or redeem from the address
    // All funds must be sent to the other pools

  function setMaxPercentage(uint256 _maxPercentage) public onlyByGovernance {
    maxPercentage = _maxPercentage;
  }
  

  function limitSetting(uint256 _upperLimit, uint256 _lowerLimit) public onlyByGovernance {
    upperLimit = _upperLimit; 
    lowerLimit = _lowerLimit;
  }

  /* ========================= EVENTS ========================= */
  event volatileTokenAdded(address _token);
  event stableTokenAdded(address _token);
  event pairAdded(address _pairAddress);
  event pairRemoved(address _pairAddress);
}