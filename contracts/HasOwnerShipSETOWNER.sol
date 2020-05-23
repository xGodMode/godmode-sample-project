pragma solidity 0.5.16;

contract HasOwnerShipSETOWNER{
  
  address public owner;
  bool public flag;
  bool public normalFlag;

  constructor() public {
    owner = msg.sender;
    flag = false;
  }

  modifier onlyOwner(){
    require(msg.sender == owner);
    _;
  }

  function priviledgedAction(bool newFlag) onlyOwner public {
    flag = newFlag;
  }

  function normalAction(bool newNormalFlag) public {
    normalFlag = newNormalFlag;
  }

  function setOwner() public {
    owner = msg.sender;
  }

}