import React from 'react'
import { useEffect, useState } from 'react'
import { PokemonCard, PokemonList } from '../pokemon-list/PokemonList.component'
import {
  getAllCollectionsMetadata,
  getCollectionById,
} from '@/services/api-service/pokemon.service'
import { Link, useParams } from 'react-router-dom'
import './PokemonCollectionPresenter.style.css'
import { formatCollection, formatPokemonData } from '@/utile'

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

  const addCollectionsMetadata = (collection: any) => {
    setCollectionsMetadata(collectionsMetadata => [
      ...collectionsMetadata,
      collection,
    ])
  }

  useEffect(() => {
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

  const appendToCards = (data: any) => {
    setCards(cards => [...cards, data])
  }

  useEffect(() => {
    wallet?.contract.allPokemonsOfCollection(id).then((pokemons: any) => {
      pokemons.forEach((pokemon: any) => {
        appendToCards(formatPokemonData(pokemon))
        props.savePokemonData(formatPokemonData(pokemon))
      })
    })
  }, [])

  return (
    <div className="pokemon-collection-presenter">
      <PokemonList cards={cards} />
    </div>
  )
}

export { PokemonCollectionsPresenter, PokemonCollectionPresenter }
