import React, { useEffect, useId, useState } from 'react'
import { useParams } from 'react-router-dom'
import './PokemonDetails.style.css'

const PokemonDetails = props => {
  const [pokemonData, setPokemonData] = useState({})
  const { id } = useParams()

  useEffect(() => {
    const pokemonInfo = props.getPokemonInfoById(id)
    setPokemonData(pokemonInfo)
  }, [])

  return (
    <div>
      <PokemonCardDetail
        data={pokemonData}
        currentUser={props.currentUser}
        mintPokemon={props.mintPokemon}
        buyPokemon={props.buyPokemon}
        renouncePokemonOwnership={props.renouncePokemonOwnership}
      />
    </div>
  )
}

const PokemonCardDetail = (props: any) => {
  const pokemonData = props.data

  const mintPokemon = () => {
    props.mintPokemon(pokemonData.address)
  }

  const buyPokemon = () => {
    props.buyPokemon()
  }

  const renouncePokemonOwnership = () => {
    props.renouncePokemonOwnership()
  }

  const getAppropriateButton = () => {
    const button1 = (
      <button className="btn btn-primary" onClick={mintPokemon}>
        mint
      </button>
    )

    const button2 = (
      <button className="btn btn-primary" onClick={buyPokemon}>
        buy
      </button>
    )

    const button3 = (
      <button className="btn btn-primary" onClick={renouncePokemonOwnership}>
        renounce ownership
      </button>
    )

    const pokemonOwnerByCurrentUser = props.currentUser === pokemonData.owner
    const pokemonIsFree =
      pokemonData.owner === '0x0000000000000000000000000000000000000000'

    if (pokemonIsFree) {
      return button1
    } else if (pokemonOwnerByCurrentUser) {
      // use can renounce ownership
      return button3
    }

    return button2
  }

  return (
    <div className="pokemon-card-details">
      <img
        src={props.data.imgUrl}
        alt={props.data.name}
        className="pokemon-card-details-img"
      />
      <div className="pokemon-card-details-desc">
        <h4>Description</h4>
        <div>details</div>
        <div>{getAppropriateButton()}</div>
      </div>
    </div>
  )
}

export default PokemonDetails
