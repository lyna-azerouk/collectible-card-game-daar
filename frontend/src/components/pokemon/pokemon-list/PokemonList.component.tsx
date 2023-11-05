import POKEMON_IMG_SAMPLE from '@/const'
import React from 'react'
import './PokemonList.css' // Import your CSS file
import { Link } from 'react-router-dom'

const PokemonCard = (props: any) => {
  return (
    <div className="pokemon-card">
      <img
        src={props.data.imgUrl ?? POKEMON_IMG_SAMPLE}
        alt={props.data.name}
        className="pokemon-image"
      />
      <div className="pokemon-name">{props.data.name}</div>
    </div>
  )
}

const PokemonList = props => {
  const listeDeCartes = props.cards ?? []
  const cartes = Object.values(listeDeCartes)
  return (
    <div className="pokemon-list-container">
      <ul className="pokemon-list">
        {cartes.map((data, index) => (
          <li key={index}>
            <Link to={`/pokemon/${data.id}`}>
              {' '}
              <PokemonCard data={data} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PokemonList, PokemonCard }
