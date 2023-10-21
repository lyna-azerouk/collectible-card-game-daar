
//SPDX-License-Identifier
pragma solidity ^0.8.19;

//import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

abstract contract ERC721  {
  event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
  function balanceOf(address _owner)  public virtual   returns (uint256);
  function ownerOf(uint256 _tokenId) public virtual returns (address);
  function transferFrom(address _from, address _to, uint256 _tokenId) public virtual payable;
  function approve(address _approved, uint256 _tokenId) public virtual payable;

}