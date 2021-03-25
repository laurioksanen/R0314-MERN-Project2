// tuodaan tarvittavat moduulit
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
var http = require("http");
//alustetaan express
const app = express();
//luodaan PORT muuttuja
const PORT = process.env.PORT || 8081;

//bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

//alustetaan api avain muuttujaan
const apikey = "0b3b10ced3c6aaebd87f676f62aa34a6";

//asetetaan ejs käyttöön
app.set("view engine","ejs");

//etusivu
app.get("/",(req,res)=>{
     res.render("pages/index")
     

    //     i:true
    // });
});

//kun käyttäjä hakee kaupunkia tätä kutsutaan
app.post("/searchcity",(req,res)=>{
    //alustetaan muuttujia
    var city = req.body.City;
    var url ="https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+apikey
    var weather, icon, temp, feelslike, humidity, speed;
    //ajax api request jossa haetaan sää tietoja, jos kaupunkia ei löydy ohjataan käyttäjä etusivulle
        request(
        url,
        { json: true },
        (err, response, body)=>{
            if(err) return console.error(err);
            if(body.cod=="404") return res.redirect("/");
            weather = body.weather[0].main
            icon= body.weather[0].icon
            temp= body.main.temp
            feelslike = body.main.feels_like
            humidity = body.main.humidity
            speed= body.wind.speed
        }
    )
    //sivun latausta tahalleen hidastetaan sleep fuction avulla, jotta api request ehtii valmistua
    // kun aika on ladataan ejs sivu uusilla parametreillä
    sleep(500).then(() => {
        res.render("pages/index", {
            i:false,
            new_heading:city,
            new_paragraph:"The weather in " + city + " is " + weather,
            new_image:"http://openweathermap.org/img/wn/"+ icon +"@2x.png",
            new_temperature:temp +"°C",
            new_feelslike:feelslike +"°C",
            new_humidity:humidity+"%",
            new_speed:speed+"m/s"
        })
    })
});

//portin kuuntelu
app.listen(PORT, function(){
    console.log("Server runs");
});

//sleep functio kopsattu jostain stackoverflowsta
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};