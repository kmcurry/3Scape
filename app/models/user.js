// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema

// define the schema for our user model
var userSchema = mongoose.Schema({

    email: String,
    password: String,
    scene: String,
    resetPasswordToken: String,
    resetPasswordExpires: Number,
		avatar: String,
		bio: String,
		name: String,
		fans: [],

    projects         : [{ type: Schema.Types.ObjectId, ref: 'Project'}]

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
