import { base_url, query_city, query_city_router, units, appid, celsius, allExceptDaily, exclude, lat, lon, query_forcast_router } from './variables.mjs';
import { urlConversion } from './utils.mjs';
import { CurrentWeather } from './Model/CurrentWeather.mjs';
import { ForecastData } from './Model/ForecastData.mjs'

export function getCurrentWeatherData(city, key, callback) {
    const params = {
        [query_city]: city,
        [units]: celsius,
        [appid]: key
    };
    // combine into url string
    const url = base_url+query_city_router+urlConversion(params);
    fetch(url)
        .then(response => checkError(response))
        .then(data => {
            // store lat and lon for forecast purpose
            sessionStorage.setItem("lat", data.coord.lat);
            sessionStorage.setItem("lon", data.coord.lon);
            sessionStorage.setItem("city", data.name);
            callback(new CurrentWeather(data));
        })
        .catch (error => {
            handleException(error.message, error.code);
        });
}

export function getForecast(latValue, lonValue, apiKey, callback) {
    const params = {
        [lat]: latValue,
        [lon]: lonValue,
        [units]: celsius,
        [exclude]: allExceptDaily,
        [appid]: apiKey
    }

    // combine into url string
    const url = base_url + query_forcast_router+urlConversion(params);
    fetch(url)
        .then(response => checkError(response))
        .then(data => {
            callback(new ForecastData(data));
        })
        .catch (error => {
            handleException(error.message, error.code);
        });
}

export function handleException(message, status) {
    var msg = "";
    msg += "Code: " + status + "\n";
    msg += "Reason: " + message + "\n";
    alert(msg);
}

function checkError(response) {
    if (!response.ok) {
        let error = new Error(response.statusText);
        error.code = response.status;
        throw error;
    }
    return response.json();
}