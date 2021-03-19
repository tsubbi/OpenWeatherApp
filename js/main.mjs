import { compareFile } from './utils.mjs';
import { getCurrentWeatherData, handleException, getForecast } from './apiRouter.mjs';

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
        fetch("https://tsubbi.github.io/OpenWeatherApp/config.json")
            .then(response => response.json())
            .then(data => {
                apiKey = data.API_KEY;
                switch (target) {
                    case "current.html":
                        // do initial fetch
                        search();
                        // set interval of refresh in every 2 minute
                        setInterval(search, (60*2*1000));
                        break;
                    case "forecast.html":
                        displayForecast();
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
    if (!input.val()) {
        handleException("User Input is Empty", 600);
    } else {
        city = input.val();
        displayCurrentCity(input.val());
        input.val("");
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

function displayForecast() {
    // get data from session storage
    const latValue = sessionStorage.getItem("lat");
    const lonValue = sessionStorage.getItem("lon");

    // if we can get the lat and lon, we can fetch the data from internet
    if (latValue && lonValue) {
        getForecast(latValue, lonValue, apiKey, data => {
            $("h1").text(sessionStorage.getItem("city"));
            const rowTitle = [" ", "Sunrise", "Sunset", "Temp", "Feels\nLike", "Humidity", "Wind"];
            const table = $("<table>");
            const theadTag = $("<thead>");
            const tbodyTag = $("<tbody>").addClass("weather-info");

            // thead
            rowTitle.forEach(title => {
                const thTag = $("<th>").text(title);
                theadTag.append(thTag);
            });
            // tbody
            data.daily.forEach(eachRow => {
                const row = $("<tr>");
                const rowDatas = Object.values(eachRow);
                rowDatas.forEach((eachData, i) => {
                    const cell = $("<td>");
                    cell.append(eachData);
                    // if it's the first index
                    if (i === 0) {
                        // add image below the data
                        const image = $("<img>").attr("src", rowDatas[rowDatas.length-1]);
                        cell.append(image);
                    } else if (i === rowDatas.length-1) { // since move the image to the first column, do nothing in this block
                        return;
                    } 
                    row.append(cell);
                });
                tbodyTag.append(row);
            });
            table.append(theadTag, tbodyTag);
            $(".forecast-container").append(table);
        });
    } else {
        handleException("Please fetch a city in 'Current' first before looking for forecast", 601);
    }
}

function search() {
    city === "" ? displayCurrentCity("vancouver") : displayCurrentCity(city);
}

// display data
function displayCurrentCity(city) {
    getCurrentWeatherData(city, apiKey, data => {
        // clear content if any
        $("#current-weather").html('');

        const content = $("<div>").addClass("weather-content");
        // top section
        const generalInfo = $("<div>").addClass("general-info");
        const city = $("<div>").addClass("city").text(`${data.name}, `);
        const country = $("<span>").text(data.country);
        city.append(country);

        const dateAndTime = $("<div>").addClass("date-time");
        const dateSpan = $("<span>").addClass("date").text(data.date);
        const timeSpan = $("<span>").addClass("time").text(data.time);
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
                const temperture = $("<div>").addClass(className).text(data.temperture);
                temperture.append(celsius);
                leftPortion.append(temperture);
                break;
            default:
                // check if the object is last
                const isLastIndex = index === classNames.length-1;
                // get the corresponding temperature
                const temp = isLastIndex ? data.minTemp : data.maxTemp;
                const tempSpan = $("<span>").addClass(className).text(temp);
                // add seperator between each span
                topAndLowTemp.append(tempSpan , isLastIndex ? "" :  " | ");
                break;
            }
        });
        leftPortion.append(topAndLowTemp);
        const description = $("<p>").text(data.description);
        leftPortion.append(description);
        // right side portion
        const rightPortion = $("<div>").addClass("right-portion");
        const imageView = $("<img>").attr('src', data.icon);
        rightPortion.append(imageView);
        bodyInfo.append(leftPortion, rightPortion);

        // bottom info
        const bottomContent = $("<div>").addClass("bottom-info");
        const ulTag = $("<ul>");
        const displayDatas = {
            "Feels Like": data.feelsLike,
            "Wind": data.wind,
            "Humidity": data.humidity,
            "Sunrise": data.sunrise,
            "Sunset": data.sunset
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
    });
}

// open and close menu
function toggleMenu() {
    $(".navigation").toggleClass("open");
    $(".menuToggle").toggleClass("open");
}