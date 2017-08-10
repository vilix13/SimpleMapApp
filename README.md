# SimpleMapApp
React-redux map application (jwt auth, 2gis-api, google places api)

This is the implementation of the test task for working with map api.

## The following features are implemented in the project:

* JWT authentication.
* JWT validating on server side for each page requiring authorization.
* Implemented higher order component (HOC) for manage access to pages requiring authorization.
* JWT authentication middleware for server side (node+express).
* Sign up.
* Client and server side validation for signup and signin forms.
* User api.
* Auth api.
* Map features:
  * Draw marker of the current location. (*Do not forget to allow use of geolocation in your browser settings)
  * ZoomIn\ZoomOut buttons implementation.
  * Adding user markers via double click on map.
  * Save\Load user markers to\from server.
  * Draw markers on the map with the closest chosen objects (pharmacies, gas stations, schools,  restaurants).
* Environment feuters:
  * Implemented React + Redux + React router Architecture.
  * Implemented easy to maintain and good scaling files structure.
  * Webpack configs for dev (with hot reload and redux dev tools support) and prod env.
  * Configured webpack and babel for es6 and react syntax.
  * Configured Less to css compile.
  * Configured uri-loader for components images.
  
## Instalation
```
git clone https://github.com/vilix13/SimpleMapApp.git
cd ./SimpleMapApp
npm install
```
## Run
`npm run server:dev` for development and `npm run server:prod` for prodaction.
## Config
In `server/config.js` you can configure jwtSecret and mongouri.
