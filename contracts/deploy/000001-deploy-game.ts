import 'dotenv/config'
import { DeployFunction } from 'hardhat-deploy/types'
import { getAllCards, getAllCollections } from '../services/pokemon.service'

/**
 * creation des collections 
 */
const deployer: DeployFunction = async hre => {
  if (hre.network.config.chainId !== 31337) return
  const { deployer } = await hre.getNamedAccounts()
  await hre.deployments.deploy('Main', { from: deployer, log: false })
  const main = await hre.ethers.getContract("Main",deployer)
  const collections0 = getCollectionFromApi();
  collections0.slice(0, 5).forEach(async collection => {
      await main.createCollection(collection.name, collection.code, collection.img);
  })    

  let collectionsCode : any[] = await main.collectionsCodes();
  /**   
   * Rajout des pokemons from api to collections
   */ 

  setTimeout(async () => {
    //ajout des pokemons dans la blockchain
    const pokemons = getPokemonFromApi();
    pokemons.forEach(pokemon => {
      if (collectionsCode.includes(pokemon.set)) {
        const position = collectionsCode.indexOf(pokemon.set);
        main.addCardToCollection(position, pokemon.id, pokemon.imgUrl)
      }
    })
  }, 5000);

  setTimeout(async () => {
    collectionsCode.forEach(async (code: any, collectionId: number) => {
      main.allPokemonsOfCollection(collectionId).then((pokemons: any[]) => {
        const pokemonsAddress:string[] = pokemons.map(pokemon => pokemon[0]);
        main.createBooster(collectionId, pokemonsAddress);
      })
    })
  
  }, 7000);
  
}

const getCollectionFromApi = () => {
  return getAllCollections()
}   
   
const getPokemonFromApi = () =>{
  return getAllCards()
}

export default deployer