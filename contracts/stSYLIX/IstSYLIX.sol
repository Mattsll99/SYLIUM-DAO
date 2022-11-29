// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "../mockToken/IERC20.sol";

interface IstSYLIX is IERC20 {
  function mintStSylix(address _receiver, uint256 _amount) external; 
  function burnStSylix(address _from, uint256 _amount) external; 
  function setVerification(address _verified) external; 
  function removeVerification(address _verified) external; 
}