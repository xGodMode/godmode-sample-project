pragma solidity 0.5.16;

contract HasOwnerShipInstrumented{
  
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


  function priviledgedAction(bool newFlag) public {
    flag = newFlag;
  }

}