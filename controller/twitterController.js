// var twitterAPI = require('node-twitter-api');
// var twitter = new twitterAPI({
//     consumerKey: 'KkKRSmSoRbqmanyNVOt9EcZOl',
//     consumerSecret: 'NmCcHv03EQAGeufzppep2ioQ2kNInKnrBTqfhd7ho7POQFA1wp',
//     callback: 'https://oauth.io/auth'
// });

var https = require('https');
var oauth_nonce = require('oauth_nonce');
var oauth_signature = require('oauth-signature');

module.exports = function(app){
    app.get('/api/twitter-lists/:alias',function(req,res){

        var nonceValue = oauth_nonce();
        var timestamp = Math.floor( Date.now() / 1000 );

        //generate the oauth signature
        var httpMethod = 'GET';
        var url = 'https://api.twitter.com/1.1/lists/list.json';
        var parameters = {
            oauth_consumer_key : 'KkKRSmSoRbqmanyNVOt9EcZOl',
            oauth_nonce : nonceValue,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : req.headers.userauthtoken,
            oauth_version : '1.0',
            'screen-name': req.params.alias
        };
        var consumerSecret = 'NmCcHv03EQAGeufzppep2ioQ2kNInKnrBTqfhd7ho7POQFA1wp';
        var tokenSecret = req.headers.userauthtokensecret;
    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash 
        var oauthSignatureValue = oauth_signature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret,{ encodeSignature: true});


        var request1 = https.request({method:'GET',
                      headers:{
                          'Authorization': 'OAuth oauth_consumer_key="KkKRSmSoRbqmanyNVOt9EcZOl", oauth_nonce="'+nonceValue+'", oauth_signature="'+oauthSignatureValue+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="' + timestamp +'", oauth_token="' + req.headers.userauthtoken +'", oauth_version="1.0"' 
                      },
                      host:'api.twitter.com',
                      path:'/1.1/lists/list.json?screen-name=' + req.params.alias
                      },function(result){
                          var parsed;
                           var body = '';
                            result.on('data', function(d) {
                                body += d;
                            });
                            result.on('end',function(){
                                parsed = JSON.parse(body);
                                console.log(parsed);
                                res.send(parsed);
                            });
                            result.on('error',function(){
                                if (err){
                                    console.log(err);
                                    throw err;
                                }
                            });

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