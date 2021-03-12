export const base_url = "https://api.openweathermap.org";

// router
export const query_city_router = "/data/2.5/weather";
export const query_forcast_router = "/data/2.5/onecall";

// query city parameter
export const query_city = "q";
export const appid = "appid";
// query daily data
export const lat = "lat";
export const lon = "lon";
export const exclude = "exclude";

export const units = "units";

// query values: unit
export const celsius = "metric";
export const fahrenheit = "imperial";
// query values: exclude
export const current = "current";
export const minutely = "minutely";
export const hourly = "hourly";
export const daily = "daily";
export const alerts = "alerts";
export const allExceptDaily = "current,minutely,hourly,alerts";