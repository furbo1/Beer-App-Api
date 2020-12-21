const express = require('express')
const app = express()
const config = require('./src/config/config')
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;


const db = require('./src/config/db');
const { countDocuments } = require('./src/user/user.model');
app.use(cors());
app.use(bodyParser.json({
     limit: "10mb"
}
));

cloudinary.config({
    cloud_name: 'duicagu0n',
    api_key: process.env.CLOUDINAIRY_KEY || "416923112657195" ,
    api_secret: process.env.CLOUDINAIRY_SECRET || "SAJwBJdIFRAc88XPzkz23mskhGA"
});


let d = db;
d.on("connected", function () {
    console.log("connected!");
});

d.on("disconnected", function () {
    console.log("disconnected!");
});

d.on("error", function (error) {
    console.log('Connection error: ' + error);
})

require('./src/config/routes')(app);


app.listen(config.port, ()=> {
    console.log('App running on port ' + config.port)
})

