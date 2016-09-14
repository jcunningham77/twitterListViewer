
var configValues = require('./config');

module.exports = {
    getDBConnectionString:function(){
        return 'mongodb://'+ configValues.uname+':'+configValues.password+'@ds033086.mlab.com:33086/twitterlistviewer';
        
    }
};