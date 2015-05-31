var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ScapeSchema   = new Schema({
	scapeRef: String,
	title : String,
	creator: String,
	content: String
});

module.exports = mongoose.model('Scape', ScapeSchema);
