'use strict';
const PORT = 3000;
require('dotenv').config();
const express = require('express'); // express framwork
const cors = require('cors'); //api call out of domain
const superagent = require('superagent');
const app = express();

app.use(cors());

app.listen(process.env.PORT || PORT, () => {
    console.log('Server Start at ' + PORT + ' .... ');
})

let cityArray=[];
function LoctionMaps(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
    cityArray.push(this);
}

app.get('/location', handleLocation);
const LocationS = {};
function handleLocation(req, response) {
    let city = req.query.city;
    let key = 'pk.73d02362f3b19209cc519b0dd4e9cf2f';
    
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    superagent.get(url).then(res => {
        const data = res.body[0];
        const location = new LoctionMaps(city, data);
        LocationS.lat = data.lat;
        LocationS.lon = data.lon;
        response.send(location);

    }).catch((err) => {
        console.log('ERROR !! ', err);
    });

}

/* constractor function that handel the weather in the same location */

function Weather(item) {
    this.time = item.datetime,
    this.forecast = item.weather.description
}
app.get('/weather', handleWeather);

function handleWeather(request, response) {
    let lat = LocationS.lat;
    let lon = LocationS.lon;
    console.log(lat, ' ', lon);
    let key = 'e5533604561a4e008bbc7e5ee03fb7dc';
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
    superagent.get(url).then(res => {
        let currentWeather = [];
        res.body.data.map(item => {
            currentWeather.push(new Weather(item));
            return currentWeather;
        })
        response.send(currentWeather);
    }).catch(err => {
        response.status(404).send('requested API is Not Found!');
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
            let parks = [];
            res.body.data.map(item=>{
                parks.push(new Park(item))
                return parks;
            })
            response.send(parks)
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