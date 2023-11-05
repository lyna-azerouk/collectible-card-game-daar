import React, { useEffect, useState } from 'react'
import { PokemonList } from '../pokemon/pokemon-list/PokemonList.component'

const User = (props: any) => {
  const [name, setName] = useState('')

  useEffect(() => {
    const user_adress = props.wallet?.details?.account
    setName(user_adress)
  }, [])

  return (
    <div>
      <h1>Welcome {name}</h1>
      <h2>Your Pokemons</h2>
      <PokemonList cards={props.myPokemons} />
    </div>
  )
}

export default User
