var mongoose = require('mongoose');

var Workout = require('./workout');

var Schema = mongoose.Schema;
var userSchema = mongoose.Schema({
	name: String,
	// non secure
	email: String,
	password: String,
	// non secure
	age: Number,
	location: String,
	weight: Number,
	height: Number,
	ethnicity: String,
	gym: String,
	last_updated: Date,
	workouts: [{type: Schema.Types.ObjectId, ref: 'Workout'}]
});

mongoose.model('User', userSchema);