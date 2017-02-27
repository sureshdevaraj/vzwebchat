"use strict";
require('dotenv').config();
const express = require("express");
const ejs_1 = require("ejs");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const guid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
app.post('/', (req, res) => {
    res.cookie('settings', req.body);
    res.redirect('/');
});
app.get('/', (req, res) => {
    const appSecret ='8-9_vtV_0Bw.cwA.ty8.lwNNtHfAJSmjOokhNOBe4L6IGpkD02lYsQTDxs-0Go4';// (req.cookies.settings && req.cookies.settings.secret) || process.env.APP_SECRET;
    const endpoint = 'https://directline.botframework.com/v3/directline/tokens/generate';
    const auth = 'Bearer';
    fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `${auth} ${appSecret}`, Accept: "application/json" }
    }).then(response => response.json()).then(result => {
        const token = result["token"];
        console.log("token", token, "retrieved at", new Date());
        ejs_1.renderFile("./index.ejs", {
            token,
            secret: req.cookies.settings && req.cookies.settings.secret
        }, (err, str) => {
            if (err)
                console.log("ejs error", err);
            else
                res.send(str);
        });
    });
});
app.listen(process.env.port || process.env.PORT || 3000, () => {
    console.log('listening');
});
