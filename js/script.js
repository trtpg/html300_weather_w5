
let apiCORS = "https://cors-anywhere.herokuapp.com/"
const apiURL = "http://api.openweathermap.org/data/2.5/weather"
// ?lat=35&lon=139&appid=36b77110cb8dde5daabb4b6771250ce2"
const appid = "&appid=36b77110cb8dde5daabb4b6771250ce2"
const units  = "&units=imperial"

var OnGitHub = false // change this to true if send it to GitHub

var seattle = { lat: 47.6762, lon: -122.3182 }
var london  = { lat: 51.5074, lon: 0.1278}
var weatherData = {
  "Description": "",
  "Tempurature": "",
  "Pressure": "",
  "Humidity": "",
  "Wind": ""
}

// Will run after all HTML is done rendering
window.onload = function(){
  document.getElementById("Seattle").onclick = processData;
  document.getElementById("London").onclick = processData;
}

function processData(){
  var values
  if (this.id=="Seattle"){values = {lat:seattle.lat, lon:seattle.lon} }
  if (this.id=="London") {values = {lat:london.lat, lon:london.lon} }

  // serialize them into a query string
  let queryString = queryBuilder(values)
  getWeather(queryString, this.id)
}


function getWeather(queryString, city) {
  let request = new XMLHttpRequest()

  // starts talk to API - 3 params
  // request method, url, (optional) async flag (default true)
  if (!OnGitHub){ apiCORS = "" } // not preprend CORS api when working locally
  let URLstring = apiCORS + apiURL + queryString + appid + units
  console.log("url: " + URLstring);

  request.open("GET", URLstring, true)

  // fires when the request is complete
  // long term - I want to update the DOM
  request.onload = function () {
    let quoteDiv = document.getElementById("list-container")
    let response = JSON.parse(request.response)
    console.log(response)
    //console.log(response.base)
    //console.log(response.weather)
    console.log(response.main.temp); // temp
    console.log(response.main.pressure); // pressure
    console.log(response.main.humidity); // humidity
    console.log(response.wind.speed); // wind speed
    console.log(response.weather[0].main) // cloud or rain
    console.log(response.weather[0].description) // cloud or rain

    // update new weather data to JSON weather obj
    weatherData.Description = response.weather[0].description
    weatherData.Tempurature = response.main.temp
    weatherData.Pressure = response.main.pressure
    weatherData.Humidity = response.main.humidity
    weatherData.Wind = response.wind.speed

    // display new weather into DOM
    displayWeather(city)
    // debug = response
  }

  // fires if something goes wrong
  request.error = function (errorObject) {
    console.log("bwoken :(")
    console.log(errorObject)
  }

  // send the request!
  request.send()
}

// insert text to DOM
function displayWeather(city) {
  console.log("enter displayWeather()...");
  var cityText = document.getElementById('cityName');
  cityText.innerHTML = city

  var table = document.getElementById('myTable');
  table.innerHTML="" // clear out old data
  var count = 0
  for (key in weatherData) {
    console.log(key + " = " + weatherData[key]);
    var row = table.insertRow(count);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = key;
    cell2.innerHTML = weatherData[key];
    count +=1
  }
}


function queryBuilder(queryObj){
  let holder = []
  // loop through queryObj key value pairs
  for(let key in queryObj){
    // turn each one into "key=value"
    //let convert = `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`
	  let convert = encodeURIComponent(key)+"="+encodeURIComponent(queryObj[key])

    // encodeURIComponent converts spaces and & to URI friendly values so we don't have to worry about them
    holder.push(convert)
  }
  // concatenate the pairs together, with & between
  let longString = holder.join("&")
  // prepend a ? to concatenated string
  //return `?${longString}`
  return "?"+ longString
}
