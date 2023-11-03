// SPDX-License-Identifier: MIT
//pragma solidity >=0.5.0 <0.6.0;

pragma solidity ^0.8.19;

import "./Collection.sol";
import "./PokemonOwenrship.sol";
import "./Booster.sol";
import "./Struct.sol";

contract Main is PokemonOwenership {
  address private admin;
  mapping (int => Booster) boosters;
  int boostersCount =0;

  constructor() {
    admin = msg.sender;
  }

  function createCollection(
    string memory name,
    string memory code,
    string memory imgUrl
  ) external returns (Collection) {
    Collection collection = new Collection(name, 0, code, imgUrl);
    pokemonCollections[collectionCount] = collection;

    collectionCount++;

    return collection;
  }

  function allPokemonsFrom(
    int collectionId
  ) public view returns (address[] memory) {
    return pokemonCollections[collectionId].getPokemons();
  }

  function addCardToCollection(
    int collectionId,
    string memory pokemonId,
    string memory imgUrl
  ) external returns (bool) {
    pokemonCollections[collectionId].addCard(pokemonId, imgUrl);
    return true; // s'assurer que la carte a bien été inseree
  }

  function collectionsCodes() public view returns (string[] memory) {
    string[] memory codes = new string[](uint256(collectionCount));

    uint256 iUint = 0;
    for (int i = 0; i < collectionCount; i++) {

      codes[iUint] = pokemonCollections[i].getCode();
      iUint++;
    }
    return codes;
  }

  /** Convert Pokemon object to PokemonInfo object
   * Extract info from Pokemon object.
   * @param collectionId id de la collection
   * @param collection collection
   */
  function collectionToCollectionInfo(
    int collectionId,
    Collection collection
  ) public view returns (CollectionInfo memory) {
    return
      CollectionInfo(
        collectionId,
        collection.getName(),
        collection.getCode(),
        collection.getImgUrl(),
        collection.cardCount()
      );
  }

  function allCollections() public view returns (CollectionInfo[] memory) {
    CollectionInfo[] memory collectionsResult = new CollectionInfo[](
      uint256(collectionCount)

    );
    uint256 iUint = 0;
    for (int i = 0; i < collectionCount; i++) {

      collectionsResult[iUint] = collectionToCollectionInfo(
        i,
        pokemonCollections[i]
      );
      iUint++;
    }
    return collectionsResult;
  }

  function getAllPokemons() public view returns (PokemonInfo[] memory) {
    // retrive just pokemon of collection 0
    Collection collection = pokemonCollections[0];
    Pokemon[] memory pokemons = collection.pokemonsData();
    PokemonInfo[] memory pokemonsResult = new PokemonInfo[](
      uint256(collection.cardCount())
    );
    uint256 iUint = 0;
    for (int i = 0; i < collection.cardCount(); i++) {
      pokemonsResult[iUint]= pokemonToPokemonInfo(pokemons[iUint]);
      iUint++;
    }
    return pokemonsResult;
  }

  function pokemonToPokemonInfo(
    Pokemon pokemon
  ) public view returns (PokemonInfo memory) {
    return PokemonInfo(
      address(pokemon), 
      pokemon.getId(), 
      pokemon.getImgUrl(), 
      pokemon.owner());
  }

  function allPokemonsOfCollection(
    int collectionId
  ) public view returns (PokemonInfo[] memory) {
    Collection collection = pokemonCollections[collectionId];
    Pokemon[] memory pokemons = collection.pokemonsData();
    PokemonInfo[] memory pokemonsResult = new PokemonInfo[](
      uint256(collection.cardCount())
    );
    uint256 iUint = 0;
    for (int i = 0; i < collection.cardCount(); i++) {
      pokemonsResult[iUint]= pokemonToPokemonInfo(pokemons[iUint]);
      iUint++;
    }
    return pokemonsResult;
  }

  function allCardsUser(
    address _owner
  ) public view virtual returns (PokemonInfo[] memory) {
    uint256 cardCount = balanceOf(_owner);
    PokemonInfo[] memory userPokemons = new PokemonInfo[]((cardCount));
    Pokemon[] memory result;
    uint256 j = 0;
    for (int i = 0; i < collectionCount; i++) {

      Collection collection = pokemonCollections[i];
      result = (collection.userCards(_owner));
      uint256 index = 0;
      while (index < result.length) {
        userPokemons[j] = pokemonToPokemonInfo(result[index]);
        index++;
        j++;
      }
    }
    return userPokemons;
  }

  /*function createBoosters() external {
    boosters[boostersCount]= new Booster(c);
     boostersCount++;
  }*/


}