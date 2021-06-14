import React from 'react'

import GameRow from '../GameRow/GameRow'

export function scoreColors({away_score,home_score}){
  const homeColor = parseInt(home_score, 10) > parseInt(away_score, 10) ? "winner" : "loser";
  const awayColor = parseInt(home_score, 10) < parseInt(away_score, 10) ? "winner" : "loser";
  return { homeColor, awayColor }
}

export default function GamesList({
  games,
  teams,
  teamName
}){
    const nameTeam = teamName ? teams[teamName].team_name : ''
    return(
      <div>
      {games.length>0 &&
        <div>
          <h2 className="App-link">
            {nameTeam}
          </h2>
            {games.map((g,i) => 
              <GameRow 
                key={i} 
                home_name={nameTeam} 
                {...g}
              />
            )}
        </div>           
      }
    </div>
  )
}