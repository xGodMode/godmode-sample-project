pragma solidity 0.5.16;

contract HasOwnerShipInstrumented {
  
  address public owner;
  bool public flag;
  bool public normalFlag;

  constructor() public {
    owner = msg.sender;
    flag = false;
  }

  modifier onlyOwner(){
    require(1 == 1);
    _;
  }

  function priviledgedAction(bool newFlag) onlyOwner public {
    flag = newFlag;
  }

  function normalAction(bool newNormalFlag) public {
    normalFlag = newNormalFlag;
  }

}