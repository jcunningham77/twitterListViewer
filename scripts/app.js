(function() {
	'use strict';

	angular.module('twitterListViewer',['ngRoute','ngCookies'])
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
		  .when('/Twitter', {
		    templateUrl: 'templates/twitter.html',
		    controller: 'twitterController',
		    // data: { active:"home"}
		    // active=home;
		  })			  
		  .otherwise({ redirectTo: '/Home' });
		})
// .run(run);

// 	run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
// 	function run($rootScope, $location, $cookieStore, $http) {
//         // keep user logged in after page refresh
//         // debugger;
//         $rootScope.globals = $cookieStore.get('globals') || {};
//         if ($rootScope.globals.currentUser) {
//             $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
//         }

//         $rootScope.$on('$locationChangeStart', function (event, next, current) {
//         	console.log("event = " + event);
//         	console.log("next = " + next);
//         	console.log("current = " + current);
//             // redirect to login page if not logged in and trying to access a restricted page
//             var restrictedPage = $.inArray($location.path(), ['/Login', '/Register']) === -1;
//             var loggedIn = $rootScope.globals.currentUser;
//             if (restrictedPage && !loggedIn) {
//                 $location.path('/Login');
//             }
//         });
//     }
})();