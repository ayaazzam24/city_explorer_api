'use strict';

require('dotenv').config();
// convert this to an envirment variable 

// my application dependencies
const express = require('express'); // node.js framework.
const cors = require('cors'); // cross origin resources sharing
const superagent = require('superagent');


const app = express(); //initalize express app
const PORT = process.env.PORT;
app.use(cors()); // use cors

app.use('*', notFoundHandler); // 404 not found url
 
app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}

function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}

app.get('/location', locationHandler);


const myLocationArray = {};
function locationHandler(request, response) {
  
  let city = request.query.city;
  
  
  

  if (myLocationArray[city]) {
    
    response.send(myLocationArray[city]);
  
  } else {
    
    console.log("1.from the location API")
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    superagent.get(url).then(res=> {
     
      const locationData = res.body[0];
      const location = new Location(city, locationData);
      
      
      response.send(location);

    }).catch((err)=> {
      console.log("ERROR IN LOCATION API");
      console.log(err)
    });
  }
}

function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}






app.get('/weather', weather);

let array = [];
function WeatherHandel(forecast, time){
    this.forecast = forecast;
    this.time = time;
    array.push(this);
}
function weather(request, response) {
    if(array){
        array = [];
    }
    const getData = require('./data/weather.json');
    let dataArr = getData.data;
    dataArr.forEach(element => {
        let time = element.valid_date;
        let dis = element.weather.description;
        let weather = new WeatherHandel(dis, time);
        
    });
    response.send(array);
}
app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`))