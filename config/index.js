var configValues = require('./config');
var backendlessConfigValues = require('./backendless');
var twitterConfigValues = require('./twitter');



module.exports = {
    getDBConnectionString:function(){
        return 'mongodb://'+ configValues.uname+':'+configValues.password+'@ds033086.mlab.com:33086/twitterlistviewer';
        
    },

    getBackendlessConfigValues:function(){

        return backendlessConfigValues;
    },

    getTwitterConfigValues:function(){
        return twitterConfigValues;
    }
};