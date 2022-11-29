// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "hardhat/console.sol";
import "../pricer/AggregatorV3Interface.sol";

contract Oracle {
  address public governanceAddress;
  mapping(string => address) Feed;
  string[] dataFeeds;
  uint8 public constant PRECISION = 18; 
  AggregatorV3Interface private priceFeed; 


  modifier onlyByGovernance() {
    require(msg.sender == governanceAddress);
    _;
  }


  constructor(address _governanceAddress) {
    governanceAddress = _governanceAddress;
  }

  function getLatestPrice(string memory _name) public view returns (int256){
    (
            uint80 roundID,
            int256 price,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = AggregatorV3Interface(Feed[_name]).latestRoundData();
        require(
            price >= 0 && updatedAt != 0 && answeredInRound >= roundID,
            "Invalid price"
        );

        return price;
  }

  function getDecimals(string memory _name) public view returns (uint8) {
        return AggregatorV3Interface(Feed[_name]).decimals();
    }

  function getRightPrice(string memory _name) public view returns (uint256) {
    uint256 rightPrice = uint256(getLatestPrice(_name)) * uint256(10) ** (PRECISION - uint256(getDecimals(_name)));
    return rightPrice;
  }

  function getSylixPrice() public view returns (uint256) {
    uint256 sylixPrice = getRightPrice("ETH")/100;
    return sylixPrice;
  }

  // RESTRICTED FUNCTIONS
  function addPriceFeed(string memory _name, address _addressFeed) public onlyByGovernance{
    Feed[_name] = _addressFeed;
    dataFeeds.push(_name);
  }

  function removePriceFeed(string memory _name) public onlyByGovernance {}

  
}