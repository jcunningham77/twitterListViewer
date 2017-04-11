'use strict';
angular.module("DLV4TaboutWebView")
.controller('i18nTextController',['$scope','$http',function($scope,$http){
	

	console.log("inside i18nTextController");


		$http.get('/api/about-text/',
					{
						headers:{'jeff':"jeffHeaderValue"}
					}).then(function(res){
						console.log("in success callback after API call");
						$scope.aboutHeader = res;
						console.log($scope.aboutHeader);
					},function(err){
						console.log("in error callback after API call");
						$scope.error_message = err;
						console.log(err);
					});	


}]);

