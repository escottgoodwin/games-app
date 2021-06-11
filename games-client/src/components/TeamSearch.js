const numbers = [1,2,3,4,5,6,7,8,9,10]

export default function TeamSearch({teams, handleTeam, handleGameNumber, loading, handleSearch}){
    return(
        <table>
            <tbody>
                <tr>
                    <td className="search">
                        <select name="selectList" id="selectList" onChange={handleTeam}>
                          {teams && teams.map(t => <TeamRow key={t.code} {...t} />)}
                        </select>
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
    )
}

const Row = ({i}) => <option>{i}</option>

const TeamRow = ({code,name}) => <option value={code}>{name}</option>