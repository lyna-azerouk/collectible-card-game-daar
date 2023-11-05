import { useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from './components/home/Home.component'
import Layout from './pages/Layout'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import User from './components/user/User.component'
import PokemonDetails from './components/pokemon/pokemon-details/PokemonDetails.component'
import {
  PokemonCollectionPresenter,
  PokemonCollectionsPresenter,
} from './components/pokemon/pokemon-collection/PokemonCollection.component'
import { formatBoosterData, formatPokemonData } from './utile'
import { BoostersList } from './components/pokemon/booster/Booster.component'

// WALLET
type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()

  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}

// END WALLET

export const App = () => {
  const [pokemonsData, setPokemonsData] = useState({})
  const [userPokemons, setUserPokemons] = useState([])
  const [allPokemons, setAllPokemons] = useState({})
  const [boosters, setBoosters] = useState([])

  const wallet = useWallet()

  const mintPokemon = (pokemonAddress: string) => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    wallet?.contract.mint(userAddress, pokemonAddress)
    refreshApp()
  }

  const openBoosterById = (boosterId: number) => {
    const userAddress = wallet?.details?.account || ''
    if (userAddress === '') return
    return wallet?.contract.openBoosterFor(boosterId, userAddress)
  }

  const retrieveAllPokemons = () => {
    wallet?.contract.getAllPokemons().then(pokemons => {
      const formatedPokemons = pokemons.map(formatPokemonData)
      const result = allPokemons
      formatedPokemons.forEach(pokemon => {
        result[pokemon.address] = pokemon
      })
      console.log(result)
      setAllPokemons(result)
    })
  }

  const refreshApp = () => {
    retrieveUserPokemons()
    retrieveBoosters()
    retrieveAllPokemons()
  }

  const retrieveUserPokemons = () => {
    const userAdress: string = wallet?.details?.account || ''
    if (userAdress === '') return
    wallet?.contract.allCardsUser(userAdress).then(pokemons => {
      setUserPokemons(pokemons.map(formatPokemonData))
    })
    const date: string = Date.now().toString()
    console.log(date)
    console.log(userPokemons)
  }

  const retrieveBoosters = () => {
    wallet?.contract.getBoosters().then(boostersData => {
      if (!boostersData) return
      const formatedBoosters = boostersData.map(formatBoosterData)
      const formatedCardsInBoosters = formatedBoosters.map(booster => {
        const cards: any[] = booster.cardsIds.map(
          (cardId: string) => allPokemons[cardId]
        )
        return { id: booster.collectionId, pokemons: cards }
      })
      setBoosters(formatedCardsInBoosters)
    })
    console.log(boosters)
  }

  const buyPokemon = () => {
    console.log('buying pokemon from app')
  }

  const renouncePokemonOwnership = (pokemonAddress: string) => {
    console.log('renouncing pokemon ownership from app')
    wallet?.contract.abandonPokemon(pokemonAddress).then((success: boolean) => {
      if (success) {
        console.log('user renounced ownership of pokemon: ' + pokemonAddress)
        refreshApp()
      }
    })
  }

  useEffect(() => {
    refreshApp()
  }, [])

  const addToPokemonsData = (pokemon: any) => {
    const currentPokemonsData = pokemonsData
    currentPokemonsData[pokemon.id] = pokemon
    setPokemonsData(currentPokemonsData)
  }

  const getPokemonInfoById = (id: string) => pokemonsData[id]

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home wallet={wallet} />} />
          <Route
            path="me"
            element={<User wallet={wallet} myPokemons={userPokemons} />}
          />
          <Route
            path="boosters"
            element={
              <BoostersList
                boosters={boosters}
                openBoosterById={openBoosterById}
              />
            }
          />
          <Route
            path="collections"
            element={<PokemonCollectionsPresenter wallet={wallet} />}
          />
          <Route
            path="/pokemon/:id"
            element={
              <PokemonDetails
                getPokemonInfoById={getPokemonInfoById}
                currentUser={wallet?.details?.account}
                mintPokemon={mintPokemon}
                buyPokemon={buyPokemon}
                renouncePokemonOwnership={renouncePokemonOwnership}
              />
            }
          />
          <Route
            path="/collection/:id"
            element={
              <PokemonCollectionPresenter
                wallet={wallet}
                savePokemonData={addToPokemonsData}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
