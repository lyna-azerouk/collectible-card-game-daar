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
      <PokemonCardDetail data={pokemonData} />
    </div>
  )
}

const PokemonCardDetail = (props: any) => {
  const pokemonData = props.data
  console.log('[from pokemon details =]')
  console.log(pokemonData)

  return (
    <div className="pokemon-card-details">
      <img
        src={props.data.imgUrl}
        alt={props.data.name}
        className="pokemon-card-details-img"
      />
      <div className="pokemon-card-details-desc">{pokemonData.imgUrl}</div>
    </div>
  )
}

export default PokemonDetails
