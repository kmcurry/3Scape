var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NoteSchema   = new Schema({
	text: String
});

module.exports = mongoose.model('Note', NoteSchema);