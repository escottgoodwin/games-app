import {useState, useEffect} from 'react'

import { postRequest, baseUrl } from '../util'

export default function Weather(){

    const [ celsius, setCelsius ] = useState('')
    const [ farenheit, setFarenheit ] = useState('')
    const [ lat, setLat ] = useState(0)
    const [ lon, setLon ] = useState(0)
    const [ geo, setGeo ] = useState()
    const [ place, setPlace ] = useState('')
    const [ error, setError ] =useState(false)
  
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
            const { celsius, farenheit, name }  = response
            setCelsius(celsius)
            setFarenheit(farenheit)
            setPlace(name)
  
          } catch(e){
            console.log(e)
            setError(true)
          }
      }
    }
      getWeather()
    },[lat,lon,geo])

    return(
        <WeatherDisplay
          celsius={celsius}
          farenheit={farenheit}
          place={place}
          error={error}
        />
    )
  }

function WeatherDisplay({error,celsius, farenheit,place}){
    return(
        <>
        {error ?
          <h4 className="loser">Error getting weather</h4>
          :
          <h4 className="weather">
            Currently {farenheit}°F / {celsius}°C in {place} 
          </h4>
        }
        </> 
    )
}

// function WeatherDisplay1({error,celsius, farenheit,place}){
//   return(
//       <>
//       {error ?
//         <h4 className="loser">
//           Error getting weather
//         </h4>
//         :
//         <>
//         <h4 className="weather">
//           {place} Weather 
//         </h4>
//         <h4 className="weather">
//           {farenheit}°F / {celsius}°C
//       </h4>
//       </>
//       }
//       </> 
//   )
// }