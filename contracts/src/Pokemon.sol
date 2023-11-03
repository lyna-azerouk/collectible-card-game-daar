pragma solidity ^0.8.19;

import "./Ownable.sol";

contract Pokemon is Ownable {
  string public id;
  string public imgUrl;
  
  constructor(string memory _id, string memory _imgUrl) {
    id = _id;
    imgUrl = _imgUrl;
  }

  function getId() public view returns (string memory) {
    return id;
  }

  function getImgUrl() public view returns (string memory) {
    return imgUrl;
  }
}
