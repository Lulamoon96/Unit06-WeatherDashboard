let weathCard = document.getElementById("currWeathCard")
let cities = []
let cityList = document.getElementById ("prevCities")

init()

function init() {
    // Get stored todos from localStorage
    // Parsing the JSON string to an object
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    // If todos were retrieved from localStorage, update the todos array to it
    if (storedCities !== null) {
      cities = storedCities;
    }
  
    // Render todos to the DOM
    renderCities();
}

function renderCities() {
    // Clear todoList element and update todoCountSpan
    cityList.innerHTML = "";

    // Render a new li for each todo
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


$("a").click(function(){

    var city = this.parentElement.getAttribute("cityname")
    
    console.log(city)

})

$("#citySubmit").click(function() {

    if (weathCard.classList.contains('invisible')) {
        weathCard.classList.toggle('invisible')
        weathCard.classList.toggle('visible')
    }
 
    event.preventDefault()

    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()
    today = mm + '/' + dd + '/' + yyyy

    var city = $("#cityName").val()

    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + 
        city + "&appid=7ac1bb50f3155ba6ff66a3815eaa730d"
    

    var queryCurrURL = "https://api.openweathermap.org/data/2.5/weather?q=" + 
        city + "&appid=7ac1bb50f3155ba6ff66a3815eaa730d"


    $.ajax({

        url: queryCurrURL,
        method: "GET"

    }).then(function(response) {

        if (!cities.includes(response.name)){

            cities.unshift(response.name)

        }

        else {
            
            let cityIndex = cities.indexOf(response.name)
            cities.splice(cityIndex, 1)
            cities.unshift(response.name)

        }

        storeCities()
        renderCities()
        var lat = response.coord.lat
        var lon = response.coord.lon
        var uviURL = "http://api.openweathermap.org/data/2.5/uvi?appid=7ac1bb50f3155ba6ff66a3815eaa730d&lat="
            + lat + "&lon=" + lon

        $.ajax({

            url: uviURL,
            method: "GET"
            
        }).then(function(response) {

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

            $("#UVI").html("<b>UV Index</b>:")
            $("#UVIAlert").text(UVIndex)

        })

        var weatherDesc = response.weather[0].description
        var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"

        var tempC = response.main.temp - 273.15
        var tempF = (response.main.temp - 273.15) * 1.8 + 32
        $("#cityNameDisp").html(response.name + " (" + today + ") "
        + "<img src = '" + iconURL + "' alt=" + weatherDesc +">")
        $("#temp").html("<b>Temperature</b>: " + tempF.toFixed(2) + "°F (" + tempC.toFixed(2) + "°C)")
        $("#humid").html("<b>Humidity</b>: " + response.main.humidity + "%")
        $("#windSpd").html("<b>Wind Speed</b>: " + response.wind.speed + " m/s")

    })

    $.ajax({

      url: queryForecastURL,
      method: "GET"

    }).then(function(response) {

        console.log(response)

    })

})

