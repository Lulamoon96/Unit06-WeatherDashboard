let weathCard = document.getElementById("currWeathCard")
let weatherUlt = document.getElementById("weathCard")
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


$('ul').on("click", 'a', function(){

    var city = this.parentElement.getAttribute("cityname")
    $("#cityName").val(city)
    $("#citySubmit").trigger("click")

})

// $("a").on('click', function(){

//     console.log(true)
//     var city = this.parentElement.getAttribute("cityname")
//     $("#cityName").val(city)
//     console.log($("#cityName").val())

// })

$("#citySubmit").click(function() {

    if (weatherUlt.classList.contains('invisible')) {
        weatherUlt.classList.toggle('invisible')
        weatherUlt.classList.toggle('visible')
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
        var windMPH = response.wind.speed * 2.237
        $("#windSpd").html("<b>Wind Speed</b>: " + windMPH + " MPH")

    })

    $.ajax({

      url: queryForecastURL,
      method: "GET"

    }).then(function(response) {

        var weathers = []
        weathers.push(response.list[2], response.list[11], response.list[20], response.list[29], response.list[38])
        console.log(weathers)
        weathers.forEach(function(day){

            var toEdit = weathers.indexOf(day)
            var timestamp = day.dt
            var date = new Date(timestamp * 1000)
            var dd = String(date.getDate()).padStart(2, '0')
            var mm = String(date.getMonth() + 1).padStart(2, '0')
            var yyyy = date.getFullYear()
            date = mm + '/' + dd + '/' + yyyy
            var iconURL = "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png"
            var tempC = day.main.temp - 273.15
            var tempF = (day.main.temp - 273.15) * 1.8 + 32
            $("#date" + toEdit).text(date)
            $("#icon" + toEdit).attr("src", iconURL)
            $("#temp" + toEdit).html("<b>Temp</b>: " + tempF.toFixed(2) + "°F (" + tempC.toFixed(2) + "°C)")
            $("#humid" + toEdit).html("<b>Humidity</b>: " + day.main.humidity + "%")

        })


    })

})

