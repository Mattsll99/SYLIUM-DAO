// SPDX-License-Identifier: MIT

pragma solidity 0.8.9; 

import "../mockToken/IERC20.sol";

interface ISYLI is IERC20 {
  function mintSyli(address _receiver, uint256 _amount) external; 
  function burnSyli(address _from, uint256 _amount) external; 
  function setPoolAllowance(address _poolAddress) external; 
  function removePoolAllowance(address _poolAddress) external; 
}