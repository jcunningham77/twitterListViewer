'use strict';
angular.module("twitterListViewer")
.controller('twitterController', ['$scope', function($scope) {

  	
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

	
}])
.controller('homeController',['$scope', function($scope){
	$scope.greeting = 'Hola!';
}])
// .controller('loginController',['$scope', function($scope, authenticationService){
.controller('loginController', function($scope, authenticationService) {



	initController();

 	function initController() {
    	// reset login status
    	authenticationService.ClearCredentials();
  	}

	$scope.login = function(){
	 	
	 	console.log("about to call the login service,  username = " + username.value + ", password = " + password.value);

	 	// dataService.login(username.value,password.value).then(function(response) {
	  //       if (response.success) {
	  //           //debugger;
	  //           console.log("LoginController.login, response is success");
	  //           console.log("LoginController.login, response data = " + JSON.stringify(response.data));

	  //           authenticationService.SetCredentials(username, password);
	  //           // console.log("LoginController.login - data from response to be stored in auth:");
	  //           // console.log("email:" + response.data.config.data.email);
	  //           // console.log("pw:" + response.data.config.data.password);
	  //           // authenticationService.SetCredentials(response.data.config.data.email, response.data.config.data.password);
	  //           // vm.dataLoading = false;

	  //           $location.path('/Home');
	  //       } else {
	  //           console.log("LoginController.login, response is failure, message from Backendless = " + response.message);
	  //           flashService.Error(response.message);
	  //           // vm.password="";
	  //           // vm.dataLoading = false;
	  //       }
	  //   });   

	 };
	
});