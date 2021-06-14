const express = require('express')
var cors = require('cors')

const { getWeather } = require('./weather')

const {
    getTeamsDB,
    getGamesDB,
    getGameInningsDB,
    getGames,
    getTeams
} = require('./games')

const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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