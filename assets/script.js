//Selecting a few divs we need to edit from the document
let weathCard = document.getElementById("currWeathCard")
let weatherUlt = document.getElementById("weathCard")
let cityList = document.getElementById ("prevCities")

//Starting a new city list in case none are in storage yet
let cities = []

init()

function init() {
    // Get stored city list from localStorage
    // Parsing the JSON string to an object
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
      cities = storedCities;
    }
  
    // Render cities to the DOM
    renderCities();
}

function renderCities() {
    // Clear cityList element
    cityList.innerHTML = "";

    // Render a new li for each city
    cities.forEach(function(city){ 
        
        var li = document.createElement("li")
        li.innerHTML = "<a class='nav-link' href='#'>" + city + "</a>"
        li.setAttribute("cityname", city)
        cityList.appendChild(li)

    })

}

function storeCities() {
    // Stringify and set "todos" key in localStorage to todos array
    localStorage.setItem("cities", JSON.stringify(cities));
}

//Handles clicks on previously searched cities
$('ul').on("click", 'a', function(){

    //Uses cityname attribute to start the search for that city
    var city = this.parentElement.getAttribute("cityname")
    $("#cityName").val(city)
    $("#citySubmit").trigger("click")

})

//Handles what happens when search button is clicked
$("#citySubmit").click(function() {

    //Makes the weather card visible
    if (weatherUlt.classList.contains('invisible')) {
        weatherUlt.classList.toggle('invisible')
        weatherUlt.classList.toggle('visible')
    }
 
    event.preventDefault()

    //Getting and formatting today's date
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()
    today = mm + '/' + dd + '/' + yyyy

    //City that was searched for
    var city = $("#cityName").val()

    //Formatting the URLs for the ajax call
    //Both a call for the current forecast and a five day weather forecast
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + 
        city + "&appid=7ac1bb50f3155ba6ff66a3815eaa730d"
    

    var queryCurrURL = "https://api.openweathermap.org/data/2.5/weather?q=" + 
        city + "&appid=7ac1bb50f3155ba6ff66a3815eaa730d"

    //Ajax call for current day's forecast
    $.ajax({

        url: queryCurrURL,
        method: "GET"

    }).then(function(response) {

        //Adds searched city to cities list
        if (!cities.includes(response.name)){

            cities.unshift(response.name)

        }

        //If city has already been searched for, does not get appended again
        //Gets moved to top
        else {
            
            let cityIndex = cities.indexOf(response.name)
            cities.splice(cityIndex, 1)
            cities.unshift(response.name)

        }

        //Store the cities list and rerender cities list element with new cities
        storeCities()
        renderCities()

        //Acquiring latitude and longitude for the UV Index
        //Setting up the URL for the UV index call
        var lat = response.coord.lat
        var lon = response.coord.lon
        var uviURL = "https://api.openweathermap.org/data/2.5/uvi?appid=7ac1bb50f3155ba6ff66a3815eaa730d&lat="
            + lat + "&lon=" + lon

        //This ajax call is specifically for the UV index
        $.ajax({

            url: uviURL,
            method: "GET"
            
        }).then(function(response) {

            //Bunch of comparison values to determine what the color of the UVI alert box will be
            var UVIndex = response.value
            $("#UVIAlert").attr('class', 'alert')

            if (UVIndex < 3) {

                $("#UVIAlert").addClass('alert-success')

            }

            if (UVIndex === 3 || UVIndex > 3 && UVIndex < 6) {

                $("#UVIAlert").addClass('alert-warning')

            }

            if (UVIndex === 6 || UVIndex > 6 && UVIndex < 8) {

                $("#UVIAlert").addClass('alert-mid')

            }

            if (UVIndex === 8 || UVIndex > 8 && UVIndex < 11) {

                $("#UVIAlert").addClass('alert-danger')

            }

            if (UVIndex === 11 || UVIndex > 11) {

                $("#UVIAlert").addClass('alert-high')

            }

            //Setting the text for the UV alert box
            $("#UVI").html("<b>UV Index</b>:")
            $("#UVIAlert").text(UVIndex)

        })

        //Getting the wearther description for the city searched for
        //Acquiring the correct icon for the weather from Open Weather
        var weatherDesc = response.weather[0].description
        var iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"

        //Appending all the correct information to the right divs
        var tempC = response.main.temp - 273.15
        var tempF = (response.main.temp - 273.15) * 1.8 + 32
        $("#cityNameDisp").html(response.name + " (" + today + ") "
        + "<img src = '" + iconURL + "' alt=" + weatherDesc +">")
        $("#temp").html("<b>Temperature</b>: " + tempF.toFixed(2) + "°F (" + tempC.toFixed(2) + "°C)")
        $("#humid").html("<b>Humidity</b>: " + response.main.humidity + "%")
        var windMPH = (response.wind.speed * 2.237).toFixed(2)
        $("#windSpd").html("<b>Wind Speed</b>: " + windMPH + " MPH")

    })


    //Ajax call for the five day weather forecast
    $.ajax({

      url: queryForecastURL,
      method: "GET"

    }).then(function(response) {

        //Looking at the response returned, I was able to determine which list indices should return the forecast at 1200
        //Adds them to an array to be iterated through
        var weathers = []
        weathers.push(response.list[2], response.list[11], response.list[20], response.list[29], response.list[38])
        console.log(response)
        //Iterate through each day
        weathers.forEach(function(day){
            
            //Method to call the correct card to edit the weather for
            var toEdit = weathers.indexOf(day)

            //Setting the date from the UNIX timestamp
            var timestamp = day.dt
            var date = new Date(timestamp * 1000)
            console.log(date)
            var dd = String(date.getDate()).padStart(2, '0')
            var mm = String(date.getMonth() + 1).padStart(2, '0')
            var yyyy = date.getFullYear()
            date = mm + '/' + dd + '/' + yyyy

            //Appending all the weather info to the correct div
            var iconURL = "https://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png"
            var tempC = day.main.temp - 273.15
            var tempF = (day.main.temp - 273.15) * 1.8 + 32
            $("#date" + toEdit).text(date)
            $("#icon" + toEdit).attr("src", iconURL)
            $("#temp" + toEdit).html("<b>Temp</b>: " + tempF.toFixed(2) + "°F (" + tempC.toFixed(2) + "°C)")
            $("#humid" + toEdit).html("<b>Humidity</b>: " + day.main.humidity + "%")

        })


    })

})

