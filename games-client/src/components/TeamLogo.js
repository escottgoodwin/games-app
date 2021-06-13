import Tigers from '../logos/Tigers'

function TeamLogo(teamName){
    switch (teamName) { 
        case 'Tigers':
            return <Tigers />
        default:
            return <Tigers />
    }
}

export default TeamLogo