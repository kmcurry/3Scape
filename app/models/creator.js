// app/models/creator.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema

// define the schema for our creator model
var CreatorSchema = mongoose.Schema({

    email: String,
    name: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Number,

    scapes         : []

});

// methods ======================
// generating a hash
CreatorSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
CreatorSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for creators and expose it to our app
module.exports = mongoose.model('Creator', CreatorSchema);
