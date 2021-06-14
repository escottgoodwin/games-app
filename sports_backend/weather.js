const { getRequest } = require('./helpers')

const weatherKey =  process.env.WEATHER_API_KEY

function convertToCelsius(temp){
    return Math.round((temp - 273.15))
}

function convertToFarenheit(temp){
    return Math.round((temp - 273.15) * 9/5 + 32)
}

async function getWeather({lat, lon}){
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?'
    const url = `${weatherUrl}lat=${lat}&lon=${lon}&appid=${weatherKey}`
    try {
        const { main, name } = await getRequest(url)
        const celsius = convertToCelsius(main.temp)
        const farenheit = convertToFarenheit(main.temp)
        return { celsius, farenheit, name } 
    } catch(e){
        return e
    }
}

module.exports = {
    getWeather
}