$("#citySubmit").click(function() {

    event.preventDefault()
    var city = $("#cityName").val()

    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + 
        city + "&appid=7ac1bb50f3155ba6ff66a3815eaa730d"
    

    var queryCurrURL = "https://api.openweathermap.org/data/2.5/weather?q=" + 
        city + "&appid=7ac1bb50f3155ba6ff66a3815eaa730d"


    $.ajax({

        url: queryCurrURL,
        method: "GET"

    }).then(function(response) {

        console.log(response)
        $("#cityNameDisp").text(response.name)

    })

    // $.ajax({

    //   url: queryForecastURL,
    //   method: "GET"

    // }).then(function(response) {

    //     console.log(response)

    // })


})
