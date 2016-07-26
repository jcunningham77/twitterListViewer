$(function(){
	OAuth.initialize('_7jIv5Jjoi4hrfHtVwTiuTZULwQ');//this is the ID from my OAuth.io account

	var userAccessToken;

	OAuth.popup('twitter')
    .done(function(result) {
    	console.log('result from popup = ', result);
    	userAccessToken = result.oauth_token;
	    result.me()
	    .done(function (response) {
	    	console.log('response:', response);
	        console.log('Firstname: ', response.firstname);
	        console.log('Lastname: ', response.lastname);
	    })
	    .fail(function (err) {
	        //handle error with err
	    });
	})
	.fail(function (err) {
	    //handle error with err
	});



});