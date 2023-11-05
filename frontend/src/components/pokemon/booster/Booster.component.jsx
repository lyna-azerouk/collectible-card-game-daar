import React, { useEffect, useState } from 'react'
import { PokemonList } from '../pokemon-list/PokemonList.component';
import { getPokemonById } from '@/services/api-service/pokemon.service';
import { BOOSTER_IMG } from '@/const';
import './booster.styles.css';

export const Booster = (props) => {
    const setAnnounce = props.setAnnounce;

    const openBooster = () => {
        const res = props.openBoosterById(props.data.id);
        setAnnounce("res: " + res);
        announceOpenedBooster();

    }

    const announceOpenedBooster = () => {
        const msg = new SpeechSynthesisUtterance();
        msg.text = 'Your are oppening a pokemon booster';
        window.speechSynthesis.speak(msg);
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
    const [announce, setAnnounce] = useState('');
    const boosters = props.boosters;

    return (
        <div className='booster-presenter'>
            <div className='announce'>
                <h3>Announce</h3>
                <p>{announce}</p>
            </div>
            <div className='booster-list'>
                {
                    boosters.map((booster) => (
                        <Booster
                            data={booster}
                            openBoosterById={props.openBoosterById}
                            setAnnounce={setAnnounce}
                        />
                    ))
                }
            </div>
        </div>
    )
}