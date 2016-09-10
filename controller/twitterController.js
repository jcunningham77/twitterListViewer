// var twitterAPI = require('node-twitter-api');
// var twitter = new twitterAPI({
//     consumerKey: 'KkKRSmSoRbqmanyNVOt9EcZOl',
//     consumerSecret: 'NmCcHv03EQAGeufzppep2ioQ2kNInKnrBTqfhd7ho7POQFA1wp',
//     callback: 'https://oauth.io/auth'
// });

var https = require('https');

module.exports = function(app){
    app.get('/api/twitterListData/:alias',function(req,res){

        
        var timestamp = Math.floor( Date.now() / 1000 );
        var request1 = https.request({method:'GET',
                      headers:{
                          'Authorization': 'OAuth oauth_consumer_key="KkKRSmSoRbqmanyNVOt9EcZOl", oauth_nonce="96f12991a19b9e7146cb5418c76996fb", oauth_signature="6fJl4Avk%2FXEl4s82JGlYmvtA8x0%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp +', oauth_token=' + req.param.userAuthToken +', oauth_version="1.0"' 
                      },
                      host:'api.twitter.com',
                      path:'/1.1/lists/list.json?screen-name=' + req.param.alias
                      },function(result){
                          var parsed;
                           var body;
                            result.on('data', function(d) {
                                body += d;
                            });
                            result.on('end',function(){
                                parsed = JSON.parse(body);
                            });
                            result.on('error',function(){
                                if (err){
                                    console.log(err);
                                    throw err;
                                }
                            });



                          console.log(parsed);
                          res.send(parsed);

                      });
                      request1.end();
        
    });
};     
    
    
    
    
    
    
    // this.getTwitterListData = function(alias, userAuthToken){

    //         var timestamp = Math.floor( Date.now() / 1000 );
    //         console.log('current timestamp:' + timestamp);        
    //         var config = {
    //             headers : {
    //                 'Authorization': 'OAuth oauth_consumer_key="KkKRSmSoRbqmanyNVOt9EcZOl", oauth_nonce="96f12991a19b9e7146cb5418c76996fb", oauth_signature="6fJl4Avk%2FXEl4s82JGlYmvtA8x0%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp +', oauth_token=' + userAuthToken + ', oauth_version="1.0"'                    
    //             }
    //         }

    //         console.log("about to invoke twitter API call, with alias = " + alias + " and userAuthToken = " + userAuthToken);

    //         return $http.get('https://api.twitter.com/1.1/lists/list.json?screen-name=' + alias,config).then(handleSuccess,handleError);

    // }