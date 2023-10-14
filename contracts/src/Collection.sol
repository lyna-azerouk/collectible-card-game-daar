// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "./Ownable.sol";


contract Collection  is Ownable{
  string public name;
  int public cardCount;
  mapping (address => uint) ownerCollectionCount;

  constructor(string memory _name, int _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }

}
