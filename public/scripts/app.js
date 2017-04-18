(function() {
	'use strict';

	angular.module('twitterListViewer',['ngRoute','ngCookies','ngSanitize', 'ui.bootstrap','ngAnimate'])
	.config(function($routeProvider, $locationProvider){
		$routeProvider

		   .when('/Login', {
		    templateUrl: 'templates/login.html',
		    controller: 'loginController',
		    // data: { active:"login" }
		    
		  })
		  .when('/Register', {
		    templateUrl: 'templates/register.html',
		    controller: 'registrationController',
		    // data: { active:"register" }
		    // active=register;
		  }) 
		  .when('/Home', {
		    templateUrl: 'templates/home.html',
		    controller: 'homeController',
		    // data: { active:"home"}
		    // active=home;
		  })		  
		  .when('/TwitterAuth', {
		    templateUrl: 'templates/twitterAuth.html',
		    controller: 'twitterController',
		    // data: { active:"home"}
		    // active=home;
		  })	
		  .when('/TwitterLists', {
		    templateUrl: 'templates/twitterLists.html',
		    controller: 'twitterListsController',
		    // data: { active:"home"}
		    // active=home;
		  })	
		  .when('/TwitterList', {
		    templateUrl: 'templates/twitterList.html',
		    controller: 'twitterListController',
		    // data: { active:"home"}
		    // active=home;
		  })			
			.when('/About', {
				
		    templateUrl: 'templates/about.html',
		    controller: 'i18nTextController',
		    // data: { active:"home"}
		    // active=home;
		  })				  		  
		  .otherwise({ redirectTo: '/Home' });
		})
.run(run);

	run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', 'authenticationService'];
	function run($rootScope, $location, $cookieStore, $http, authenticationService) {
        // keep user logged in after page refresh
        // debugger;
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
				// debugger;
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
        	console.log("event = " + event);
        	console.log("next = " + next);
        	console.log("current = " + current);
            // redirect to login page if not logged in and trying to access a restricted page
						var restrictedPage = ['/Login', '/Register','/About'].indexOf($location.$$path)===-1;
						console.log('restricted page = ' + restrictedPage);
            // var restrictedPage = $.inArray($location.path(), ['/Login', '/Register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/Login');
						}
        });

					$rootScope.logout = function(authenticationService) {
									localStorage.clear();
									//todo - authenticationService is not defined, fix this injection issue
									// authenticationService.ClearCredentials();
									console.log('in logout function');
									$location.path('/Login');

					}
    }
		
})();