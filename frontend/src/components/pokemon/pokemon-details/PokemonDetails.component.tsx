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
      <PokemonCardDetail data={pokemonData} currentUser={props.currentUser} />
    </div>
  )
}

const AddCarteToUser = () => {
  wallet?.contract.mint(wallet?.details.account, pokemonData.address)
}

const PokemonCardDetail = (props: any) => {
  const pokemonData = props.data
  console.log('[from pokemon details =]')
  console.log(pokemonData)

  const getAppropriateButton = () => {
    const button1 = (
      <button className="btn btn-primary" onClick={AddCarteToUser => {}}>
        mint
      </button>
    )

    const button2 = (
      <button className="btn btn-primary" onClick={() => {}}>
        buy
      </button>
    )

    const button3 = (
      <button className="btn btn-primary" onClick={() => {}}>
        renounce ownership
      </button>
    )

    const pokemonOwnerByCurrentUser = props.currentUser === pokemonData.owner
    const pokemonIsFree = false

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
