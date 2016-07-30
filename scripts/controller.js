'use strict';
angular.module("twitterListViewer")
.controller('twitterController', ['$scope', function($scope) {

  	
	$scope.userAccessToken;
	$scope.authenticated=false;
	$scope.greeting="Please authenticate with Twitter to see you list data";



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
			        console.log('name: ', response.name);
			        console.log('alias: ', response.alias);
			        $scope.$apply($scope.authenticated=true);
			        //need to use $apply to tell angular to do dirty checking
			        // $scope.greeting=='You';
			        var successString = 'You have been authenticated with Twitter as ' + response.alias;
					console.log('successString: ', successString);

			        $scope.$apply($scope.greeting=[successString]);


			        localStorage.setItem("twitterAlias",response.alias);
			        localStorage.setItem("twitterAvatar",response.avatar);

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
.controller('homeController',['$scope', '$cookieStore', function($scope, $cookieStore){
	
	var cookieCredentials = $cookieStore.get('globals');
	var authEnticatedWithListViewer = false;
	var authEnticatedWithTwitter = false;
	if(cookieCredentials){

		$scope.greeting = 'Hola! - now authenticate with Twitter to view your lists';	
	} else {

		$scope.greeting = 'Hola! - login with List Viewer first please';	
	}

	


}])
// .controller('loginController',['$scope', function($scope, authenticationService){
.controller('loginController', function($scope, authenticationService, $location, dataService) {



	initController();

 	function initController() {
    	// reset login status
    	authenticationService.ClearCredentials();
  	}

	$scope.login = function(){
	 	
	 	console.log("about to call the login service,  username = " + username.value + ", password = " + password.value);

	 	dataService.login(username.value,password.value).then(function(response) {
	        if (response.success) {
	            //debugger;
	            console.log("LoginController.login, response is success");
	            console.log("LoginController.login, response data = " + JSON.stringify(response.data));

	            authenticationService.SetCredentials(username, password);
	            // console.log("LoginController.login - data from response to be stored in auth:");
	            // console.log("email:" + response.data.config.data.email);
	            // console.log("pw:" + response.data.config.data.password);
	            // authenticationService.SetCredentials(response.data.config.data.email, response.data.config.data.password);
	            // vm.dataLoading = false;

	            $location.path('/Twitter');
	        } else {
	            console.log("LoginController.login, response is failure, message from Backendless = " + response.message);
	            // flashService.Error(response.message);
	            // vm.password="";
	            // vm.dataLoading = false;
	        }
	    });   

	 };
	
})
.controller('registrationController', ['$scope','$location','authenticationService','dataService', function($scope, $location, authenticationService, dataService){
	initController();

 	function initController() {
    	// reset login status
    	authenticationService.ClearCredentials();
  	}

  	$scope.register = function() {
	 	 // debugger;
	 	 //note here we are accessing the user object scoped from the login template (ng-model)
	 	//this is different from the logi controller - that is acessing the field value of the input field
	 	console.log("about to call the register service,  firstname = " + this.user.firstName + ", lastname = " + this.user.lastName);
	 	dataService.register(this.user).then(function(response){
	 		if (response.success){
	 			// debugger;
	 			console.log("RegistrationController.login, response data = " + JSON.stringify(response.data));
	 			authenticationService.SetCredentials(response.data.config.data.email, response.data.config.data.password);
	 			$location.path('/Twitter');
	 		} else {
	 			console.log("RegistrationController.login, response is failure, message from Backendless = " + response.message);
	 			flashService.Error(response.message);
	 		}
	 	});

	 }



	
}])


;