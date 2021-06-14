import { Link } from 'react-router-dom'
import React from 'react'
import PropTypes from 'prop-types';

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
    game_id,
    tableStyle,
  }){
      const { homeColor, awayColor } = scoreColors({away_score,home_score})
      const link = `/game/${game_id}`
      return(
      <div className={tableStyle}>
        <table className="game-table" >
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
      </div>
      )
    }

GameRow.propTypes = {
  name: PropTypes.string,
  away_score: PropTypes.string,
  home_score: PropTypes.string, 
  formattedDate: PropTypes.string, 
  home_name: PropTypes.string,
  team_name: PropTypes.string, 
  game_id: PropTypes.string,
};