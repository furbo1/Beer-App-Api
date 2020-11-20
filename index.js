const express = require('express')
const app = express()
const config = require('./src/config/config')
var cors = require('cors');
var bodyParser = require('body-parser');

var db = require('./src/config/db');
app.use(cors());
app.use(bodyParser.json());


let d = db;
d.on("connected", function () {
    console.log("connected!");
});

d.on("disconnected", function () {
    console.log("disconnected!");
});

d.on("error", function (error) {
    console.log('Connection error: ' + error);
});


require('./src/config/routes')(app);


app.listen(config.port, ()=> {
    console.log('App running on port ' + config.port)
})

