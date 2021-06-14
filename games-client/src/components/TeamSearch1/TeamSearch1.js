import React from 'react'

import SearchButton from '../Button/Button'

const numbers = [1,2,3,4,5,6,7,8,9,10]

export default function TeamSearch({
    teams, 
    handleTeam, 
    handleGameNumber, 
    loading, 
    handleSearch,
}){
    return(
        <div>
        {teams.length>0 &&
        <table>
            <tbody>
                <tr>
                    <td className="search">
                        <select name="selectList" id="selectList" onChange={handleTeam}>
                          {teams && teams.map(t => 
                                <TeamRow 
                                    key={t.team_code} 
                                    {...t} 
                                />
                            )}
                        </select>
                    </td>
                    <td className="search">
                        <select name="selectList" id="selectList" onChange={handleGameNumber}>
                            {numbers.map(n => 
                                <Row 
                                    key={n} 
                                    i={n}
                                />
                            )}
                        </select>
                    </td>
                    <td>
                        <SearchButton 
                            handleSearch={handleSearch} 
                            text='Submit'
                            styleClass={loading ? "button button-loading" : "button button-submit"}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
        }
        </div>
    )
}

const Row = ({i}) => <option>{i}</option>

const TeamRow = ({team_code,team_name}) => <option value={team_code}>{team_name}</option>