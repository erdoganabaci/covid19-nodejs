const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require("body-parser");
const rp = require("request-promise-native");
const request = require("request");
const path = require('path');

class CoronaWorld {
    constructor(countryName, countryCode, totalConfirmed, newConfirmed, totalDeaths, newRecovered, totalRecovered, date) {
        this.countryName = countryName;
        this.countryCode = countryCode;
        this.totalConfirmed = totalConfirmed;
        this.newConfirmed = newConfirmed;
        this.totalDeaths = totalDeaths;
        this.newRecovered = newRecovered;
        this.totalRecovered = totalRecovered;
        this.date = date;

    }
}

const PORT = process.env.PORT || 5000;

console.log("test");

//Templete Engine Middleware
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "mainLayout",
    })
);
app.set("view engine", "handlebars");

//Body Parser Middleware
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(express.static(path.join(__dirname, '/assets')));

app.get("/", function(req, res) {
    //var coronaTest = getData();
    /*res.render('pages/homepage', {
          name: 'xyz'
      })*/

    /*var url =
        "http://developer.cumtd.com/api/v2.2/json/GetStop?" +
        "key=d99803c970a04223998cabd90a741633" +
        "&stop_id=it";*/
    var url = "https://api.covid19api.com/summary";
    var countryName;
    var countryCode;
    var totalConfirmed;
    var newConfirmed;
    var totalDeaths;
    var newRecovered;
    var newRecovered;
    var totalRecovered;
    var date;
    request({
            url: url,
            json: true,
        },
        function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var myJSON = JSON.stringify(body);
                var objectValue = JSON.parse(myJSON);
                var globalJson = objectValue['Countries'];

                globalJson.forEach(function(country) {
                    var countryNameFromJson = country.Country;
                    if (countryNameFromJson == "Turkey") {
                        countryName = countryNameFromJson;
                        countryCode = country.CountryCode;
                        newConfirmed = country.NewConfirmed;
                        totalConfirmed = country.TotalConfirmed;
                        totalDeaths = country.TotalDeaths;
                        newRecovered = country.NewRecovered;
                        totalRecovered = country.TotalRecovered;
                        date = country.Date;


                        console.log(country.TotalConfirmed);

                    }
                });
                var d = new Date(date);
                date = d.toString();
                let serverDateConverted = date.split("T")[0];
                let serverTimeConverted = new Date(date).toTimeString();
                console.log(d.toString());
                let coronaTurkey = new CoronaWorld(countryName, countryCode, totalConfirmed, newConfirmed, totalDeaths, newRecovered, totalRecovered, date);

                //console.log(countryName);
                console.log(coronaTurkey.countryName);

                console.log(coronaTurkey);

                //console.log(globalJson[0]);

                //console.log(objectValue1["Country"]);
                //console.log(myJSON);
                //var myJSON = JSON.stringify(globalJson);
                //var objectValue1 = JSON.parse(myJSON1);
                /*for (var attributename in myJSON1) {
                    console.log(attributename + ": " + myJSON1[attributename]);
                }*/
                res.render('pages/homepage', {
                    coronaTurkey: coronaTurkey
                });


            }
        }
    );
});

app.use((req, res) => {
    //res.render("static/404");
    //res.send("NOT FOUND");
    res.sendFile(path.join(__dirname, 'views/static/404.html'));

    //res.render("static/404.html");
});





/*async function getData() {
    try {
        var options = {
            uri: "https://reqres.in/api/users/2",
            json: true,
        };

        var response = await rp(options);
        return response;
    } catch (error) {
        throw error;
    }
}

try {
    console.log(getData());
} catch (error) {
    console.log(error);
}*/

app.listen(PORT);