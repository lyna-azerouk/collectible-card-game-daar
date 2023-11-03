import 'dotenv/config'
import { DeployFunction } from 'hardhat-deploy/types'
import { getAllCards, getAllCollections } from '../services/pokemon.service'
import { ethers } from 'ethers'

/**
 * creation des collections 
 */
const deployer: DeployFunction = async hre => {
  if (hre.network.config.chainId !== 31337) return
  const { deployer } = await hre.getNamedAccounts()
  await hre.deployments.deploy('Main', { from: deployer, log: true })
  const main = await hre.ethers.getContract("Main",deployer)
  const collections0 = getCollectionFromApi();
  collections0.slice(0, 5).forEach(async collection => {
      await main.createCollection(collection.name, collection.code, collection.img);
  })    

/**      
 * aFIICHAGE DES COLLECTIONS
 */
  let collections : any[] = await main.collectionsCodes();
  /**   
   * Rajout des pokemons from api to collections
   */
  //console.log("verification de la collection")
  //console.log(collections);

  setTimeout(async () => {
    //ajout des pokemons dans la blockchain
    const pokemons = getPokemonFromApi();
    let insertion = 0  
    pokemons.forEach(pokemon => {
      if (collections.includes(pokemon.set)) {
        const position = collections.indexOf(pokemon.set);
        insertion++;
        console.log("insertion de :");
        console.log(pokemon);
        main.addCardToCollection(position, pokemon.id, pokemon.imgUrl)
      }
    })
  }, 5000);

  /**
   * Mint card to user 
   */
  setTimeout(async () => {
    //console.log(" creation de pokemon NFT");
    // retrive the user address
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
          
    let allPokemons : any[] = [];  
    for (let i = 0; i < collections.length; i++) {
      const pokemons = await main.allPokemonsFrom(i);
      //console.log(pokemons)
      allPokemons = allPokemons.concat(pokemons);
    }      
    if (allPokemons.length >= 1) {
        main.mint( userAddress , allPokemons[0]).then(()=>
        main.ownerOf( allPokemons[0]).then(console.log)
      )
    }  
    const displayCollectionsFromBlocchain = () : any => {
      main.allCollections().then((response:any) => {
        console.log("Retrieving all collection from the blockchain");
        response.forEach((collection : any) => {
          const id = collection[0]._isBigNumber ? collection[0].toNumber() : collection[0];
          const name = collection[1];
          const code = collection[2];
          const imgUrl = collection[3];
          const size = collection[4]._isBigNumber ? collection[4].toNumber() : collection[4];
          console.log({ id, name, code, imgUrl, size });
        })
      })
    }
    const displayPokemonsFromBlocchain = () : any =>{
          main.allPokemonsOfCollection(3).then((data :any )=>{
              console.log(data);
          });
    }

  }, 10000);               
}

const getCollectionFromApi = () => {
  return getAllCollections()
}   
   
const getPokemonFromApi = () =>{
  return getAllCards()
}

export default deployer