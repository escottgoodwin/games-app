const { pgQuery } = require('./helpers')
var moment = require('moment')

const sportsKey = process.env.SPORTS_API_KEY

function formatTeams(response){
    return response.map(g => ({name: g.Name, code: g.Key}))
}

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

async function getTeams(){
    const teamUrl = `https://fly.sportsdata.io/v3/mlb/scores/json/teams?key=${sportsKey}`
    try {
        const response = await getRequest(teamUrl)
        return formatTeams(response)
    } catch(e){
        return e
    }
}

module.exports = {
    getTeamsDB,
    getGamesDB,
    getGameInningsDB,
    getGames,
    getTeams
}