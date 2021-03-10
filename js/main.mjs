import { base_url, query_city, query_city_router, units, appid, celsius } from './variables.mjs';
import { urlConversion, imageUrl, compareFile, timeConversion } from './utils.mjs';

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
                    default:
                        $("#bg").load("./img/mountainBG.svg");
                }
            });
    }
}

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

function createHeader() {
    // logo section
    const iconContainer = $("<div>").addClass("icon-container");
    const img = $("<img>").attr('src', './img/logo.png').addClass("logo-icon");
    const logoContent = $("<div>").addClass("logo-content");
    const weatherSpan = $("<span>").text("Weather\n");
    const reportSpan = $("<span>").text("Report");
    logoContent.append(weatherSpan, reportSpan);
    iconContainer.append(img, logoContent);
    // toggle menu location and add click event
    const menuToggle = $("<div>").addClass("menuToggle").click(toggleMenu);

    const menuList = ["current"];
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

function search() {
    console.log("i come here");
    city === "" ? fetchByCity("vancouver") : fetchByCity(city);
}

// fetch api and display data
function fetchByCity(city) {
    console.log("fetch triggered");
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

function toggleMenu() {
    $(".navigation").toggleClass("open");
    $(".menuToggle").toggleClass("open");
}