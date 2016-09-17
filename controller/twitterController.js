// var twitterAPI = require('node-twitter-api');
// var twitter = new twitterAPI({
//     consumerKey: 'KkKRSmSoRbqmanyNVOt9EcZOl',
//     consumerSecret: 'NmCcHv03EQAGeufzppep2ioQ2kNInKnrBTqfhd7ho7POQFA1wp',
//     callback: 'https://oauth.io/auth'
// });

var https = require('https');
var oauth_nonce = require('oauth_nonce');
var oauth_signature = require('oauth-signature');
var DefaultLists = require('../model/defaultListModel');
var bodyParser = require('body-parser');



module.exports = function(app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));


    app.post('/api/default-list',function(req,res){
        console.log('in the post endpoint for setting default list');
        var defaultList;
        DefaultLists.findOneAndUpdate({alias:req.body.data.alias},
                    {alias:req.body.data.alias,listId:req.body.data.listId},
                    {new:true,upsert:true},
                    function(err,result){
                        if(err){
                            console.log(err);
                            throw err;
                        }else{
                            defaultList = result;
                        }
                    });
        res.send(defaultList); 
    });

    app.get('/api/default-list/:alias',function(req,res){
        console.log('in the get endpoint for getting default list, alias = ' + req.params.alias);
        DefaultLists.findOne({alias:req.params.alias},
                    function(err,result){
                        if(err){
                            console.log(err);
                            // throw err;
                            res.status('500').send({message:'Internal Server Error'});
                        }
                        if (result){
                            console.log('default list id = ' + result.listId);
                            res.status('200').send(result);
                        }else {
                            console.log('not found');
                            res.status('404').send();
                        }
                        
                    });
                    
                 
    });

    app.get('/api/twitter-lists/:alias',function(req,res){

        var nonceValue = oauth_nonce();
        var timestamp = Math.floor( Date.now() / 1000 );
        var oauthSignatureValue = prepareTwitterOauthSignatureForLists('GET','https://api.twitter.com/1.1/lists/list.json',timestamp,nonceValue,req.params.alias,req.headers.userauthtoken,req.headers.userauthtokensecret);

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
                                // console.log(parsed);
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

   app.get('/api/twitter-list/:listId',function(req,res){

        var nonceValue = oauth_nonce();
        var timestamp = Math.floor( Date.now() / 1000 );
        var oauthSignatureValue = prepareTwitterOauthSignatureForList('GET','https://api.twitter.com/1.1/lists/statuses.json',timestamp,nonceValue,req.params.listId,req.headers.userauthtoken,req.headers.userauthtokensecret);

        var listRequest = https.request({method:'GET',
                      headers:{
                          'Authorization': 'OAuth oauth_consumer_key="KkKRSmSoRbqmanyNVOt9EcZOl", oauth_nonce="'+nonceValue+'", oauth_signature="'+oauthSignatureValue+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="' + timestamp +'", oauth_token="' + req.headers.userauthtoken +'", oauth_version="1.0"' 
                      },
                      host:'api.twitter.com',
                      path:'/1.1/lists/statuses.json?list_id=' + req.params.listId
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
                      listRequest.end();
    });

    //todo refactor with the below method for list
    //prepare authorization for twitter API request for lists 
    //@param verb                     HTTP method
    //@param url                      URL
    //@param timestamp                Timestamp
    //@param nonceValue               NonceValue   
    //@param alias                    Twitter Alias of the user
    //@param userAuthToken            The Twitter User's authToken, obtained via OAuth Popup
    //@param userAuthTokenSecret      The Twitter User's authToken secret, obtained via OAuth Popup 
    function prepareTwitterOauthSignatureForLists(verb, url, timestamp, nonceValue, 
                                          alias, userAuthToken, userAuthTokenSecret){

        console.log('in refactored oAuth signature generator function');
        
        //build request parameter string
        //refactor the below
        // var requestParamString = '';
        // for (var key in requestParameters) {
        //     if (requestParameters.hasOwnProperty(key)) {
        //         console.log(key + " -> " + requestParameters[key]);
        //         requestParamString = requestParamString + '\'' + key + '\':\'' +  requestParameters[key] + '\'';
        //     }
        // }
        // console.log('requestParamString -> ' + requestParamString);
        var parameters = {
            oauth_consumer_key : 'KkKRSmSoRbqmanyNVOt9EcZOl',
            oauth_nonce : nonceValue,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : userAuthToken,
            oauth_version : '1.0',
            'screen-name':alias
        };
        var consumerSecret = 'NmCcHv03EQAGeufzppep2ioQ2kNInKnrBTqfhd7ho7POQFA1wp';
        var tokenSecret = userAuthTokenSecret;
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash 
        var oauthSignatureValue = oauth_signature.generate(verb, url, parameters, consumerSecret, tokenSecret,{ encodeSignature: true});
                                      
        return oauthSignatureValue;

    }


    //prepare authorization for twitter API request for list
    //@param verb                     HTTP method
    //@param url                      URL
    //@param timestamp                Timestamp
    //@param nonceValue               NonceValue   
    //@param alias                    Twitter Alias of the user
    //@param userAuthToken            The Twitter User's authToken, obtained via OAuth Popup
    //@param userAuthTokenSecret      The Twitter User's authToken secret, obtained via OAuth Popup 
    function prepareTwitterOauthSignatureForList(verb, url, timestamp, nonceValue, 
                                          listId, userAuthToken, userAuthTokenSecret){

        console.log('in refactored oAuth signature generator function');
        
        //build request parameter string
        //refactor the below
        // var requestParamString = '';
        // for (var key in requestParameters) {
        //     if (requestParameters.hasOwnProperty(key)) {
        //         console.log(key + " -> " + requestParameters[key]);
        //         requestParamString = requestParamString + '\'' + key + '\':\'' +  requestParameters[key] + '\'';
        //     }
        // }
        // console.log('requestParamString -> ' + requestParamString);
        var parameters = {
            oauth_consumer_key : 'KkKRSmSoRbqmanyNVOt9EcZOl',
            oauth_nonce : nonceValue,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : userAuthToken,
            oauth_version : '1.0',
            'list-id':listId
        };
        var consumerSecret = 'NmCcHv03EQAGeufzppep2ioQ2kNInKnrBTqfhd7ho7POQFA1wp';
        var tokenSecret = userAuthTokenSecret;
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash 
        var oauthSignatureValue = oauth_signature.generate(verb, url, parameters, consumerSecret, tokenSecret,{ encodeSignature: true});
                                      
        return oauthSignatureValue;

    }
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