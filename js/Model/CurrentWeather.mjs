import { imageUrl, timeConversion } from '../utils.mjs';

export class CurrentWeather {
    constructor(data) {
        this.icon = imageUrl(data.weather[0].icon);
        this.description = data.weather[0].description;
        this.temperture = Math.floor(data.main.temp);
        this.maxTemp = Math.floor(data.main.temp_max)+String.fromCharCode(0x2103);
        this.minTemp = Math.floor(data.main.temp_min)+String.fromCharCode(0x2103);
        this.feelsLike = Math.floor(data.main.feels_like)+String.fromCharCode(0x2103);
        this.humidity = data.main.humidity+"%";
        this.date = timeConversion(data.dt, data.timezone).date;
        this.time = timeConversion(data.dt, data.timezone).time;
        this.sunrise = timeConversion(data.sys.sunrise, data.timezone).time;
        this.sunset = timeConversion(data.sys.sunset, data.timezone).time;
        this.name = data.name;
        this.country = data.sys.country;
        this.wind = data.wind.speed+"m/s";
    }
}