Weather App
===

File Structure
---
```
/root 
  ├── index.html
  ├── current.html
  ├── .gitignore
  ├── /scss
  │    ├── style.scss            # main style
  │    └── _styleSettings.scss   # style settings
  ├── /js
  │    ├── current.mjs           # functions for current.html
  │    ├── variables.mjs         # static global variables
  │    └── utils.mjs             # utilities functions
  ├── /img
  │    ├── logo.png 		         # app logo
  │    └── mountainBG.svg        # index background
  └── /css
       ├── style.css             # converted style
       └── style.css.map         # converted style map
```

Phase 1
---
### HTML
- [x] index.html
- [x] current.html

### CSS
- [x] basic style in index.html and current.html

  ![](https://cdn.dribbble.com/users/1665362/screenshots/3717413/daily__001_weather_app.png)

### js
- [x] fetch data from Open Weather API
- [x] hide api key
- [x] Hamberger menu
- [x] template header
- [x] add search city
- [x] add simple error handling