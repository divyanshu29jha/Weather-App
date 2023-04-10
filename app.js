const express = require("express");		// npm i express
const bodyParser = require("body-parser");	// npm i body-parser
const https = require("https");
const {config} = require("dotenv");
config();

const app = express();

app.set("view engine", "ejs");  // npm i ejs

app.use(bodyParser.urlencoded({ extended: true }));

let city = "-", tmp= "-", maxTmp= "-", minTmp= "-", humid= "-", precip= "-", feel= "-", wind= "-", sunR= "-", sunS= "-";

app.get("/", (req, res) => {
	res.render("index", {
		yourCity: city,
		temp: tmp,
		maxTemp: maxTmp,
		minTemp: minTmp,
		humidity: humid,
		pct: precip,
		feelsLike: feel,
		windSpeed: wind,
		sunrise: sunR,
		sunset: sunS
	});
})

app.post("/", (req, res) => {

	const myCity = req.body.cityName;	// using body-parser, attribute name="cityName" in the form.
	const options = {
		"method": "GET",
		"hostname": "weather-by-api-ninjas.p.rapidapi.com",
		"port": null,
		"path": "/v1/weather?city=" + myCity,
		"headers": {
			"X-RapidAPI-Key": process.env.API_KEY,
			"X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
			"useQueryString": true
		}
	};

	let data="";
	const request = https.request(options, function (response) {
		const chunks = [];

		response.on("data", function (chunk) {
			chunks.push(chunk);
		});

		response.on("end", function () {
			const body = Buffer.concat(chunks);
			let str = body.toString();
			data = JSON.parse(str);
			city = myCity;
			tmp = data.temp;
			maxTmp = data.max_temp;
			minTmp = data.min_temp,
			humid = data.humidity;
			precip = data.cloud_pct;
			feel = data.feels_like;		
			wind = data.wind_speed;
			sunR = data.sunrise;
		    sunS = data.sunset;
			res.redirect("/");
		});	
		
	});
	
	request.end();
	
})

app.listen(3000, () => {
	console.log("Server is running on port 3000...");
})
