require('newrelic');

//Express server
var express = require("express");
var app = express();

//included libraries
var logfmt = require("logfmt");
		
app.use(logfmt.requestLogger());

app.use(express.static(__dirname + '/public'));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});