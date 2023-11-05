// SPDX-License-Identifier: MIT
//pragma solidity >=0.5.0 <0.6.0;

pragma solidity ^0.8.19;

import "./Collection.sol";
import "./PokemonOwenrship.sol";
import "./Struct.sol";

contract Main is PokemonOwenership {
  address private admin;
  mapping (int => Booster) private boosters;
  int private boostersCount = 0;
  uint256 private _pokemonCount = 0;

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
    _pokemonCount++;
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
      uint256(collectionCount));
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
    return allPokemons();
  }

  function allPokemons() private view returns (PokemonInfo[] memory) {
    PokemonInfo[] memory pokemonsResult = new PokemonInfo[](
      uint256(pokemonCount()));
    uint256 iUint = 0;
    for (int i = 0; i < collectionCount; i++) {
      Collection collection = pokemonCollections[i];
      Pokemon[] memory pokemons = collection.pokemonsData();
      uint256 j_uint = 0;
      for (int j = 0; j < collection.cardCount(); j++) {
        pokemonsResult[iUint] = pokemonToPokemonInfo(pokemons[j_uint]);
        iUint++;
        j_uint++;
      }
    }
    return pokemonsResult;
  }

  function pokemonCount() private view returns (uint256) {
    return _pokemonCount;
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

  function createBooster(
    int collectionId,
    address[] memory cardsIds
  ) external returns (Booster memory) {
    Booster memory booster = Booster(collectionId, cardsIds);
    boosters[boostersCount] = booster;
    boostersCount++;
    return booster;
  }


  function getBoosters() public view returns (Booster[] memory)
  {
    Booster[] memory boostersResult = new Booster[](
      uint256(boostersCount));
    uint256 iUint = 0;
    for (int i = 0; i < boostersCount; i++) {
      boostersResult[iUint] = boosters[i];
      iUint++;
    }
    return boostersResult;
  }

  function openBoosterFor(int boosterId, address usrAddress) external returns (bool) {
    // user which open the booster become the owner of the cards
    Booster memory booster = boosters[boosterId];
    for (uint256 i = 0; i < booster.cardsIds.length; i++) {
      address cardId = booster.cardsIds[i];
      mint(usrAddress, cardId);
    }
    // delete booster
    delete boosters[boosterId];
    return true;
  }

  function getPokemonInfo(address pokemonAddress) public view returns (PokemonInfo memory) {
    // find pokemon in all collections
    for (int i = 0; i < collectionCount; i++) {
      Collection collection = pokemonCollections[i];
      Pokemon[] memory pokemons = collection.pokemonsData();
      uint256 j_uint = 0;
      for (int j = 0; j < collection.cardCount(); j++) {
        if (address(pokemons[j_uint]) == pokemonAddress) {
          return pokemonToPokemonInfo(pokemons[j_uint]);
        }
        j_uint++;
      }
    }
    
  }

  function abandonPokemon(address pokemonAddress) external returns(bool) {
    for (int i = 0; i < collectionCount; i++) {
      Collection collection = pokemonCollections[i];
      Pokemon[] memory pokemons = collection.pokemonsData();
      uint256 j_uint = 0;
      for (int j = 0; j < collection.cardCount(); j++) {
        if (address(pokemons[j_uint]) == pokemonAddress) {
          pokemons[j_uint].renounceOwnershipFor(msg.sender);
          return true;
        }
        j_uint++;
      }
    }
    return false;
  }


}