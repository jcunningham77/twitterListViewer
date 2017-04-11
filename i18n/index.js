
var about = require('./about');


module.exports = {
 getLocalizedAboutText:function(locale){
        return about[locale];
        
        
    }
};