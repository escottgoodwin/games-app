import {useState, useEffect} from 'react'

import { postRequest, baseUrl } from '../util'

export default function Weather(){

    const [ weather, setWeather ] = useState('')
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
            const { temp, name } = response
            setWeather(temp)
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
          weather={weather}
          place={place}
          error={error}
        />
    )
  }

function WeatherDisplay({error,weather,place}){
    return(
        <>
        {error ?
            <h4 className="loser">Error getting weather</h4>
            :
            <h4 className="weather">
                Currently {weather}°F in {place} 
            </h4>
        }
        </>
       
    )
}