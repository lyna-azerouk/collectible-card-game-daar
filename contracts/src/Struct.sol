// SPDX-License-Identifier: MIT
//pragma solidity >=0.5.0 <0.6.0;

pragma solidity ^0.8.19;


struct PokemonInfo {
    address pokemonAddress;
    string id;
    string imgUrl;
}

struct CollectionInfo {
  int id;
  string name;
  string code;
  string imgUrl;
  int cardCount;
}