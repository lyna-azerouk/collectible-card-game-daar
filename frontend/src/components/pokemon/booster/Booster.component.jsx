import React, { useEffect, useState } from 'react'
import { PokemonList } from '../pokemon-list/PokemonList.component';
import { getPokemonById } from '@/services/api-service/pokemon.service';

export const Booster = (props) => {

    return (
        <div>
            <PokemonList cards={props.data.pokemons} />
        </div>
    )
}


export const BoostersList = (props) => {
    const boosters = props.boosters;
    
    return (
        <div>
            {
                boosters.map((booster) => (
                    <Booster data={booster} />
                ))
            }
        </div>
    )
}