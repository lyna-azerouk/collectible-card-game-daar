import { useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from './components/home/Home.component'
import Layout from './pages/Layout'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import { getAllPokemon } from './services/api-service/pokemon.service'
import User from './components/user/User.component'
import PokemonDetails from './components/pokemon/pokemon-details/PokemonDetails.component'
import {
  PokemonCollectionPresenter,
  PokemonCollectionsPresenter,
} from './components/pokemon/pokemon-collection/PokemonCollection.component'

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
  const [name, setName] = useState('')

  const wallet = useWallet()

  useEffect(() => {
    setName('name')
  }, [wallet])

  const addToPokemonsData = (pokemon: any) => {
    const currentPokemonsData = pokemonsData
    currentPokemonsData[pokemon.id] = pokemon
    setPokemonsData(currentPokemonsData)
  }

  const getPokemonInfoById = (id: string) => {
    return pokemonsData[id]
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home wallet={wallet} />} />
          <Route path="me" element={<User wallet={wallet} />} />
          <Route
            path="collections"
            element={<PokemonCollectionsPresenter wallet={wallet} />}
          />
          <Route
            path="/pokemon/:id"
            element={<PokemonDetails getPokemonInfoById={getPokemonInfoById} />}
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
