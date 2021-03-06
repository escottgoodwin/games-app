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
  teamName,
  border,
}){
    const nameTeam = teamName ? teams[teamName].team_name : ''
    const tableStyle = border ? 'game-score-border' : ''
    return(
      <div>
      {games.length>0 &&
        <div>
          <h2 className="App-link">
            {nameTeam}
          </h2>
            {games.map((g,i) => 
              <GameRow 
                tableStyle={tableStyle}
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