import React, {useState, useEffect} from 'react'

import { baseUrl, postRequest, getRequest } from '../../util'

import TeamSearch from '../../components/TeamSearch1/TeamSearch1'
import GamesList from '../../components/GamesList1/GamesList1'
import Error from '../../components/Error/Error'

export default function GamesPage(){

    const [ teams, setTeams ] = useState([])
    const [ games, setGames ] = useState([])
    const [ team, setTeam ] = useState('')
    const [ teamName, setTeamName ] = useState('')
    const [ gameNumber, setGameNumber ] = useState(0)
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] =useState(false)
  
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
  
    const handleTeam = (e) => {
      setTeam(e.target.value)
      setTeamName(e.nativeEvent.target.selectedIndex)
      setGames([])
    }
  
    const handleGameNumber = e => setGameNumber(e.target.value)
  
    useEffect(() => {
      async function getTeams(){
        const url = baseUrl+'/teamsdb'
        const teams = await getRequest(url)
        setTeams(teams)
      }
      getTeams()
    },[])
    return(
      <div>
       <TeamSearch
          teams={teams} 
          handleTeam={handleTeam} 
          handleGameNumber={handleGameNumber} 
          loading={loading} 
          handleSearch={handleSearch}
       />
       
       <Error error={error} message='Error getting games!' />
        {!error &&
          <GamesList 
            teams={teams} 
            games={games} 
            teamName={teamName} 
            border={true}
          />
        }
        </div>
    )
  }
