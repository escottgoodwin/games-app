import { Link } from 'react-router-dom'
import React from 'react'

export function scoreColors({away_score,home_score}){
  const homeColor = parseInt(home_score, 10) > parseInt(away_score, 10) ? "winner" : "loser";
  const awayColor = parseInt(home_score, 10) < parseInt(away_score, 10) ? "winner" : "loser";
  return { homeColor, awayColor }
}

export default function GamesList({games,teams,teamName}){
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

export function GameRow({away_score, home_score, formattedDate, home_name, team_name, game_id}){
    const { homeColor, awayColor } = scoreColors({away_score,home_score})
    const link = `/game/${game_id}`
    return(
      <table >
        <tbody>
          <tr>
            <td align="center" colSpan="2" className="game-date">
              <Link className="link-style" to={link}>
                {formattedDate}
              </Link>
            </td>
          </tr>
          <ScoreRow 
            name={home_name}
            score={home_score}
            color={homeColor}
          />
          <ScoreRow 
            name={team_name}
            score={away_score}
            color={awayColor}
          />
          <tr className="bottom-border">
            <td></td>
          </tr>
        </tbody>
      </table>
    )
  }

 export function ScoreRow({name, score, color}){
    return(
      <tr>
        <td className={color}>
          {name}
          </td>
        <td className={color}>
          {score}
        </td>
      </tr>
    )
  }