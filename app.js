 var express = require('express');
 var mongoose = require('mongoose');
 var config = require('./config');
 var app =express();
 var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
 var ip = process.env.OPENSHIFT_NODEJS_PORT || 'localhost';
 var twitterController = require('./controller/twitterController');
 var authController = require('./controller/authController');



app.use('/assets/',express.static(__dirname+'/public'));
mongoose.connect(config.getDBConnectionString());
twitterController(app);
authController(app);

 


console.log('ip = ' + ip);
console.log('port = ' + port);
app.listen(port, ip,function(){
     console.log(new Date() + ' Server is listening on port 8080');
});