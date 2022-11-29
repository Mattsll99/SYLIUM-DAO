// SPDX-License-Identifier: MIT

import "../mockToken/IERC20.sol";

pragma solidity 0.8.9;

interface ISYLIX is IERC20 {
  function mintSylix(address _receiver, uint256 _amount) external;
  function burnSylix(address _from, uint256 _amount) external; 
  function setVerification (address _verified) external; 
  function removeVerification (address _verified) external; 
}