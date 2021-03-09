// route is String type and parameters is object type
// parameters: Object Type
export function urlConversion(parameters) {
    // convert object into string array
    let entries = Object.entries(parameters);
    // transform the string array into string with ampersand as conjuction
    let entrieString = entries.map((parameter) => `${parameter[0]}=${parameter[1]}`).join("&");
    // if there is no parameters, return nothing, else return transformed string with "?" on the front
    return parameters.length === 0 ? "" : `?${entrieString}`;
}

export function imageUrl(icon_name) {
    return `http://openweathermap.org/img/wn/${icon_name}.png`
}