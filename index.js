var express = require('express')
var app = express()

require('dotenv').config();

app.get('/', function (req, res) {
    res.send(process.env.SECRET)
})

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})