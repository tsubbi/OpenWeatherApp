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
    return `https://openweathermap.org/img/wn/${icon_name}@2x.png`
}

export function compareFile(file_location) {
    // get the last component of the file location
    return file_location.split('/').splice(-1)[0];
}

// time: unit is sec, in unix format
export function timeConversion(time, timezone) {
    // the parameter of Date is in millisec. timezon could have - sign so need to use plus instead of -
    var dateTime = new Date((time+timezone) * 1000);
    // convert date object into array
    const dateArray = dateTime.toGMTString().split(' ')
    // remove first and last element in array
    const dateAndTime = dateArray.filter((item, index) => index > 0 && index < dateArray.length -1);
    const formattedTime = trimSecond(dateAndTime.pop());
    const formattedDate = dateAndTime.join(' ');

    return { 
        date: formattedDate, 
        time: formattedTime
    };
}

// show only the hour and minutes
export function trimSecond(time) {
    const onlyHourAndMin = time.split(":");
    return onlyHourAndMin.splice(0, 2).join(":");
}

// fnd out the average value
export function findAverage(data) {
    let values = Object.values(data);
    let result = values.reduce((total, value) => total+value)/values.length
    return Math.floor(result);
}