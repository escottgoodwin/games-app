export default function GamesList({games,teams,teamName}){
    return(
        <>
        {games.length>0 &&
        <>
            <h2 className="App-link">
                {teams[teamName].name}
            </h2>
            <table >
                <tbody>
                    {games.map((g,i) => <GameRow key={i} {...g}/>)}
                </tbody>
            </table>
          </>           
        }
    </>
    )
}

function GameRow({home,homeScore,away,awayScore, day}){
    const homeColor = homeScore > awayScore ? "winner" : "loser";
    const awayColor = homeScore < awayScore ? "winner" : "loser";
    const gameDate = new Date(day).toDateString()
    return(
      <> 
            <tr>
                <td align="center" colSpan="2" className="game-date">{gameDate}</td>
            </tr>
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