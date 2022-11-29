// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";




contract stSYLIX is ERC20, ERC20Burnable, Ownable {
    /* ========== STATE VARIABLES ========== */
    address public governanceAddress;
    mapping(address => bool) isStSylixVerified;
    
    

    /* ========== MODIFIERS ========== */
    modifier onlyByGovernance() {
        require(msg.sender == governanceAddress);
        _;
    }
    
    modifier bySylixVerified() {
        //require(isSylixVerified[msg.sender] == true);
        require(isStSylixVerified[msg.sender] == true);
        _;
    }

    modifier byGovernanceOrVerified() {
        require(msg.sender == governanceAddress || isStSylixVerified[msg.sender] == true);
        _;
    }

    /* ========== CONSTRUCTOR ========== */
    constructor(address _governanceAddress) ERC20("Sylium Share", "SYLIX") {
        governanceAddress = _governanceAddress;
    }

    /* ========== RESTRICTED FUNCTIONS ========== */
    //Mint SYLIX
    function mintStSylix(address _receiver, uint256 _amount)
        public byGovernanceOrVerified
    {
        _mint(_receiver, _amount);
        emit stSYLIXMinted(_receiver, _amount);
    }

    //Burn SYLIX
    function burnStSylix(address _from, uint256 _amount) public bySylixVerified {
        burnFrom(_from, _amount);
        emit stSYLIXBurned(_from, _amount);
    }

    function setVerification(address _verified) public onlyByGovernance{
        require(_verified != address(0), "Non-valid address"); 
        require(isStSylixVerified[_verified] == false, "Already a SYLIX verified address"); 
        isStSylixVerified[_verified] = true;
        emit verifiedAdded(_verified);
    }

    function removeVerification(address _verified) public onlyByGovernance {
        require(_verified != address(0), "Non-valid address"); 
        require(isStSylixVerified[_verified] == true, "Non a SYLIX verified address"); 
        isStSylixVerified[_verified] = false; 
        emit verifiedRemoved(_verified);
    }

    /* ========== EVENTS =========== */
    event stSYLIXMinted(address _receiver, uint256 _amount);

    event stSYLIXBurned(address _from, uint256 _amount);

    event verifiedAdded(address _verified);

    event verifiedRemoved(address _verified); 
}
