import { imageUrl, timeConversion, findAverage } from '../utils.mjs';

export class ForecastData {
    constructor(data) {
        this.daily = data.daily.map(forecast => new DailyForecast(forecast, data.timezone_offset));
    }
}

class DailyForecast {
    constructor(data, timezone) {
        let findDate = timeConversion(data.dt, timezone).date.split(' ');
        // remove year
        findDate.pop();
        this.date = findDate.reverse().join(' ');
        this.sunrise = timeConversion(data.sunrise, timezone).time;
        this.sunset = timeConversion(data.sunset, timezone).time;
        this.temperture = findAverage(data.temp)+String.fromCharCode(0x2103);
        this.feelsLike = findAverage(data.feels_like)+String.fromCharCode(0x2103);
        this.humidity = data.humidity+"%";
        this.wind = data.wind_speed+"m/s";
        this.icon = imageUrl(data.weather[0].icon);
        // this.description = data.weather[0].description;
        // this.maxUV = data.uvi;
    }
}