 var express = require('express');
 var mongoose = require('mongoose');
 var config = require('./config');
 var app =express();
 var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
 var twitterController = require('./controller/twitterController');
 var authController = require('./controller/authController');



 app.use('/assets/',express.static(__dirname+'/public'));
 mongoose.connect(config.getDBConnectionString());
 twitterController(app);
 authController(app);

 app.listen(port);