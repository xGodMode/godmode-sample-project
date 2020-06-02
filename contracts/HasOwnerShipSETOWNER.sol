pragma solidity 0.5.16;

contract HasOwnerShipSETOWNER{
  
  address public owner;
  bool public flag;

  constructor() public {
    owner = msg.sender;   // <------- SET DURING DEPLOYMENT
    flag = false;
  }

  modifier onlyOwner(){
    require(msg.sender == owner);
    _;
  }

  //                                       onlyOwner
  function priviledgedAction(bool newFlag) onlyOwner public {
    flag = newFlag;
  }


  function setOwner() public {
    owner = msg.sender;
  }
}