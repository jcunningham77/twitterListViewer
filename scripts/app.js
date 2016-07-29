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
	// .controller('twitterController', ['$scope', function($scope) {
 //  		$scope.greeting = 'Hola!';
	// }]);	

})();