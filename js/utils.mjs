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
    // // PST is UTC-8, 60second * 60minutes * 8 hours
    // let PST = 60*60*8;
    // the parameter of Date is in millisec
    var dateTime = new Date((time+timezone) * 1000);
    // convert date object into array
    const dateArray = dateTime.toGMTString().split(' ')
    // remove first and last element in array
    const dateAndTime = dateArray.filter((item, index) => index > 0 && index < dateArray.length -1);
    const formattedTime = dateAndTime.pop();
    const formattedDate = dateAndTime.join(' ');

    return { 
        date: formattedDate, 
        time: formattedTime
    };
}