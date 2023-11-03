import React from 'react'
import { useEffect, useState } from 'react'
import { PokemonCard, PokemonList } from '../pokemon-list/PokemonList.component'
import {
  getAllCollectionsMetadata,
  getCollectionById,
} from '@/services/api-service/pokemon.service'
import { Link, useParams } from 'react-router-dom'
import './PokemonCollectionPresenter.style.css'

const PokemonCollection = props => {
  const name: string = props.data.name
  const size: number = props.data.size
  const code: string = props.data.code
  const id: string = props.data.id
  const imgUrl: string = props.data.imgUrl

  return (
    <div className="pokemon-collection">
      <h3>
        {name} ({size})
      </h3>
      <img src={imgUrl} />
    </div>
  )
}

const PokemonCollectionsPresenter = props => {
  const [collectionsMetadata, setCollectionsMetadata] = useState([])
  const wallet = props.wallet

  const formatCollection = (collection: any) => {
    const id = collection[0]._isBigNumber
      ? collection[0].toNumber()
      : collection[0]
    const name = collection[1]
    const code = collection[2]
    const imgUrl = collection[3]
    const size = collection[4]._isBigNumber
      ? collection[4].toNumber()
      : collection[4]

    return { id, name, code, imgUrl, size }
  }

  const addCollectionsMetadata = (collection: any) => {
    setCollectionsMetadata(collectionsMetadata => [
      ...collectionsMetadata,
      collection,
    ])
  }

  useEffect(() => {
    console.log('liste des collections')
    wallet?.contract.allCollections().then((collections: any[]) => {
      collections.forEach(collection => {
        addCollectionsMetadata(formatCollection(collection))
      })
    })
  }, [])

  return (
    <div>
      <h2>Collections</h2>
      <div className="pokemon-collections-presenter">
        {collectionsMetadata.map((collectionMetaData, index) => (
          <Link key={index} to={`/collection/${collectionMetaData.id}`}>
            <PokemonCollection key={index} data={collectionMetaData} />
          </Link>
        ))}
      </div>
    </div>
  )
}

const PokemonCollectionPresenter = props => {
  const [cards, setCards] = useState([])
  const { id } = useParams()
  const wallet = props.wallet
  console.log('id = ' + id)

  const appendToCards = (data: any) => {
    setCards(cards => [...cards, data])
  }

  const formatPokemonData = (pokemonData: any) => {
    const address: string = pokemonData[0]
    const id: string = pokemonData[1]
    const imgUrl: string = pokemonData[2]
    return { address, id, imgUrl }
  }

  useEffect(() => {
    wallet?.contract.allPokemonsOfCollection(id).then((pokemons: any) => {
      pokemons.forEach((pokemon: any) =>
        appendToCards(formatPokemonData(pokemon))
      )
    })
  }, [])

  console.log('[from pokemon collection presenter]')

  console.log(cards)

  return (
    <div className="pokemon-collection-presenter">
      <PokemonList cards={cards} />
    </div>
  )
}

export { PokemonCollectionsPresenter, PokemonCollectionPresenter }
