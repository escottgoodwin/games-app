import React from 'react'

import {ScoreRow, scoreColors} from '../components/GamesList1'

export default function GameInnings({innings}){
    return(
        <div>
          <h3>Box Score</h3>
          {innings.map(inn => 
              <InningRow key={inn.inning} {...inn} />
          )}
        </div>
    )
}

function InningRow({inning, away_score, home_score, home_team, away_team}){
    const { homeColor, awayColor } = scoreColors({away_score,home_score})
    return(
      <table >
        <tbody>
          <tr>
            <td align="center" colSpan="2" className="game-date">
              <h3>
                Inning {inning}
              </h3> 
            </td>
          </tr>
          <ScoreRow 
            name={home_team}
            score={home_score}
            color={homeColor}
          />
          <ScoreRow 
            name={away_team}
            score={away_score}
            color={awayColor}
          />
          <tr className="bottom-border">
            <td ></td>
          </tr>
        </tbody>
      </table>
    )
  }