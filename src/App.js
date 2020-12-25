import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import LineGraph from './components/LineGraph';
import Map from './components/Map';
import Table from './components/Table';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [TableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) =>{
      setCountryInfo(data);
    });
    
  }, []);
  
  useEffect(() => {
    const getCountriesData = async ()=>{
      await fetch('https://disease.sh/v3/covid-19/countries')
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
         const sortedData=[...data];
         sortedData.sort((a,b) => (a.cases > b.cases ? -1 : 1));
         setTableData(sortedData);
      });

    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) =>{
    const countryCode=event.target.value;
    console.log('country-code is', countryCode);
    setCountry(countryCode);

    // fetching the data from API for country or worlwide
    // using a ternary operator to check for country or worlwide
    const url = countryCode === 'worlwide' ? 'https://corona.lmao.ninja/v2/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data);
      setCountry(countryCode);
    })

  };
  console.log("country info >>>",countryInfo);
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
            <InfoBox title='Covid-19 Cases' cases={countryInfo.todayCases} total={countryInfo.cases}/>
            <InfoBox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
            <InfoBox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
          </div>
          {/* InfoBox completed */}

          {/* Map starts */}
          <Map />
    </div>
        <Card className="app__right">
          <CardContent >
            <h3>Cases of the country</h3>
            <Table countries={TableData} />
            <h3>WorldWide new cases</h3>
            <LineGraph />
          </CardContent>
        </Card>
    </div>
  );
}

export default App;
