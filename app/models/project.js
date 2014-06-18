var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProjectSchema   = new Schema({
	text : String,
	done : Boolean,
	// serXML: String
});

module.exports = mongoose.model('Project', ProjectSchema);