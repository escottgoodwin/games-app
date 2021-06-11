import {useState, useEffect} from 'react'
import './App.css';

const baseUrl = 'http://localhost:8000'

async function postRequest(url, data){
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); 
}


function Weather(){

  const [ weather, setWeather ] = useState('')
  const [ lat, setLat ] = useState(0)
  const [ lon, setLon ] = useState(0)
  const [ geo, setGeo ] = useState()
  const [ place, setPlace ] = useState('')

  useEffect(() => {
    async function getWeather(){
      navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude}=position.coords
        setLat(latitude)
        setLon(longitude)
        setGeo({latitude, longitude})
      });

      const url = baseUrl + '/weather'
      if(geo){
        try {
          const data = {lat: geo.latitude,lon: geo.longitude}
          const response= await postRequest(url, data)
          const { temp, name } = response
          setWeather(temp)
          setPlace(name)

        } catch(e){
          console.log(e)
        }
    }
  }
    getWeather()
  },[lat,lon,geo])
  return(
    <>
    <h4 className="weather">
      Current Weather {weather}°F {place} 
    </h4>
    </>
  )
}

function ScoreRow({name, score, color}){
  return(
    <tr>
      <td className={color}>
          {name}
        </td>
      <td>
          {score}
      </td>
  </tr>
  )
}

function GameRow({home,homeScore,away,awayScore}){
  const homeColor = homeScore > awayScore ? "winner" : "loser";
  const awayColor = homeScore < awayScore ? "winner" : "loser";
  return(
    <>  
    <ScoreRow 
      name={home}
      score={homeScore}
      color={homeColor}
    />
    <ScoreRow 
      name={away}
      score={awayScore}
      color={awayColor}
    />
    <tr className="bottom-border">
      <td ></td>
    </tr>
    </>
  )
}

const TeamRow = ({code,name}) => <option value={code}>{name}</option>

const Row = ({i}) => <option>{i}</option>

function TeamSearch({handleTeam,teams}){
  return(
    <select name="selectList" id="selectList" onChange={handleTeam}>
      {teams && teams.map(t => <TeamRow key={t.code} {...t} />)}
    </select>
  )
}

function Games({loading, handleSearch, handleTeam, games, teamName, handleGameNumber}){

  const [ teams, setTeams ] = useState([])

  useEffect(() => {
    async function getTeams(){
      const url = baseUrl+'/teams'
      const teams = await fetch(url)
      const teams1 = await teams.json()
      setTeams(teams1)
    }
    getTeams()
  },[])

  const gamesRows = games.map((g,i) => <GameRow key={i} {...g}/>)
  const numbers = [1,2,3,4,5,6,7,8,9,10]
  return(
    <>
      <table>
        <tbody>
          <tr >
            <td className="search">
              <TeamSearch handleTeam={handleTeam} teams={teams} />
            </td>
            <td className="search">
              <select name="selectList" id="selectList" onChange={handleGameNumber}>
                {numbers.map(n => <Row key={n} i={n}/>)}
              </select>
            </td>
            <td>
              <button onClick={handleSearch} className="button">
                {loading ? 'Searching' : 'Submit'}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {gamesRows.length>0 &&
        <h2 className="App-link">
          {teams[teamName].name}
        </h2>
      }
      <table >
        <tbody>
          {gamesRows}
        </tbody>
      </table>
   </>
  )
}

function App() {
  const [ games, setGames ] = useState([])
  const [ team, setTeam ] = useState('')
  const [ teamName, setTeamName ] = useState('')
  const [ gameNumber, setGameNumber ] = useState(0)
  const [ loading, setLoading ] = useState(false)

  async function getGames(){
    setLoading(true)
    const sportsUrl = baseUrl + '/sports'
    const games = await postRequest(sportsUrl,{team, gameNumber})
    setLoading(false)
    setGames(games)
  }

  const handleSearch = () => getGames()

  const handleTeam = (e) => {
    setTeam(e.target.value)
    setTeamName(e.nativeEvent.target.selectedIndex)
    setGames([])
  }

  const handleGameNumber = e => setGameNumber(e.target.value)

  return (
    <div className="App">
      <header className="App-header">
        <Weather />
        <Games 
          handleSearch={handleSearch} 
          handleTeam={handleTeam} 
          teamName={teamName}
          games={games}
          loading={loading}
          handleGameNumber={handleGameNumber}
        />
      </header>
    </div>
  );
}

export default App;
