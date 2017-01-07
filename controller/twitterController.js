/*
    This controller handles twitter specific calls - 
        currently 2 calls to the Twitter API to get a user's Lists as well as List-specific data.
    Also there is an endpoint to get a default twitter list for a user, and post a default list for a user.
    The Default List data is stored in a Mongo DB hosted on mLab.com.
*/

var https = require('https');
var oauth_nonce = require('oauth_nonce');
var oauth_signature = require('oauth-signature');
var DefaultLists = require('../model/defaultListModel');
var bodyParser = require('body-parser');
var linkifyHtml = require('linkifyjs/html');
var config = require('../config');



module.exports = function(app){
    var twitterConfig = config.getTwitterConfigValues();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    //TODO - currently we persist default list data by Twitter alias
    // -  investigate adding the user's email address and identify default list data
    // by that AND the alias - since Twitter alias's can be changed
    app.post('/api/default-list',function(req,res){
        console.log('in the post endpoint for setting default list');
        var defaultList;
        DefaultLists.findOneAndUpdate({alias:req.body.data.alias},
                    {alias:req.body.data.alias,listId:req.body.data.listId,slug:req.body.data.slug},
                    {new:true,upsert:true},
                    function(err,result){
                        if(err){
                            console.log(err);
                            throw err;
                        } if (result) {
                            console.log('default list id after POST  = ' + result.listId);
                            res.status('200').send(result);
                        } else {
                            console.log('not found');
                            res.status('404').send();
                        }
                    });
        
    });

    app.get('/api/default-list/:alias',function(req,res){
        console.log('in the get endpoint for getting default list, alias = ' + req.params.alias);
        DefaultLists.findOne({alias:req.params.alias},
                    function(err,result){
                        if(err){
                            console.log(err);
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
                          'Authorization': 'OAuth oauth_consumer_key="'+twitterConfig.oauth_consumer_key+'", oauth_nonce="'+nonceValue+'", oauth_signature="'+oauthSignatureValue+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="' + timestamp +'", oauth_token="' + req.headers.userauthtoken +'", oauth_version="1.0"' 
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
                                // console.log('list data from twitter = ' + JSON.stringify(parsed));
                                
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

    /*
        This API endpoint was working for some accounts, but not all.
        So I switched to getting this data by slug and alias (see below)
    */

   app.get('/api/twitter-list/:listId',function(req,res){

        var nonceValue = oauth_nonce();
        var timestamp = Math.floor( Date.now() / 1000 );
        var oauthSignatureValue = prepareTwitterOauthSignatureForList('GET','https://api.twitter.com/1.1/lists/statuses.json',timestamp,nonceValue,req.params.listId,req.headers.userauthtoken,req.headers.userauthtokensecret);


        console.log("inside node controller for get Twitter List, input req params = " + req);
        var listRequest = https.request({method:'GET',
                      headers:{
                          'Authorization': 'OAuth oauth_consumer_key="'+twitterConfig.oauth_consumer_key+'", oauth_nonce="'+nonceValue+'", oauth_signature="'+oauthSignatureValue+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="' + timestamp +'", oauth_token="' + req.headers.userauthtoken +'", oauth_version="1.0"' 
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
                                var twitterListResponse = mapTwitterApiListToListViewerList(parsed);
                                console.log(JSON.stringify(twitterListResponse));
                                res.send(twitterListResponse);
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

    app.get('/api/twitter-list-by-slug/:owner_screen_name/slug/:slug',function(req,res){

        var nonceValue = oauth_nonce();
        var timestamp = Math.floor( Date.now() / 1000 );
        var oauthSignatureValue = prepareTwitterOauthSignatureForListBySlug('GET','https://api.twitter.com/1.1/lists/statuses.json',timestamp,nonceValue,req.params.owner_screen_name,req.params.slug,req.headers.userauthtoken,req.headers.userauthtokensecret);


        console.log("inside node controller for get Twitter List by slug, input req params = " + req);
        var listRequest = https.request({method:'GET',
                      headers:{
                          'Authorization': 'OAuth oauth_consumer_key="'+twitterConfig.oauth_consumer_key+'", oauth_nonce="'+nonceValue+'", oauth_signature="'+oauthSignatureValue+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="' + timestamp +'", oauth_token="' + req.headers.userauthtoken +'", oauth_version="1.0"' 
                      },
                      host:'api.twitter.com',
                      path:'/1.1/lists/statuses.json?owner_screen_name=' + req.params.owner_screen_name + '&slug=' + req.params.slug
                      },function(result){
                          var parsed;
                           var body = '';
                            result.on('data', function(d) {
                                body += d;
                            });
                            result.on('end',function(){
                                // console.log("twitter-list - this is the response from the twitter list api: " + body);
                                parsed = JSON.parse(body);
                                console.log(parsed);
                                var twitterListResponse = mapTwitterApiListToListViewerList(parsed);
                                // console.log(JSON.stringify(twitterListResponse));
                                res.send(twitterListResponse);
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

    function mapTwitterApiListToListViewerList(twitterListResponse){
        //twitterListResponse

        var tweets = [];
        for (var key in twitterListResponse) {
            
            if (twitterListResponse.hasOwnProperty(key)) {
                // console.log(key + " -> " + twitterListResponse[key]);

                //first get top level values like text
                try {
                    // console.log("***************");
                    // console.log("twitter status text before linkify: " + twitterListResponse[key].text);
                    // console.log("twitter status text after linkify: " + linkifyHtml(twitterListResponse[key].text));
                    // console.log("***************");

                    var tweet = {"text":linkifyHtml(twitterListResponse[key].text, {defaultProtocol: 'https'})};
                    // var tweet = {"text":"\"Yes to Humphries but I prefer Brate of pass catchers. But of WR, yes, increase for Adam. He'd be my pick of the WR. \"<a href=\"https://t.co/k85QEO1gL0\" target=\"_blank\">https://t.co/k85QEO1gL0</a>"}
                    // var tweet = {"text":twitterListResponse[key].text};
                    //now get user-level info
                    tweet.name=twitterListResponse[key]["user"].name;
                    tweet.screen_name=twitterListResponse[key]["user"].screen_name;
                    tweet.profile_image_url=twitterListResponse[key]["user"].profile_image_url;
                    tweets.push(tweet);
                } catch(e) {
                    console.log("error mapping tweet to model" + e);
                }           
            }
        }
        return tweets;
    }

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
        var parameters = {
            oauth_consumer_key : twitterConfig.oauth_consumer_key,
            oauth_nonce : nonceValue,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : userAuthToken,
            oauth_version : '1.0',
            'screen-name':alias
        };
        var consumerSecret = twitterConfig.oauth_consumer_secret;
        var tokenSecret = userAuthTokenSecret;
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash 
        console.log('lists endpoint: parameters sent to the oath_signature.generator = ' + JSON.stringify(parameters));
        var oauthSignatureValue = oauth_signature.generate(verb, url, parameters, consumerSecret, tokenSecret,{ encodeSignature: true});
                                      
        return oauthSignatureValue;

    }


    //prepare authorization for twitter API request for list
    //@param verb                     HTTP method
    //@param url                      URL
    //@param timestamp                Timestamp
    //@param nonceValue               NonceValue   
    //@param listId                     List id of the requested list
    //@param userAuthToken            The Twitter User's authToken, obtained via OAuth Popup
    //@param userAuthTokenSecret      The Twitter User's authToken secret, obtained via OAuth Popup 
    function prepareTwitterOauthSignatureForList(verb, url, timestamp, nonceValue, 
                                          listId, userAuthToken, userAuthTokenSecret){

        
        var parameters = {
            'list_id':listId,
            oauth_consumer_key : twitterConfig.oauth_consumer_key,
            oauth_nonce : nonceValue,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : userAuthToken,
            oauth_version : '1.0'
            
        };
        var consumerSecret = twitterConfig.oauth_consumer_secret;
        var tokenSecret = userAuthTokenSecret;
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
        console.log('list endpoint: parameters sent to the oath_signature.generator = ' + JSON.stringify(parameters)); 
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
    function prepareTwitterOauthSignatureForListBySlug(verb, url, timestamp, nonceValue, 
                                          ownerScreenName, slug, userAuthToken, userAuthTokenSecret){

        var parameters = {
            oauth_consumer_key : twitterConfig.oauth_consumer_key,
            oauth_nonce : nonceValue,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : userAuthToken,
            oauth_version : '1.0',
            owner_screen_name : ownerScreenName,
            slug : slug
        };
        var consumerSecret = twitterConfig.oauth_consumer_secret;
        var tokenSecret = userAuthTokenSecret;
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
        console.log('list by slug endpoint: parameters sent to the oath_signature.generator = ' + JSON.stringify(parameters)); 
        var oauthSignatureValue = oauth_signature.generate(verb, url, parameters, consumerSecret, tokenSecret,{ encodeSignature: true});
                                      
        return oauthSignatureValue;

    }
};     