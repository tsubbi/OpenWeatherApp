// route is String type and parameters is object type
export function urlConversion(route, parameters) {
    let entries = Object.entries(parameters);
    let entrieString = entries.map((parameter) => `${parameter[0]}=${parameter[1]}`).join("&");
    return parameters.length === 0 ? route : `${route}?${entrieString}`;
}