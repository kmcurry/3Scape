var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProjectSchema   = new Schema({
	title: String,
	serXML: String
});

module.exports = mongoose.model('Project', ProjectSchema);