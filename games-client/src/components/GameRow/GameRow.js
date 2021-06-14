import { Link } from 'react-router-dom'
import React from 'react'

import ScoreRow from '../ScoreRow/ScoreRow'

export function scoreColors({away_score,home_score}){
  const homeColor = parseInt(home_score, 10) > parseInt(away_score, 10) ? "winner" : "loser";
  const awayColor = parseInt(home_score, 10) < parseInt(away_score, 10) ? "winner" : "loser";
  return { homeColor, awayColor }
}

export default function GameRow({
    away_score, 
    home_score, 
    formattedDate, 
    home_name, 
    team_name, 
    game_id
  }){
      const { homeColor, awayColor } = scoreColors({away_score,home_score})
      const link = `/game/${game_id}`
      const gameDay = formattedDate;
      return(
        <table >
          <tbody>
            <tr>
              <td align="center" colSpan="2" className="game-date">
                <Link className="link-style" to={link}>
                  {gameDay}
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