'use strict';
angular.module("twitterListViewer")
.controller('twitterController', ['$scope', function($scope) {

  	$scope.greeting = 'Hola!';
	$scope.userAccessToken;
	$scope.authenticated=false;

	$scope.authenticateWithTwitter = function(){
		console.log("in the controller");
		OAuth.initialize('_7jIv5Jjoi4hrfHtVwTiuTZULwQ');//this is the ID from my OAuth.io account

			// var userAccessToken;

			OAuth.popup('twitter')
		    .done(function(result) {
		    	console.log('result from popup = ', result);
		    	$scope.userAccessToken = result.oauth_token;
		    	console.log("$scope.userAccessToken = ", $scope.userAccessToken);
			    result.me()
			    .done(function (response) {
			    	console.log('response:', response);
			        console.log('Firstname: ', response.firstname);
			        console.log('Lastname: ', response.lastname);
			        $scope.authenticated=true;

			    })
			    .fail(function (err) {
			        console.log("/me function call error:",err);
			    });
			})
			.fail(function (err) {
			    console.log("popup function call error:",err);
			});		
	}

	
}]);