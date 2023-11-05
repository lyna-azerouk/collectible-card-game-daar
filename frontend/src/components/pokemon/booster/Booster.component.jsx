import React, { useEffect, useState } from 'react'
import { PokemonList } from '../pokemon-list/PokemonList.component';
import { getPokemonById } from '@/services/api-service/pokemon.service';
import { BOOSTER_IMG } from '@/const';
import './booster.styles.css';

export const Booster = (props) => {

    const openBooster = () => {
        console.log('open booster');
    }

    return (
        <div className='booster'>
            <img src={BOOSTER_IMG} />
            <div>
                <button onClick={openBooster}>
                    Open
                </button>
            </div>
        </div>
    )
}


export const BoostersList = (props) => {
    const boosters = props.boosters;
    
    return (
        <div className='booster-list'>
            {
                boosters.map((booster) => (
                    <Booster data={booster} />
                ))
            }
        </div>
    )
}