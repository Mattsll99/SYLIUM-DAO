// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "hardhat/console.sol"; 
import "../mockToken/IERC20.sol";
import "../oracle/Ioracle.sol";
import "../SYLI/ISYLI.sol";
import "../SYLIX/ISYLIX.sol";
import "../stSYLIX/IstSYLIX.sol";
import "../SYLIUMPools/ISYLIUMPools.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract POR {
  /* ========================= STATE VARIABLES ========================= */
  uint256 constant PRECISION = 1e18;
  address governanceAddress;
  address controllerAddress;
  address oracleAddress;
  address stSylixAddress;
  Ioracle public Oracle;
  IstSYLIX public stSYLIX;
  mapping(string => address) tokenAddress;
  mapping(address => bool) isTokenListed;
  mapping(address => bool) isPoolListed;
  mapping(address => mapping(address => bool)) isPOROpen;
  mapping(address => mapping(address => uint256)) genesisAmount;
  mapping(address => mapping(address => uint256)) providedAmount;
  mapping(address => mapping(address => uint256)) PORFees;
  mapping(address => mapping(address => uint256)) stSYLIXRewards;
  /* ========================= MODIFIERS ========================= */
  modifier onlyByGovernance() {
    require(msg.sender == governanceAddress);
    _;
  }
  /* ========================= CONSTRUCTOR ========================= */
  constructor(address _governanceAddress, address _oracleAddress, address _controllerAddress, address _stSylixAddress) {
    governanceAddress = _governanceAddress;
    controllerAddress = _controllerAddress;
    oracleAddress = _oracleAddress;
    Oracle = Ioracle(oracleAddress);
    stSylixAddress = _stSylixAddress;
    stSYLIX = IstSYLIX(stSylixAddress);
  }
  /* ========================= VIEWS ========================= */
  /* ========================= PUBLIC FUNCTIONS ========================= */
  function PORvide(string memory _token, address _toEmergencyPool, uint256 _amount) public {
    require(providedAmount[_toEmergencyPool][tokenAddress[_token]] <= genesisAmount[_toEmergencyPool][tokenAddress[_token]], "Enough funds collected");
    require(isPOROpen[_toEmergencyPool][tokenAddress[_token]] == true, "The P.O.R. is not open");
    uint256 governanceFees = SafeMath.div(SafeMath.mul(PORFees[_toEmergencyPool][tokenAddress[_token]], _amount), 2 * PRECISION);
    uint256 controllerFees = SafeMath.div(SafeMath.mul(PORFees[_toEmergencyPool][tokenAddress[_token]], _amount), 2 * PRECISION);
    IERC20(tokenAddress[_token]).transferFrom(msg.sender, governanceAddress, governanceFees); 
    IERC20(tokenAddress[_token]).transferFrom(msg.sender, controllerAddress, controllerFees);
    IERC20(tokenAddress[_token]).transferFrom(msg.sender, _toEmergencyPool, _amount - governanceFees - controllerFees);
    uint256 amountValue = SafeMath.div(SafeMath.mul(_amount - governanceFees - controllerFees, Oracle.getRightPrice(_token)), PRECISION);
    uint256 fraction = SafeMath.div(SafeMath.mul(amountValue, PRECISION), genesisAmount[_toEmergencyPool][tokenAddress[_token]]);
    stSYLIX.mintStSylix(msg.sender, SafeMath.div(SafeMath.mul(fraction, stSYLIXRewards[_toEmergencyPool][tokenAddress[_token]]), PRECISION));
    providedAmount[_toEmergencyPool][tokenAddress[_token]] += amountValue;
  }
  /* ========================= RESTRICTED FUNCTIONS ========================= */
  function addToken(string memory _token, address _tokenAddress) public onlyByGovernance {
    require(_tokenAddress != address(0), "Invalid address");
    require(isTokenListed[_tokenAddress] == false, "Token already listed");
    tokenAddress[_token] = _tokenAddress;
    isTokenListed[_tokenAddress] = true;
  }

  function addEmergencyPool(address _poolAddress) public onlyByGovernance {
    require(_poolAddress != address(0), "Invalid address");
    require(isPoolListed[_poolAddress] == false, "Pool is already listed");
    isPoolListed[_poolAddress] = true;
  }

  function removeEmergencyPool(address _poolAddress) public onlyByGovernance {
    require(isPoolListed[_poolAddress] == true, "This pool is not listed"); 
    isPoolListed[_poolAddress] = false;
  }

  function openPOR(uint256 _amount, string memory _token, address _toEmergencyPool, uint256 _stSylixAmount) public onlyByGovernance {
    require(isPoolListed[_toEmergencyPool] == true, "This pool is not listed");
    require(isPOROpen[_toEmergencyPool][tokenAddress[_token]] == false, "P.O.R. is already open");
    isPOROpen[_toEmergencyPool][tokenAddress[_token]] = true;
    genesisAmount[_toEmergencyPool][tokenAddress[_token]] = _amount;
    stSYLIXRewards[_toEmergencyPool][tokenAddress[_token]] = _stSylixAmount;
  }

  function closePOR(string memory _token, address _toEmergencyPool) public onlyByGovernance {
    require(isPOROpen[_toEmergencyPool][tokenAddress[_token]] == true, "P.O.R. is not open");
    isPOROpen[_toEmergencyPool][tokenAddress[_token]] = false;
    genesisAmount[_toEmergencyPool][tokenAddress[_token]] = 0;
    providedAmount[_toEmergencyPool][tokenAddress[_token]] = 0;
    stSYLIXRewards[_toEmergencyPool][tokenAddress[_token]] = 0;
  }

  function setPORFees(uint256 _fees, string memory _token, address _poolAddress) public onlyByGovernance {
    //Fees in WEI; e.g. 3% = 3e16
    PORFees[_poolAddress][tokenAddress[_token]] = _fees;
  }
  /* ========================= EVENTS ========================= */
}