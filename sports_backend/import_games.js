const { Client } = require("pg");
const fetch = require('node-fetch')

const sportsKey = 'c1c7df6f2ded44e9bf64192d64dea0a9'

const client = new Client({
    user: "docker",
    host: "localhost",
    database: "sports",
    password: "docker",
    port: 5400,
  });

client.connect();

async function getRequest(url){
    try{
        const result = await fetch(url);
        return await result.json();
    } catch(e){
        console.log(e)
    }
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

async function getGames(){
    const gamesUrl = `https://fly.sportsdata.io/v3/mlb/scores/json/Games/2021?key=${sportsKey}`
    return await getRequest(gamesUrl)
}

async function getTeams(){
    const teamUrl = `https://fly.sportsdata.io/v3/mlb/scores/json/teams?key=${sportsKey}`
    return await getRequest(teamUrl)
}

async function getGame(gameId){
    const gameUrl = `https://fly.sportsdata.io/v3/mlb/stats/json/BoxScore/${gameId}?key=${sportsKey}`
    return await getRequest(gameUrl)
}

async function insertTeams(){
    const teams = await getTeams()
    const insert_teams = 'INSERT INTO teams(team_id, team_name, team_code) VALUES($1, $2, $3)'
    teams.forEach(async (t) => {
      const values = [t.TeamID,t.Name,t.Key]
      const inserts = await pgQuery(insert_teams,values)
    })
    console.log('imported teams');
    return 
}

async function insertGames(){
    const games = await getGames()
    const insertGames = games.filter(g => g.Status==='Final')

    const insert_games  = 'INSERT INTO games(home_team,away_team,home_team_id,away_team_id,home_score,away_score,game_id,game_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
    insertGames.forEach(async (g) => {
        const values = [g.HomeTeam, g.AwayTeam, g.HomeTeamID, g.AwayTeamID, g.HomeTeamRuns, g.AwayTeamRuns, g.GameID, g.Day]
        const inserts = await pgQuery(insert_games,values)
    })
    console.log('imported games');
    return 
}

async function insertGames(){
    const games = await getGames()
    const insertGames = games.filter(g => g.Status==='Final')

    const insert_games  = 'INSERT INTO games(home_team,away_team,home_team_id,away_team_id,home_score,away_score,game_id,game_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
    insertGames.forEach(async (g) => {
        const values = [g.HomeTeam, g.AwayTeam, g.HomeTeamID, g.AwayTeamID, g.HomeTeamRuns, g.AwayTeamRuns, g.GameID, g.Day]
        const inserts = await pgQuery(insert_games,values)
    })
    console.log('imported games');
    return 
}

async function insertInnings(){
    try {
    const games = await getGames()
    const insertGames = games.filter(g => g.Status==='Final')

    const insert_innings  = 'INSERT INTO innings(inning, away_score, home_score, home_team, away_team, home_team_id, away_team_id, game_id, game_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
    insertGames.forEach(async (g) => {
        const gameId = g.GameID
        try {
        const game = await getGame(gameId)
        const innings = game.Innings

        innings.forEach(async (inn) => {
            const values = [inn.InningNumber, inn.AwayTeamRuns, inn.HomeTeamRuns, g.HomeTeam, g.AwayTeam, g.HomeTeamID, g.AwayTeamID, g.GameID, g.Day]
            console.log(values)
            const inserts = await pgQuery(insert_innings, values)
        })
        } catch(e){
            console.log(e)
        }
    })
    } catch(e){
        console.log(e)
    }
    console.log('imported innings');
    return 
}

// insertTeams()
// insertGames()
insertInnings()