pragma solidity 0.5.16;

contract HasOwnerShip {
  
  address public owner;
  bool public flag;

  constructor() public {
    owner = msg.sender;
    flag = false;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function priviledgedAction(bool newFlag) onlyOwner public {
    flag = newFlag;
  }
}

