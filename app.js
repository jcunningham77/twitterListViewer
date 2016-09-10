 var express = require('express');
 var app =express();
 var port = process.env.PORT || 3000;
 var twitterController = require('./controller/twitterController');

 app.use('/assets/',express.static(__dirname+'/public'));

 twitterController(app);

 app.listen(port);