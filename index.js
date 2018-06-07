var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var Pusher = require('pusher')
var bodyParser = require('body-parser')
var crypto = require("crypto");
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
let faker = require('faker');
require('dotenv').config();

var pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_SECRET_KEY,
    cluster: 'us2',
    encrypted: true
});

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('I am ready to go.')
})

app.post('/agora/start-chat', function (req, res) {
    var channel = crypto.randomBytes(20).toString('hex');
    
    req.body.channels.forEach(element => {
        pusher.trigger(element, 'new-conversation', {
            "channel-name": channel,
        });
    });
    res.send(channel);
})

app.post('/twilio/start-chat', function (req, res) {
    let response = [];
    req.body.channels.forEach(element => {
        var identity = faker.name.findName();
        var token = new AccessToken(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_API_KEY,
            process.env.TWILIO_API_SECRET
        );
        token.identity = identity;

        const grant = new VideoGrant({'room': 'fresh-room'});

        token.addGrant(grant);
        let payload = {
            "token": token.toJwt(),
            "room": 'fresh-room'
        };
        response.push(payload);
        pusher.trigger(element, 'new-conversation', payload);
    });

    res.send(response);
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port)
})