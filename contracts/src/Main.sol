// SPDX-License-Identifier: MIT
//pragma solidity >=0.5.0 <0.6.0;

pragma solidity ^0.8.19;

import "./Collection.sol";
import "./PokemonOwenrship.sol";
import "./Booster.sol";

contract Main is PokemonOwenership {
  address private admin;

  constructor() {
    admin = msg.sender;
  }

  function createCollection2(
    string memory name,
    string memory code
  ) external returns (Collection) {
    Collection collection = new Collection(name, 0, code);
    pokemonCollections[collectionCount] = collection;
    collectionCount++;
    return collection;
  }

  function allPokemonsFrom(
    int collectionId
  ) public view returns (address[] memory) {
    return pokemonCollections[collectionId].getPokemons();
  }

  function createPokemon2(
    string memory id,
    string memory imgUrl
  ) public returns (Pokemon) {
    Pokemon p = new Pokemon(id, imgUrl);
    return p;
  }

  function addCardToCollection(
    int collectionId,
    string memory pokemonId,
    string memory imgUrl
  ) external returns (bool) {
    pokemonCollections[collectionId].addCard(pokemonId, imgUrl);
    return true; // s'assurer que la carte a bien été inseree
  }

  function allCollections() public view returns (string[] memory) {
    Collection[] memory collections = new Collection[](
      uint256(collectionCount)
    );
    string[] memory codes = new string[](uint256(collectionCount));
    uint256 counter = 0;
    for (int i = 0; i < collectionCount; i++) {
      collections[counter] = pokemonCollections[i];
      codes[counter] = pokemonCollections[i].code();
      counter++;
    }
    return codes;
  }

  function allPokemonsOfCollection(
    int collectionId
  ) public view returns (string[] memory) {
    Collection collection = pokemonCollections[collectionId];
    return collection.allPoekmons();
  }

  function allCardsUser(
    address _owner
  ) public view virtual returns (string[] memory) {
    uint256 cardCount = balanceOf(_owner);
    string[] memory pokemonsUser = new string[]((cardCount));
    string[] memory result;
    uint256 j = 0;
    for (int i = 0; i < collectionCount; i++) {
      Collection collection = pokemonCollections[i];
      result = (collection.allCardsUser(_owner));
      uint256 index = 0;
      while (index < result.length) {
        pokemonsUser[j] = result[index];
        index++;
        j++;
      }
    }
    return pokemonsUser;
  }

  function createBooster(address[] memory cardIds) external {}
}
