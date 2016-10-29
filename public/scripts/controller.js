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
.controller('twitterListsController', function($scope,$location,$http,dataService, authenticationService){
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
	$http.get('http://localhost:3000/api/default-list/' + localStorage.getItem("twitterAlias"))
				.then(function(res){
					console.log("in result callback after API call, default list GET res = " + JSON.stringify(res));
					if(res){
						$scope.defaultListId = res.data.listId;
					}	
				},function(err){
					console.log("ir err callback after API call for default list GET");
					console.log(err);
					
				});
	
	console.log("after API call to node twitter list endpoint and default-list endpoint");

	//todo - refactor this into a directive or its own module that can get injected into these controllers
	// $rootscope.logout = function() {
	// 	    localStorage.clear();
    //         authenticationService.ClearCredentials();
    //         console.log('in logout function');
    //         $location.path('/Login');

	// }

	$scope.setDefaultList = function(listId){
		console.log("call node service to persist " + listId + " as defaul");
		$http.post('http://localhost:3000/api/default-list/',
		{
			data:{
				alias:$scope.twitterAlias,
				listId:listId
			}
		}).then(function(res){
			$scope.defaultListId = listId;
			console.log('in success callback after persisting default id');
		},function(err){
			console.log("in error callback after persist default API call");
			$scope.error_message = err;
			console.log(err);
		});

			
	}
})
.controller('twitterListController',['$scope','$cookieStore','$http','$location',function($scope,$cookieStore,$http,$location){
	$scope.twitterAlias = localStorage.getItem("twitterAlias");
	$scope.twitterAvatar = localStorage.getItem("twitterAvatar");
	$scope.twitterUserToken = localStorage.getItem("twitterUserToken");

	console.log("inside twitterListController");
	console.log($location.search().listId);
	//debugger;
	var listId =  $location.search().listId;

	if(listId){

		// console.log("about to invoke server side API call, with listId = " + localStorage.getItem("twitterAlias") + " and userAuthToken = " + localStorage.getItem("twitterUserToken"));

		$http.get('http://localhost:3000/api/twitter-list/' + listId,
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

	} else {
		//listId is not in the URL, so try with ownerScreenName and slug

		var ownerScreenName =  $location.search().ownerScreenName;
		var slug =  $location.search().slug;

		$http.get('http://localhost:3000/api/twitter-list-by-slug/' + ownerScreenName + '/slug/' + slug,
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
	}
}])
.controller('homeController',['$scope', '$cookieStore', '$location', function($scope, $cookieStore, $location){
	
	var cookieCredentials = $cookieStore.get('globals');
	// debugger;
	var authenticatedWithListViewer = false;
	var authenticatedWithTwitter = false;

	if (localStorage.twitterAlias&&
		localStorage.twitterAvatar&&
		localStorage.twitterUserToken&&
		localStorage.twitterUserTokenSecret){
			authenticatedWithTwitter = true;
		}


	if(cookieCredentials){
		authenticatedWithListViewer = true;
	}

	if (authenticatedWithTwitter&&authenticatedWithListViewer){
		$scope.$apply($location.path('/TwitterLists'));
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
	        
	            console.log("LoginController.login, success response data = " + JSON.stringify(response.data));

	            authenticationService.SetCredentials(username, password);
	            // console.log("LoginController.login - data from response to be stored in auth:");
	            // console.log("email:" + response.data.config.data.email);
	            // console.log("pw:" + response.data.config.data.password);
	            // authenticationService.SetCredentials(response.data.config.data.email, response.data.config.data.password);
	            // vm.dataLoading = false;

	            $location.path('/TwitterAuth');
	        } else {
	            console.log("LoginController.login, response is failure, message from Backendless = " + response.message);
	            //TODO work on flash service for error feedback
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
	 			
				 //TODO configure flash service
				 //flashService.Error(response.message);
	 		}
	 	});

	 }	
}]);