import "./App.css";
import React, { useEffect, useState } from 'react';


// images 
import searchIcon from './assets/search.png';
import clearIcon from './assets/clear.png';
import snowIcon from './assets/snow.png';
import humidityIcon from './assets/humidity.png';
import windIcon from './assets/wind.png';
import cloudIcon from './assets/cloud.png';
import drizzleIcon from './assets/drizzle.png';
import rainIcon from './assets/rain.png';
import partlyCloudIcon from './assets/p.cloud.png';
import brokenCloudIcon from './assets/brokenclouds.png';



const WeatherDetails = ({icon,temp,city,country,lat,log,humidity,wind})=>{
  return (
    <>
  <div className='image'>
    <img src={icon} alt="image" />
  </div>
  <div className="temp">{temp}'C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>

  <div className="cord">
    <div>
      <span className="lat">Latitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className="log">Longitude</span>
      <span>{log}</span>
    </div>
  </div>

  <div className="data-container">
    <div className="element">
      <img src={humidityIcon} alt="humidity" className="icon" />
      <div className="data">
        <div className="humidity-percentage">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>
    </div>

    <div className="element">
      <img src={windIcon} alt="wind" className="icon" />
      <div className="data">
        <div className="wind-percentage">{wind}km/h</div>
        <div className="text">wind speed</div>
      </div>
    </div>
  </div>

  </>
  );
};


function App() {

  let api_key = 'a5bff8a0dd64ccf153a98a16b1822da6';
  const [text,setText]=useState('')

  const[icon,setIcon] = useState(snowIcon);
  const[temp,setTemp] = useState(0);
  const[city,setCity] = useState('');
  const[country,setCountry]=useState('');
  const[lat,setLat]=useState(0);
  const[log,setLog]=useState(0);
  const[humidity,setHumidity]=useState(0);
  const[wind,setWind]=useState(0);

  const[cityNotFound,setCityNotFound] = useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);

  const weatherIconMap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":clearIcon,
    "02n":clearIcon,
    "03d":clearIcon,
    "03n":cloudIcon,
    "04d":brokenCloudIcon,
    "04n":brokenCloudIcon,
    "09d":drizzleIcon,
    "09n":drizzleIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };


  const search = async ()=>{

    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
        let res = await fetch(url);
        let data = await res.json();
        console.log(data);
        if (data.cod === "404") {
          console.error('city not found');
          setCityNotFound(true);
          setLoading(false);
          return;
          }
        
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLat(data.coord.lat);
        setLog(data.coord.lon);

        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || clearIcon)
        setCityNotFound(false)
    }
    catch(error){
      console.error("An error occurred:",error.message);
      // setError("An error occurred while fetching data .")
      
    }finally{
        setLoading(false);
    }
  }

  const handleCity =(e)=>{
    setText(e.target.value);
  };
  const handleKeyDown = (e)=>{
    if (e.key === 'Enter') {
      search();
    }
  };

  useEffect(() => {
  search();
  }, []);

  return (
  <>

  <h1 className="head">Weather <span>App</span></h1>
  
  <div className="container">
    <div className="input-container">
      <input type="text" 
      placeholder='Search city' 
      className='cityInput' 
      onChange={handleCity} 
      value={text} 
      onKeyDown={handleKeyDown}/>

      <div className='search-icon' onClick={()=>search()}>
        <img src={searchIcon} alt="search" className='search-img' />
      </div>
    </div>
   
   {
       !loading && !cityNotFound &&  <WeatherDetails icon={icon} temp={temp} city={city} 
       country={country} lat={lat} log={log} humidity={humidity}
       wind={wind} 
        />   
   }




{loading && <div className="loading-message">Loading . . . </div>}
{error && <div className="error-message">{error}</div>}
{cityNotFound && <div className="city-not-found">City Not Found</div>}


<div className="copyright">
  <p>Created by Naveen</p>
</div>
 
 
  </div>

  </>
  );
}

export default App;
