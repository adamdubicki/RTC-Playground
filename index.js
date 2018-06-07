var express = require('express')
var app = express()
var port = process.env.PORT || 8080;

require('dotenv').config();

app.get('/', function (req, res) {
    res.send(process.env.SECRET)
})

app.listen(port, function () {
    console.log('Example app listening on port ' + port)
})