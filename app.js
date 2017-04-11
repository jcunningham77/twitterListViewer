 var express = require('express');
 var mongoose = require('mongoose');
 var config = require('./config');
 
 var app =express();
 var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
 var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
 var twitterController = require('./controller/twitterController');
 var authController = require('./controller/authController');
 var i18nController = require('./controller/i18nController');




app.use('/assets/',express.static(__dirname+'/public'));
mongoose.connect(config.getDBConnectionString());
twitterController(app);
authController(app);
i18nController(app);

 


console.log('ip = ' + ip);
console.log('port = ' + port);
app.listen(port, ip,function(){
     console.log(new Date() + ' Server is listening on port 8080');
});