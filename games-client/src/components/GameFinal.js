import React from 'react'

import {GameRow} from './GamesList1'

export default function GameFinal({game}){
    return(
        <GameRow 
            home_name={game.away_team}
            team_name={game.home_team}
            {...game}
        />
    )
}