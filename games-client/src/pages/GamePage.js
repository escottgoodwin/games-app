import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import { baseUrl, postRequest } from '../util'

import '../App.css';

import GameFinal from '../components/GameFinal'
import GameInnings from '../components/GameInnings'
import Error from '../components/Error'

export default function GamesPage() {
  const { gameId } = useParams()
  const [ game, setGame ] = useState({})
  const [ innings, setInnings ] = useState([])
  const [ error, setError ] =useState(false)

  useEffect(() => {

    async function getGame(){
      const gameUrl = baseUrl + '/gamedb'
      try{
        const {game, innings} = await postRequest(gameUrl,{gameId})
        setGame(game)
        setInnings(innings)
      } catch(e){
        setError(true)
      }
    }

    getGame()
  },[gameId])
  return (
    <div>
      <Error error={error} message='Error getting game data!' />
      {!error &&
        <div>
        <GameFinal game={game} />
        <GameInnings innings={innings} />
        </div>
      }
    </div>
  );
}