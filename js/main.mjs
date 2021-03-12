import { base_url, query_city, query_city_router, units, appid, celsius, allExceptDaily, exclude, lat, lon, query_forcast_router } from './variables.mjs';
import { urlConversion, imageUrl, compareFile, timeConversion, findAverage } from './utils.mjs';

let apiKey = "";
let city = "";

// create header and display data
window.addEventListener('load', (event) => {
    // get current file url
    const file = event.currentTarget.location.href;
    // return the file name and extension
    const currentTarget = compareFile(file);
    pageSetup(currentTarget);
    // create header for every page
    createHeader();
});

$("button").click(checkEmpty);

function pageSetup(target) {
    if (apiKey === "") {
        // get api_key
        fetch("../config.json")
            .then(response => response.json())
            .then(data => {
                apiKey = data.API_KEY
                switch (target) {
                    case "current.html":
                        search();
                        // set interval of refresh in every 2 minute
                        setInterval(search, (60*2*1000));
                        break;
                    case "forecast.html":
                        fetchForecast();
                        break;
                    default:
                        // load svg as bg
                        $("#bg").load("./img/mountainBG.svg");
                }
            });
    }
}

// validate the the text input
function checkEmpty() {
    const input = $("#search");
    if (input === "") {
        alert("Please enter a city");
    } else {
        city = input.val();
        fetchByCity(input.val());
        input.val("")
    }
}

// create header in every page
function createHeader() {
    // logo section
    const iconContainer = $("<div>").addClass("icon-container");
    const aTag = $("<a>").attr('href', "./index.html");
    const img = $("<img>").attr('src', './img/logo.png').addClass("logo-icon");
    const logoContent = $("<div>").addClass("logo-content");
    const weatherSpan = $("<span>").text("Weather\n");
    const reportSpan = $("<span>").text("Report");
    logoContent.append(weatherSpan, reportSpan);
    aTag.append(img, logoContent);
    iconContainer.append(aTag);
    // toggle menu location and add click event
    const menuToggle = $("<div>").addClass("menuToggle").click(toggleMenu);

    // page names
    const menuList = ["current", "forecast"];
    const nav = $("<ul>").addClass("navigation");
    menuList.forEach(menu => {
        const liTag = $("<li>").click(toggleMenu);
        const aTag = $("<a>")
                        // set link attribute
                        .attr("href", `./${menu}.html`)
                        // capitalize the word
                        .text(`${menu[0].toUpperCase()+menu.slice(1)}`);
        liTag.append(aTag);
        nav.append(liTag);
    });

    $('header').append(iconContainer, menuToggle, nav);
}

function fetchForecast() {
    const latValue = sessionStorage.getItem("lat");
    const lonValue = sessionStorage.getItem("lon");

    if (lat && lon) {
        const params = {
            [lat]: latValue,
            [lon]: lonValue,
            [units]: celsius,
            [exclude]: allExceptDaily,
            [appid]: apiKey
        }
        // combine into url string
        const url = base_url+query_forcast_router+urlConversion(params);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const timeOffset = data.timezone_offset;
                // 8 objects in side the array
                const dailyArray = data.daily;

                let dateData = [];
                let sunriseData = [];
                let sunsetData = [];
                let avgTempData = [];
                let avgFeelsLike = [];
                let humidityData = [];
                let iconData = [];
                
                $("h1").text(sessionStorage.getItem("city"));
                dailyArray.forEach(day => {
                    dateData.push(timeConversion(day.sunrise, timeOffset).date);
                    sunriseData.push(timeConversion(day.sunrise, timeOffset).time);
                    sunsetData.push(timeConversion(day.sunset, timeOffset).time);
                    avgTempData.push(findAverage(day.temp)+String.fromCharCode(0x2103));
                    avgFeelsLike.push(findAverage(day.feels_like)+String.fromCharCode(0x2103));
                    humidityData.push(day.humidity+"%");
                    iconData.push(day.weather[0].icon);
                });

                // remove year
                const arrangedDate = dateData.map(date => {
                    let dateArr = date.split(" ");
                    dateArr.pop();
                    return dateArr.reverse().join(" ");
                });
                // remove data for the first day to give a column to the row title
                arrangedDate[0] = "";
                // replace first data to row title
                const rowTitle = ["Sunrise", "Sunset", "Temperture", "Feels Like", "Humidity", " "];
                const dataChunk = [sunriseData, sunsetData, avgTempData, avgFeelsLike, humidityData, iconData];
                rowTitle.forEach((title, index) => {
                    dataChunk[index][0] = title;
                });
                const table = $("<table>");
                // thead
                const theadTag = $("<thead>");
                const tbodyTag = $("<tbody>").addClass("weather-info");
                arrangedDate.forEach(date => {
                    const thTag = $("<th>").text(date);
                    theadTag.append(thTag);
                });
                // tbody
                dataChunk.forEach((eachArray, index) => {
                    const row = $("<tr>");

                    eachArray.forEach((eachData, i) => {
                        const cell = $("<td>");
                        // make sure the target is for showing icons
                        if (index === dataChunk.length-1 && i > 0) {
                            const image = $("<img>").attr("src", imageUrl(eachData));
                            cell.append(image);
                        } else {
                            cell.text(eachData);
                        }
                        row.append(cell);
                    });

                    tbodyTag.append(row);
                });

                table.append(theadTag, tbodyTag);
                $(".forecast-container").append(table);
            });
    } else {
        alert("Please fetch a city in 'Current' first before look for forecast.");
    }
}

function search() {
    city === "" ? fetchByCity("vancouver") : fetchByCity(city);
}

// fetch api and display data
function fetchByCity(city) {
    const params = {
        [query_city]: city,
        [units]: celsius,
        [appid]: apiKey
    };
    // combine into url string
    const url = base_url+query_city_router+urlConversion(params);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // store lat and lon for forecast purpose
            sessionStorage.setItem("lat", data.coord.lat);
            sessionStorage.setItem("lon", data.coord.lon);
            sessionStorage.setItem("city", data.name);
            // clear content if any
            $("#current-weather").html('');
            // get timezone from data
            const timezone = data.timezone;
            const content = $("<div>").addClass("weather-content");
            // top section
            const generalInfo = $("<div>").addClass("general-info");
            const city = $("<div>").addClass("city").text(`${data.name}, `);
            const country = $("<span>").text(data.sys.country);
            city.append(country);

            const dateTimeObject = timeConversion(data.dt, timezone);
            const dateAndTime = $("<div>").addClass("date-time");
            const dateSpan = $("<span>").addClass("date").text(dateTimeObject.date);
            const timeSpan = $("<span>").addClass("time").text(dateTimeObject.time);
            dateAndTime.append(dateSpan, " | ", timeSpan);
            
            generalInfo.append(city, dateAndTime);
            // body section
            // left-portion: including temperture, top/low temperture, and description
            const bodyInfo = $("<div>").addClass("body-info");
            const leftPortion = $("<div>").addClass("left-portion");
            const classNames = ["temperture", "top-temp", "low-temp"];
            const topAndLowTemp = $("<div>").addClass("top-low-temp");
            classNames.forEach((className, index) => {
                const celsius = $("<span>").addClass("celsius");
                switch (index) {
                    case 0:
                        const temperture = $("<div>").addClass(className).text(Math.floor(data.main.temp));
                        temperture.append(celsius);
                        leftPortion.append(temperture);
                        break;
                    case 1:
                        const topTempSpan = $("<span>").addClass(className).text(Math.floor(data.main.temp_max));
                        topTempSpan.append(celsius);
                        topAndLowTemp.append(topTempSpan, " | ");
                        break;
                    case 2:
                        const lowTempSpan = $("<span>").addClass(className).text(Math.floor(data.main.temp_min));
                        lowTempSpan.append(celsius);
                        topAndLowTemp.append(lowTempSpan);
                        break;
                    default:
                        break;
                }
            });
            leftPortion.append(topAndLowTemp);
            const description = $("<p>").text(data.weather[0].description);
            leftPortion.append(description);
            // right side portion
            const rightPortion = $("<div>").addClass("right-portion");
            const imageView = $("<img>").attr('src', imageUrl(data.weather[0].icon));
            rightPortion.append(imageView);
            bodyInfo.append(leftPortion, rightPortion);

            // bottom info
            const bottomContent = $("<div>").addClass("bottom-info");
            const ulTag = $("<ul>");
            const displayDatas = {
                "Feels Like": data.main.feels_like+String.fromCharCode(0x2103),
                "Wind": `${data.wind.speed}m/h`,
                "Humidity": `${data.main.humidity}%`,
                "Sunrise": timeConversion(data.sys.sunrise, timezone).time,
                "Sunset": timeConversion(data.sys.sunset, timezone).time
            }
            // create li data from js object
            Object.entries(displayDatas).forEach((entry) => {
                const liTag = $("<li>");
                const infoContent = $("<div>");
                const title = $("<span>").text(entry[0]);
                const info = $("<span>").text(entry[1]);
                infoContent.append(title, info);
                liTag.append(infoContent);
                ulTag.append(liTag);
            });
            
            bottomContent.append(ulTag);

            content.append(generalInfo, bodyInfo, bottomContent);
            $("#current-weather").append(content);
        })
    .catch((error) => {
        alert(error);
    });
}

// open and close menu
function toggleMenu() {
    $(".navigation").toggleClass("open");
    $(".menuToggle").toggleClass("open");
}