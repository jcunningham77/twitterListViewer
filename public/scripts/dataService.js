'use strict';
angular.module("twitterListViewer")	
.service('dataService',function($http){

	var TAG = "dataService";

	this.login = function(username,password){
 
            return $http.post('http://localhost:3000/api/login/',{ "username": username, "password": password }).then(handleSuccess, handleError);
 
	}

    this.register = function(user){
            var config = {
                headers : {
                    'authorization': undefined,
                    'application-id': 'E3F4DC04-11AD-2ED4-FFD2-B5BB04809300',
                    'secret-key':'35174A73-85C1-1B39-FF93-4D01137BB900',
                    'application-type':'REST',
                    'Content-Type':'application/json'
                }
            }

             console.log("about to invoke Backendless register API call, first = " + user.firstName + " and last = " + user.lastName);

             return $http.post('https://api.backendless.com/v1/users/register', user,config).then(handleSuccess, handleError);
           

    }


    this.getTwitterListData = function(alias, userAuthToken){

            var timestamp = Math.floor( Date.now() / 1000 );
            console.log('current timestamp:' + timestamp);        
            var config = {
                headers : {
                    'Authorization': 'OAuth oauth_consumer_key="KkKRSmSoRbqmanyNVOt9EcZOl", oauth_nonce="96f12991a19b9e7146cb5418c76996fb", oauth_signature="6fJl4Avk%2FXEl4s82JGlYmvtA8x0%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp +', oauth_token=' + userAuthToken + ', oauth_version="1.0"'                    
                }
            }

            console.log("about to invoke twitter API call, with alias = " + alias + " and userAuthToken = " + userAuthToken);

            return $http.get('https://api.twitter.com/1.1/lists/list.json?screen-name=' + alias,config).then(handleSuccess,handleError);

    }

	function handleSuccess(res) {
        var response;
        response = { success: true,data:res };
        // debugger;
        console.log(TAG + " handleSuccess: res = " + JSON.stringify(res));
        console.log(TAG + " handleSuccess: response = " + JSON.stringify(response));
        if(response.success){
            console.log("response.success is true");
        } else {
            console.log("response.success is false");
        }
        return  response;
    }	

    function handleError(res) {
	    // debugger;
	    console.log("the error was = " + res.data.message);
	   
	    return { success: false, message: res.data.message};
    }
});

