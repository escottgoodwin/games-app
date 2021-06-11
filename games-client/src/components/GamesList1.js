export default function GamesList({games,teams,teamName}){
    return(
      <>
      {games.length>0 &&
        <>
          <h2 className="App-link">
            {teams[teamName].team_name}
          </h2>
          <table >
              <tbody>
                {games.map((g,i) => 
                  <GameRow 
                    key={i} 
                    home_name={teams[teamName].team_name} 
                    {...g}
                  />
                )}
              </tbody>
          </table>
        </>           
      }
    </>
    )
}

function GameRow({away_score,home_score, game_date, home_name, team_name}){
    const homeColor = parseInt(home_score) > parseInt(away_score) ? "winner" : "loser";
    const awayColor = parseInt(home_score) < parseInt(away_score) ? "winner" : "loser";
    const gameDate = new Date(game_date).toDateString()
    return(
      <> 
        <tr>
          <td align="center" colSpan="2" className="game-date">{gameDate}</td>
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
          <td ></td>
        </tr>
      </>
    )
  }

  function ScoreRow({name, score, color}){
    return(
      <tr>
        <td className={color}>
          {name}
          </td>
        <td className={color}>
          {score}
        </td>
      </tr>
    )
  }