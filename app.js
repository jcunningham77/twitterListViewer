 var express = require('express');
 var mongoose = require('mongoose');
 var config = require('./config');
 var app =express();
 var port = process.env.PORT || 3000;
 var twitterController = require('./controller/twitterController');



 app.use('/assets/',express.static(__dirname+'/public'));
 mongoose.connect(config.getDBConnectionString());
 twitterController(app);

 app.listen(port);