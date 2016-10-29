var https = require('https');
var bodyParser = require('body-parser');
var config = require('../config');



module.exports = function(app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    var backendlessHeaders = config.getBackendlessConfigValues();

    app.post('/api/login',function(req,res){
   
            console.log("about to invoke Backendless login API call, username = " + req.body.username + " and password = " + req.body.password);
            

            var data = {
                "login" : req.body.username,
                "password" : req.body.password
            }          
        
            var request1 = https.request({method:'POST',
                      headers : backendlessHeaders,
                      host:'api.backendless.com',
                      path:'/v1/users/login'
                      },function(result){
                          
                          var parsed;
                           var body = '';
                            result.on('data', function(d) {
                                body += d;
                            });
                            result.on('end',function(){
                                console.log('in end clause of backendless login post callback - body = ' + body);
                                parsed = JSON.parse(body);
                                console.log('in authController node endpoint for login - end ' + parsed);
                                res.send(parsed);
                            });
                            result.on('error',function(){
                                if (err){
                                    console.log('in authController node endpoint for login - error - ' + err);
                                    console.log(err);
                                    throw err;
                                }
                            });

                      });
                     console.log("data = " + JSON.stringify(data));
                      request1.write(JSON.stringify(data));
                      
                      request1.end();
    });

    function mapLoginResponseToBO(loginResponse){
        var loginResponseBO = {
            
        }


    }

    app.post('/api/register',function(req,res){
   
            var user = {
                email:req.body.email,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                password:req.body.password
            }

            console.log("about to invoke Backendless registration API call, user = " + JSON.stringify(user));      
        
            var request1 = https.request({method:'POST',
                      headers : backendlessHeaders,
                      host:'api.backendless.com',
                      path:'/v1/users/register'
                      },function(result){
                          
                          var parsed;
                           var body = '';
                            result.on('data', function(d) {
                                body += d;
                            });
                            result.on('end',function(){
                                console.log('in end clause of backendless register post callback - body = ' + body);
                                parsed = JSON.parse(body);
                                console.log('in authController node endpoint for register - end ' + parsed);
                                res.send(parsed);
                            });
                            result.on('error',function(){
                                if (err){
                                    console.log('in authController node endpoint for register - error - ' + err);
                                    console.log(err);
                                    throw err;
                                }
                            });

                      });                     
                      request1.write(JSON.stringify(user));                      
                      request1.end();
    });
}