import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/name'
const api_key = import.meta.env.VITE_SOME_KEY

const Countries = ({ countryData, weatherData, buttonHandler }) => {
  if (countryData.length > 10) {
    return (
      <p>
        Too many matches, specify another filter
      </p>
    )
  }

  if (countryData.length === 1 && countryData !== '' && weatherData !== '') {
    const country = countryData[0]
    return (
      <>
        <h1>{country.name.common}</h1>
        capital {country.capital[0]} <br />
        area {country.area}

        <h2>languages:</h2>
        <ul>
          {Object.values(country.languages).map(language =>
            <li key={language}>
              {language}
            </li>
          )}
        </ul>

        <img 
          src={country.flags.svg} 
          alt={country.flags.alt} 
          width='200'
        />

        <h2>Weather in {country.capital[0]}</h2>
        temperature {(weatherData.main.temp - 273.15).toFixed(2)} Celsius <br/>
        <img 
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
          alt={weatherData.weather[0].description} 
          width='100'
        /> < br/>
        wind {weatherData.wind.speed} m/s
      </>
    )
  }

  return (
    <>
      {countryData.map(country => 
        <p key={country.name.official}>
          {country.name.common}
          <button onClick={() => buttonHandler(country)}>
            show
          </button>
        </p>)}
    </>
  )
}

function App() {
  const [countryQuery, setCountryQuery] = useState('')
  const [countryData, setCountryData] = useState([])
  const [weatherData, setWeatherData] = useState('')

  const handleCountryButton = ({ country }) => {
    setCountryQuery(country.name.common)
  }

  useEffect(() => {
    if (countryQuery === '') {
      return
    }

    console.log('fetching country data with query', countryQuery, '..')
    axios
      .get(`${baseUrl}/${countryQuery}`)
      .then(response => {
        setCountryData(response.data)
        console.log('countrydata fetched ..')
        if (response.data.length === 1) {
          const lat = response.data[0].capitalInfo.latlng[0]
          const lon = response.data[0].capitalInfo.latlng[1]
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=${api_key}`.replace('{lat}', lat).replace('{lon}', lon)
          console.log('fetching weather data ..')
          axios 
            .get(weatherUrl)
            .then(response => {
              console.log(response.data)
              setWeatherData(response.data)
              console.log('weather data fetched ..')
            })
        }
      })
      .catch(error => {
        console.log(error)
      });
  }, [countryQuery])

  const handleCountryQueryChange = (event) => {
    setCountryQuery(event.target.value)
  }

  return (
    <div>
      find countries &nbsp;
      <input 
        value={countryQuery}
        onChange={handleCountryQueryChange}
      />
      <Countries countryData={countryData} weatherData={weatherData} buttonHandler={handleCountryButton} />
    </div>
  );
}

export default App;
