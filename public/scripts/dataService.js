'use strict';
angular.module("twitterListViewer")	
.service('dataService',function($http){

	var TAG = "dataService";

	this.login = function(username,password){
 
            return $http.post('http://localhost:3000/api/login/',{ "username": username, "password": password }).then(handleSuccess, handleError);
 
	}

    this.register = function(user){


             console.log("about to invoke Backendless register API call, first = " + user.firstName + " and last = " + user.lastName);

             return $http.post('http://localhost:3000/api/register/',user).then(handleSuccess, handleError);
           

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

