var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ScapeSchema   = new Schema({
	title : String,
	creator: String,
	content: String
});

module.exports = mongoose.model('Scape', ScapeSchema);
