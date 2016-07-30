'use strict';
angular.module("twitterListViewer")	
.service('dataService',function($http){

	var TAG = "dataService";

	this.login = function(username,password){
		  var config = {
                headers : {
                    'authorization': undefined,
                    'application-id': 'E3F4DC04-11AD-2ED4-FFD2-B5BB04809300',
                    'secret-key':'35174A73-85C1-1B39-FF93-4D01137BB900',
                    'application-type':'REST',
                    'Content-Type':'application/json'
                }
            }
            // $http.post('https://api.backendless.com/v1/users/login', { login: username, password: password },config)
            //    .success(function (response) {
            //     console.log("success login = " + response.data.message);
            //        callback(response);
            //    });
            console.log("about to invoke Backendless login API call, username = " + username + " and password = " + password);
            

            // return $http.post('https://api.backendless.com/v1/users/login', { login: username, password: password },config).then(handleSuccess, handleError);
            // debugger;
            return $http.post('https://api.backendless.com/v1/users/login', { login: username, password: password },config).then(handleSuccess, handleError);

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

