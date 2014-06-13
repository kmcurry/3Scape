var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TodoSchema   = new Schema({
	text: String
});

module.exports = mongoose.model('Todo', TodoSchema);