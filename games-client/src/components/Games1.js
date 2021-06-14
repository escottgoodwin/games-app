import React, {useState, useEffect} from 'react'

import { baseUrl, postRequest, getRequest } from '../util'

import TeamSearch from './TeamSearch1'
import GamesList from './GamesList1'
import Error from '../components/Error'

export default function Games(){

    const [ teams, setTeams ] = useState([])
    const [ games, setGames ] = useState([])
    const [ team, setTeam ] = useState('')
    const [ teamName, setTeamName ] = useState('')
    const [ gameNumber, setGameNumber ] = useState(0)
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
  
    async function getGames(){
      setLoading(true)
      setError(false)
      const sportsUrl = baseUrl + '/gamesdb'
      try{
        const games = await postRequest(sportsUrl,{team, gameNumber})
        setLoading(false)
        setGames(games)
      } catch(e){
        setError(true)
        setLoading(false)
      }
    }
  
    const handleSearch = () => getGames()

    const handleGameNumber = e => setGameNumber(e.target.value)
  
    const handleTeam = (e) => {
      setTeam(e.target.value)
      setTeamName(e.nativeEvent.target.selectedIndex)
      setGames([])
    }
  
    useEffect(() => {
      async function getTeams(){
        const url = baseUrl+'/teamsdb'
        const teams = await getRequest(url)
        setTeams(teams)
      }
      getTeams()
    },[])

    return(
      <>
       <TeamSearch
          teams={teams} 
          handleTeam={handleTeam} 
          handleGameNumber={handleGameNumber} 
          loading={loading} 
          handleSearch={handleSearch}
       />
      <Error error={error} message='Error getting game data!' />
      {!error &&
        <GamesList 
          teams={teams} 
          games={games} 
          teamName={teamName} 
        />
       }
     </>
    )
  }
