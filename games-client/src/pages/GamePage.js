import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { baseUrl, postRequest } from '../util'
import {GameRow, ScoreRow, scoreColors} from '../components/GamesList1'

import '../App.css';
import { useParams } from "react-router-dom";

export default function GamesPage() {
  const { gameId } = useParams()
  const [ game, setGame ] = useState({})
  const [ innings, setInnings ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] =useState(false)

  useEffect(() => {

    async function getGame(){
      const gameUrl = baseUrl + '/gamedb'
      try{
        const {game, innings} = await postRequest(gameUrl,{gameId})
        console.log(innings)
        setGame(game)
        setInnings(innings)
      } catch(e){
        setError(true)
        setLoading(false)
      }
    }
    getGame()
  },[gameId])

  return (
    <div className="App">
      <header className="App-header">
        <Link className="link-style" to="/">
          Home
        </Link>
        {error && <h4 className="loser">Error getting weather</h4>}
        {loading ? <p>Loading...</p> : 
        <table >
          <tbody>
            <GameRow 
              home_name={game.away_team}
              team_name={game.home_team}
              {...game}
            />
          </tbody>
        </table>
      }
        <h3>Box Score</h3>
        {loading ? <p>Loading...</p> : 
        <table >
          <tbody>
            {innings.map(inn => <InningRow key={inn.inning} {...inn} />)}
          </tbody>
        </table>
        }
      </header>
    </div>
  );
}

function InningRow({inning, away_score, home_score, home_team, away_team}){
  const { homeColor, awayColor } = scoreColors({away_score,home_score})
  return(
    <> 
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
    </>
  )
}
