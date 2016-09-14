'use strict';
angular.module("twitterListViewer")
.controller('twitterController', ['$scope','$location', function($scope, $location) {

  	
	$scope.userAccessToken;
	$scope.authenticated=false;
	$scope.greeting="Please authenticate with Twitter to see your list data";



	$scope.authenticateWithTwitter = function(){
		console.log("in the controller");
		OAuth.initialize('_7jIv5Jjoi4hrfHtVwTiuTZULwQ');//this is the ID from my OAuth.io account

			// var userAccessToken;

			OAuth.popup('twitter')
		    .done(function(result) {
		    	console.log('result from popup = ', result);
		    	$scope.userAccessToken = result.oauth_token;
		    	localStorage.setItem("twitterUserToken", result.oauth_token);
				localStorage.setItem("twitterUserTokenSecret", result.oauth_token_secret);
		    	console.log("$scope.userAccessToken = ", $scope.userAccessToken);
			    result.me()
			    .done(function (response) {
			    	console.log('response:', response);
			        console.log('name: ', response.name);
			        console.log('alias: ', response.alias);
			        var successString;
			        successString = 'You have been authenticated with Twitter as ' + response.alias;
					console.log('successString: ', successString);
					localStorage.setItem("twitterAlias",response.alias);
			        localStorage.setItem("twitterAvatar",response.avatar);
			        $scope.$apply($location.path('/TwitterLists'));

			        
			        //need to use $apply to tell angular to do dirty checking
			        // $scope.greeting=='You';
			        

					
			        // $scope.$apply($scope.greeting=[successString]);

			        
			        // console.log("after location path has been set to Twitter Lists");


			        

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
.controller('twitterListController', function($scope,$location,$http,dataService){
	$scope.twitterAlias = localStorage.getItem("twitterAlias");
	$scope.twitterAvatar = localStorage.getItem("twitterAvatar");
	$scope.twitterUserToken = localStorage.getItem("twitterUserToken");

	// $scope.listData = dataService.getTwitterListData(localStorage.getItem("twitterAlias"), localStorage.getItem("twitterUserToken"));
	
	console.log("about to invoke server side API call, with alias = " + localStorage.getItem("twitterAlias") + " and userAuthToken = " + localStorage.getItem("twitterUserToken"));

     $http.get('http://localhost:3000/api/twitter-lists/' + localStorage.getItem("twitterAlias"),
	 			{
					headers:{'userAuthToken':localStorage.getItem("twitterUserToken"),
							 'userAuthTokenSecret':localStorage.getItem("twitterUserTokenSecret")}
				}).then(function(res){
					console.log("in success callback after API call");
					$scope.listData = res;
					console.log($scope.listData);
				},function(err){
					console.log("in error callback after API call");
					$scope.error_message = err;
					console.log(err);
				});
	
	console.log("after API call to node twitter list endpoint");

	$scope.setDefaultList = function(listId){
		console.log("call node service to persist " + listId + " as defaul");

		$scope.defaultListId = listId;
	}
	

})
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

	            $location.path('/TwitterAuth');
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
	 			$location.path('/TwitterAuth');
	 		} else {
	 			console.log("RegistrationController.login, response is failure, message from Backendless = " + response.message);
	 			flashService.Error(response.message);
	 		}
	 	});

	 }



	
}])


;