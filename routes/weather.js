const express = require('express');
const router = express.Router();
const modifyError = require('modifyerror');

let weatherDataBeograd;
let weatherDataNoviSad;
let weatherDataNis;

async function getInitialWeather() {
    try {
        weatherDataBeograd = await getWeather('Belgrade');
        weatherDataNoviSad = await getWeather('Novi Sad');
        weatherDataNis = await getWeather('Niš');
    } catch (error) {
        return null
    }
}
getInitialWeather()

setInterval(async () => {
    try {
        weatherDataBeograd = await getWeather('Belgrade');
        weatherDataNoviSad = await getWeather('Novi Sad');
        weatherDataNis = await getWeather('Niš');
    } catch (error) {
        return null
    }
    
}, 3600000)

router.get('/weather/:location', async (req, res) => {


    const location = req.params.location;
    
    try {  
        if(!weatherDataBeograd || !weatherDataNoviSad || !weatherDataNis) return res.json({weatherMsg: new WeatherMsg(false, 'Problem sa podacima za vreme')});
        if(location == 'Belgrade') return res.json({weatherMsg: new WeatherMsg(true, weatherDataBeograd)});
        if(location == 'Novi Sad') return res.json({weatherMsg: new WeatherMsg(true, weatherDataNoviSad)});
        if(location == 'Niš') return res.json({weatherMsg: new WeatherMsg(true, weatherDataNis)});

    } catch (error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;


function WeatherMsg(isSuccess, result) {
    this.isSuccess = isSuccess; 
    if(isSuccess) {
        this.weatherData = result;
    }
    if(!isSuccess) {
        this.failureMsg = result;
    }
}

async function getWeather(location) {
    let count = 0;
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd1d887415cmsh985b8cd21e3d018p1ed1ebjsn723510c1ce85',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    }
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(JSON.parse(result).location.name);
        console.log(JSON.parse(result).current.temp_c);
        return JSON.parse(result);  
}