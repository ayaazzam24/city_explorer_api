'use strict';
const PORT = 3000;
require('dotenv').config();
const express = require('express'); 
const cors = require('cors'); 
const superagent = require('superagent');
const app = express();
const pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
 
app.use(cors());
const client = new pg.Client(DATABASE_URL);
client.on('error', err => {
  console.log('there is an error')
});
client.connect().then(() => {
    app.listen(PORT, () => {
      console.log('on port' + PORT);
    });
  })
let lat = '';
let lon = '';
app.get('/location', handleLocation);
function MapsLocation(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
  }
    
function handleLocation(request, response) {
  
    let city = request.query.city;
    let key = process.env.loction;
    const selected = "SELECT * FROM location WHERE search_query=$1;"
    
    client.query(selected, [city]).then((dataLoction3)=>{
        // console.log(dataLoction3.row)
      if(dataLoction3){
        let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
        superagent.get(url).then(res => {
          let dataLoction = res.body[0];
          lat = dataLoction.lat;
          lon = dataLoction.lon;
          let theLocation = new MapsLocation(city, dataLoction.display_name,dataLoction.lat,dataLoction.lon);
          const insert = 'INSERT INTO location (search_query,formatted_query, latitude,longitude) VALUES ($1,$2,$3,$4);';
          const theValues= [theLocation.search_query,theLocation .formatted_query ,theLocation.latitude,theLocation.longitude];
          client.query(insert,theValues )
          .then((dataLoction2) => {
            response.send(theLocation);
            
          });
        })
        
      } else {
        response.send(dataLoction3.rows[0]);
      }
    })
    
  }
    
    
    
    
    
   
    
    // //   superagent.get(url).then(res => {
    //  const data = res.body[0];
    //    const location = new LoctionMaps(city, data);
    //     LocationS.lat = data.lat;
    //     LocationS.lon = data.lon;
    //     response.send(location);
    
function Weather(item) {
    this.time = item.datetime,
    this.forecast = item.weather.description
}
app.get('/weather', handleWeather);
function handleWeather(request, response) {
    console.log(lat, ' ', lon);
    let key = 'e5533604561a4e008bbc7e5ee03fb7dc';
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
    superagent.get(url).then(res => {
        let theWeather = [];
        res.body.data.map(item => {
           theWeather.push(new Weather(item));
            return theWeather;
        })
        response.send(theWeather);
    }).catch(err => {
        console.log(' THERES AN ERROR !! ', err);
    })
}
function Park(park) {
    this.name =park.fullName,
    this.park_url=park.url,
    
    this.fee='0',
    this.description=park.description
}
app.get('/parks', handelPark);
function handelPark(request, response) {
    let key = 'JEqQ1NhTuMx7dkKha4yCqULkhhvic9hNDwLO8VMp';
    const url = `https://developer.nps.gov/api/v1/parks?parkCode=la&limit=10&api_key=${key}`;
    superagent.get(url)
        .then(res => {
            let thePark = [];
            res.body.data.map(item=>{
              thePark.push(new Park(item))
                return thePark;
            })
            response.send(thePark)
        })
        .catch(err => {
            response.status(404).send('ERROR !!', err);
        })
}
app.use('*', (req, res) => {
    let status = 404;
    res.status().send({ status: status, message: 'Page Not Found' });
})
app.use(errorHandler);
function errorHandler(err, request, response, next) {
    response.status(500).send('something is wrong in server');
}





