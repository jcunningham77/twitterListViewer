var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var defaultListSchema = new Schema({
    alias:String,
    listId:String,
    slug:String
});


var defaultList = mongoose.model('defaultList', defaultListSchema);

module.exports = defaultList;


