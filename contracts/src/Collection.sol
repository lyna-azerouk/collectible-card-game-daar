// SPDX-License-Identifier: MIT
//pragma solidity  >=0.5.0 <0.6.0;
pragma solidity ^0.8.19;

import "./Ownable.sol";
import "./ERC721.sol";
import "./Pokemon.sol";
import "./Struct.sol";

contract Collection {
  string public name;
  string public code;
  string public imgUrl;
  int public cardCount; //taile de la colection
  mapping(int => Pokemon) public pokemons;

  constructor(
    string memory _name, 
    int _cardCount, 
    string memory _code, 
    string memory _imgUrl) {

    name = _name;
    cardCount = _cardCount;
    code = _code;
    imgUrl = _imgUrl;
  }

  function addCard(string memory id, string memory pokemonImgUrl) public {
    Pokemon p = new Pokemon(id, pokemonImgUrl);
    pokemons[cardCount++] = p;
  }

  function pokemonsData() public view returns (Pokemon[] memory) {
    Pokemon[] memory pokemonsResult = new Pokemon[](uint256(cardCount));
    uint256 iUint = 0;
    for (int i = 0; i < cardCount; i++) {
      pokemonsResult[iUint] = pokemons[i];
      iUint++;
    }
    return pokemonsResult;
  }

  function getName() public view returns (string memory) {
    return name;
  }

  function getCode() public view returns (string memory) {
    return code;
  }

  function getImgUrl() public view returns (string memory) {
    return imgUrl;
  }

  function getPokemons() public view returns (address[] memory) {
    address[] memory pokemonsResult = new address[](uint256(cardCount));
    uint256 iUint = 0;
    for (int i = 0; i < cardCount; i++) {
      pokemonsResult[iUint] = address(pokemons[i]);
      iUint++;
    }
    return pokemonsResult;
  }

  function mintAux(
    address receiver,
    address pokemonAdress
  ) public returns (bool) {
    for (int i = 0; i < cardCount; i++) {
      // pokemon trouver.
      if (address(pokemons[i]) == pokemonAdress) {
        // est ce qu'il est libre ?
        if (!pokemons[i].hasOwner()) {
          // si oui, on mint.
          pokemons[i].setOwner(receiver);
        }
      }
    }
  }

  function userCards(
    address owner
  ) public view virtual returns (Pokemon[] memory) {
    uint256 numberCardsUser = balanceOf((owner));
    Pokemon[] memory allcards = new Pokemon[](numberCardsUser);
    uint256 index = 0;
    for (int i = 0; i < cardCount; i++) {
      if (pokemons[i].owner() == owner) {
        allcards[index] =pokemons[i];
        index++;
      }
    }

    return allcards;
  }

  function balanceOf(address _owner) public view virtual returns (uint256) {
    uint256 count = 0;
    for (int i = 0; i < cardCount; i++) {
      if (pokemons[i].owner() == _owner) {
        count++;
      }
    }
    return count;
  }

  function ownerOf(address _tokenId) public view virtual returns (address) {
    for (int i = 0; i < cardCount; i++) {
      if (address(pokemons[i]) == _tokenId) {
        return pokemons[i].owner();
      }
    }
    return address(0);
  }

  function allPoekmons() public view virtual returns (string[] memory) {
    string[] memory result = new string[](uint256(cardCount));
    uint256 index = 0;
    for (int i = 0; i < cardCount; i++) {
      result[index] = pokemons[i].getId();
      index++;
    }
    return result;
  }

  function pokemonFromadress(
    address adressPokemon
  ) public view returns (string memory) {
    for (int i = 0; i < cardCount; i++) {
      if (adressPokemon == address(pokemons[i])) {
        return pokemons[i].getId();
      }
    }
    return "";
  }

  function getCard(int indice) public returns (Pokemon) {
    return pokemons[indice];
  }
}
