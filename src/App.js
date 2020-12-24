import { FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';

function App() {
  const [countries, setCountries] = useState([]);
  //  const [countries, setCountries] = useState([
  //   'USA','UK','INDIA','RUSSIA','ITALY'
  // ]); 
  //dummy state
  const [country, setCountry] = useState('worldwide');
  useEffect(() => {
    const getCountriesData = async ()=>{
      await fetch('https://corona.lmao.ninja/v2/countries?yesterday=&sort=')
      .then((response) => response.json())
      .then((data) =>{
        console.log(data);
         const countries = data.map((country)=>(
           {
             name: country.country,
             value: country.countryInfo.iso2
           }
         ));
         setCountries(countries);
      });

    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) =>{
    const countryCode=event.target.value;
    console.log('country-code is', countryCode);
    setCountry(countryCode);
  };
  return (
    <div className="app">
        <div className="app__left">
        <div className="app__header">
          {/* Header start */}
          <h1>COVID-19 TRACKER</h1>
          {/* DropDown Menu */}
          <FormControl className='app__dropdown'>
            <Select variant='outlined' onChange={onCountryChange} value={country}>
              <MenuItem value='worldwide'>WorldWide</MenuItem>
              {
                countries.map(country =>(
                  <MenuItem value={country.value}>
                    {country.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl> 
          {/* Header completed */}
      </div>
          {/* 3 infoboxes with some props will be here */}
          <div className="app__stats">
            <InfoBox title='Covid-19 Cases' total={46154} cases={22985741}/>
            <InfoBox title='Recovered' total={455484545} cases={84485}/>
            <InfoBox title='Deaths' total={51544844} cases={66651}/>
          </div>
          {/* InfoBox completed */}

          {/* Map starts */}
          <Map />
    </div>
        <div className="app__right">
          
        </div>
    </div>
  );
}

export default App;
