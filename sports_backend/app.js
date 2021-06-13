const express = require('express')
const fetch = require('node-fetch')
var cors = require('cors')
var moment = require('moment')
const { Client } = require("pg");

const port = process.env.PORT
const weatherKey =  process.env.WEATHER_API_KEY
const sportsKey = process.env.SPORTS_API_KEY
const connectionString = process.env.DATABASE_URL

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new Client({connectionString});

client.connect();

function formatDate(g){
    const formattedDate = moment(g.game_date).format('MMMM Do, YYYY')
    return {...g, formattedDate}
}

function filterGamesApi({response, team, gameNumber}){
    return response
        .filter(t => t.HomeTeam === team  && t.Status === "Final" || t.AwayTeam  === team && t.Status === "Final")
        .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
        .slice(0,gameNumber)
        .map(g => ({
            home: g.HomeTeam, 
            homeScore: g.HomeTeamRuns, 
            away: g.AwayTeam,
            awayScore: g.AwayTeamRuns, 
            day: g.Day
        }))
}

async function pgQuery(query,values){
    try {
        const res = await client.query(query, values)
        return res.rows;
    } catch (err) {
        console.log(err.stack)
        return err
    }
}

async function getRequest(url){
    const result = await fetch(url);
    return await result.json();
}

async function getTeamsDB(){
    const query='SELECT * FROM teams'
    return await pgQuery(query,[])
}

async function getGamesDB({team,gameNumber}){
    const query="SELECT games.game_id, games.home_team, games.home_score, games.away_team,games.away_score, games.game_date, teams.team_name FROM games INNER JOIN teams ON games.away_team_id = teams.team_id WHERE home_team = $1 GROUP BY games.game_id, games.home_team, games.home_score, games.away_team,games.away_score, games.game_date, teams.team_name  ORDER BY games.game_date DESC LIMIT $2"
    const games1 = await pgQuery(query,[team,gameNumber])
    return games1.map(g => formatDate(g))
}

async function getGameDB({gameId}){
    const query="SELECT * FROM games WHERE game_id = $1"
    const game = await pgQuery(query,[gameId,])
    return formatDate(game[0])
}

async function getInningsDB({gameId}){
    const query="SELECT * FROM innings WHERE game_id = $1"
    const innings = await pgQuery(query,[gameId])
    return innings
}

async function getGameInningsDB({team,gameId}){
    const game = await getGameDB({team,gameId})
    const innings = await getInningsDB({gameId})
    return { game, innings }
}

async function getGames(team, gameNumber){
    const gamesUrl = `https://fly.sportsdata.io/v3/mlb/scores/json/Games/2021?key=${sportsKey}`
    try {   
        const response = await getRequest(gamesUrl)
        return filterGamesApi({response, team, gameNumber})
    } catch(e){
        return e
    }
}

function formatTeams(response){
    return response.map(g => ({name: g.Name, code: g.Key}))
}

async function getTeams(){
    const teamUrl = `https://fly.sportsdata.io/v3/mlb/scores/json/teams?key=${sportsKey}`
    try {
        const response = await getRequest(teamUrl)
        return formatTeams(response)
    } catch(e){
        return e
    }
}

function convertToCelsius(temp){
    return Math.round((temp - 273.15))
}

function convertToFarenheit(temp){
    return Math.round((temp - 273.15) * 9/5 + 32)
}

async function getWeather({lat, lon}){
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?'
    const url = `${weatherUrl}lat=${lat}&lon=${lon}&appid=${weatherKey}`
    try {
        const { main, name } = await getRequest(url)
        const celsius = convertToCelsius(main.temp)
        const farenheit = convertToFarenheit(main.temp)
        return { celsius, farenheit, name } 
    } catch(e){
        return e
    }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/teams', async (req, res) => {
    try {   
        const teams = await getTeams()
        res.json(teams)
    } catch(e){
        res.send(e)
    }
  });

app.get('/teamsdb', async (req, res) => {
    try {   
        const teams = await getTeamsDB()
        res.json(teams)
    } catch(e){
        res.send(e)
    }
});

app.post('/gamesdb', async (req, res) => {
    try {   
        const games = await getGamesDB(req.body)
        res.json(games)
    } catch(e){
        res.send(e)
    }
});

app.post('/gamedb', async (req, res) => {
    try {   
        const game = await getGameInningsDB(req.body)
        res.json(game)
    } catch(e){
        res.send(e)
    }
});

app.post('/sports', async (req, res) => {
    const { team, gameNumber } = req.body
    try {   
        const games = await getGames(team, gameNumber)
        res.json(games)
    } catch(e){
        res.send(e)
    }
  });

  app.post('/weather', async (req, res) => {
    try {
      const curWeather = await getWeather(req.body)
      res.json(curWeather )
    } catch(e){
        res.send(e)
    }
   
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})