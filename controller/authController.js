var https = require('https');
var bodyParser = require('body-parser');



module.exports = function(app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.post('/api/login',function(req,res){
        // console.log('in the post endpoint for logging into backendless');
        

            // $http.post('https://api.backendless.com/v1/users/login', { login: username, password: password },config)
            //    .success(function (response) {
            //     console.log("success login = " + response.data.message);
            //        callback(response);
            //    });
            // debugger;
            console.log("about to invoke Backendless login API call, username = " + req.body.username + " and password = " + req.body.password);
            

            // return $http.post('https://api.backendless.com/v1/users/login', { login: username, password: password },config).then(handleSuccess, handleError);
            // debugger;
            // return $https.post('https://api.backendless.com/v1/users/login', { login: username, password: password },config).then(handleSuccess, handleError);

            var data = {
                "login" : req.body.username,
                "password" : req.body.password
            }          
        
            var request1 = https.request({method:'POST',
                      headers : {
                        'application-id': 'E3F4DC04-11AD-2ED4-FFD2-B5BB04809300',
                        'secret-key':'35174A73-85C1-1B39-FF93-4D01137BB900',
                        'application-type':'REST',
                        'Content-Type':'application/json'
                      },
                      host:'api.backendless.com',
                      path:'v1/users/login'
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

}