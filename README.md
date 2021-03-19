Weather App
===

File Structure
---
```
/root 
  ├── index.html
  ├── current.html
  ├── forcast.html
  ├── .gitignore
  ├── /scss
  │    ├── style.scss            # main style
  │    └── _styleSettings.scss   
  ├── /js
  │    ├── /Model
  │    │    ├── CurrentWeather.mjs
  │    │    └── ForecastData.mjs
  │    ├── main.mjs              # main entrance of script
  │    ├── apiRouters.mjs    		 # api fetchers
  │    ├── variables.mjs         # static global variables
  │    └── utils.mjs             # utilities functions
  ├── /img
  │    ├── logo.png 		         # app logo
  │    └── mountainBG.svg        # index background
  └── /css
       ├── style.css             # converted style
       └── style.css.map         # converted style map
```

Phase3
---

### JS
- [x] refector the code
  - [x] Separate functions into different functions
- [ ] add switch for F
- [x] tidy up code for main files
- [x] Fix bug on load svg
- [x] Fix the displaying for api key

### CSS
- Modify forecast.html if necessary.
- [x] add media query for forecast.html



Phase 2
---

### HTML
- [x] ~~forecast.html~~

### CSS
- not enough time to have a good css design
- [x] ~~Make index's bg can be moveable~~

### JS
- [x] ~~add forcast api~~
- [x] ~~Populate data once fetched~~



Phase 1
---

### HTML
- [x] ~~index.html~~
- [x] ~~current.html~~

### CSS
- [x] ~~basic style in index.html and current.html~~
  ![](https://cdn.dribbble.com/users/1665362/screenshots/3717413/daily__001_weather_app.png)

### js
- [x] ~~fetch data from Open Weather API~~
- [x] ~~hide api key~~
- [x] ~~Hamberger menu~~
- [x] ~~template header~~
- [x] ~~add search city~~
- [x] ~~add simple error handling~~
