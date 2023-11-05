import React, { useEffect, useState } from 'react'
import { PokemonList } from '../pokemon-list/PokemonList.component'
import { getPokemonById } from '@/services/api-service/pokemon.service'
import { BOOSTER_IMG } from '@/const'
import './booster.styles.css'

export const Booster = props => {
  const setAnnounce = props.setAnnounce

  const openBooster = () => {
    props.openBoosterById(props.data.id).then(res => {
      console.log(props.data)
      announceOpenedBooster()
    })
  }

  const announceOpenedBooster = () => {
    console.log('anoucing....')

    let pokemonsId: string[] = []
    props.data.pokemons.map(pokemon => {
      pokemonsId.push(pokemon.id)
    })
    if (pokemonsId.length !== 0) {
      setAnnounce(`You opened a booster with: ${pokemonsId.join(', ')}`)
    } else {
      setAnnounce('You opened a booster with no pokemons in it')
    }
  }

  return (
    <div className="booster">
      <img src={BOOSTER_IMG} />
      <div>
        <button onClick={openBooster}>Open</button>
      </div>
    </div>
  )
}

export const BoostersList = props => {
  const [announce, setAnnounce] = useState('')
  const boosters = props.boosters

  return (
    <div className="booster-presenter">
      <div className="announce">
        <h3>Announce</h3>
        <p>{announce}</p>
      </div>
      <div className="booster-list">
        {boosters.map(booster => (
          <Booster
            data={booster}
            openBoosterById={props.openBoosterById}
            setAnnounce={setAnnounce}
          />
        ))}
      </div>
    </div>
  )
}
