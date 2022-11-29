// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "../oracle/Ioracle.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Aquafina {
  using SafeMath for uint256;
  /* ==================== STATE VARIABLES ==================== */
  address public governanceAddress;
  Ioracle private oracle; 
  mapping(string => uint256) genesisPrice;
  mapping(string => uint256) tokenStarter; // name => starterlaps => priceVariation
  uint256 public constant dayLapse = 86400; 
  uint256 public starterLapse; 
  address public oracleAddress;
  uint256 varPrecision = 1e4;
  uint256 coolDown = 3600;
  /* ==================== MODIFIERS ==================== */
  modifier onlyByGovernance() {
    require(msg.sender == governanceAddress); 
    _;
  }
  /* ==================== CONSTRUCTOR ==================== */
  constructor(address _governanceAddress, address _oracleAddress) {
    governanceAddress = _governanceAddress;

    oracleAddress = _oracleAddress; 
    oracle = Ioracle(oracleAddress);
    // Instantiat all genesisPrice of the Tokens
    genesisPrice["ETH"] = oracle.getRightPrice("ETH");
    genesisPrice["AAVE"] = oracle.getRightPrice("AAVE");
    genesisPrice["CAKE"] = oracle.getRightPrice("CAKE");
    genesisPrice["COMP"] = oracle.getRightPrice("COMP");
    genesisPrice["CRV"] = oracle.getRightPrice("CRV");
    genesisPrice["DAI"] = oracle.getRightPrice("DAI");
    genesisPrice["FRAX"] = oracle.getRightPrice("FRAX");
    genesisPrice["LINK"] = oracle.getRightPrice("LINK");
    genesisPrice["MKR"] = oracle.getRightPrice("MKR");
    genesisPrice["SUSHI"] = oracle.getRightPrice("SUSHI");
    genesisPrice["USDC"] = oracle.getRightPrice("USDC");
    genesisPrice["UNI"] = oracle.getRightPrice("UNI");
    genesisPrice["USDT"] = oracle.getRightPrice("USDT");
  }
  /* ==================== VIEWS ==================== */
  /* ==================== PUBLIC FUNCTIONS ==================== */
  function getVariation(string memory _name) public returns (uint256) {
    uint256 currentPrice = oracle.getRightPrice(_name);
    uint256 varToken;
    if(block.timestamp - tokenStarter[_name] <= dayLapse) {
      varToken = ((Math.max(currentPrice, genesisPrice[_name]) - Math.min(currentPrice, genesisPrice[_name])) * varPrecision) / Math.min(currentPrice, genesisPrice[_name]);
    } else {
      tokenStarter[_name] = block.timestamp;
      genesisPrice[_name] = oracle.getRightPrice(_name);
    }
    return varToken;
  }

  function mockVariation(string memory _name) public returns (uint256) {
    uint256 currentPrice = oracle.getRightPrice(_name) - (oracle.getRightPrice(_name) * 6)/100; //6% decrease
    uint256 varToken;
    if(block.timestamp - tokenStarter[_name] <= dayLapse) {
      varToken = ((Math.max(currentPrice, genesisPrice[_name]) - Math.min(currentPrice, genesisPrice[_name])) * varPrecision) / Math.min(currentPrice, genesisPrice[_name]);
    } else {
      tokenStarter[_name] = block.timestamp;
      genesisPrice[_name] = oracle.getRightPrice(_name);
    }
    return varToken;
  }
  /* ==================== RESTRICTED FUNCTIONS ==================== */
  function setTokenStarter(string memory _name) public onlyByGovernance {
    require (tokenStarter[_name] == 0, "Starter already declared"); 
    tokenStarter[_name] = block.timestamp;
    emit tokenStarterSet(_name, tokenStarter[_name]);
  }
  /* ==================== EVENTS ==================== */
  event tokenStarterSet(string _token, uint256 _starter);
}