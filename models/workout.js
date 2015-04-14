var mongoose = require('mongoose');

var User = require('./user');

var Schema = mongoose.Schema;
var workoutSchema = mongoose.Schema({
	_user: {type: Schema.ObjectId, ref: 'User'},
	squatRep: Number,
	squatWeight: Number,
	deadLiftRep: Number,
	deadLiftWeight: Number,
	benchRep: Number,
	benchWeight: Number,
	ohpRep: Number,
	ohpWeight: Number,
	// change this to use selected date for retro active input?
	created_at: {type: Date, default: new Date}

});

mongoose.model('Workout', workoutSchema);