var mongoose = require('mongoose');
// var http      = require('http');
// var express   = require('express');
// var db;

// var config = {
//       "USER"    : "ubuntu",           
//       "PASS"    : "",
//       "HOST"    : "ec2-54-149-226-144.us-west-2.compute.amazonaws.com",  
//       "PORT"    : "27017", 
//       "DATABASE" : "workout"
//     };

// var dbPath  = "mongodb://"+config.USER + ":"+
//     config.PASS + "@"+
//     config.HOST + ":"+
//     config.PORT + "/"+
//     config.DATABASE;

// db = mongoose.createConnection(dbPath);

var User = mongoose.model('User');
var Workout = mongoose.model('Workout');

var moment = require('moment')
var today = moment().startOf('day'),
    tomorrow = moment(today).add(1, 'days');

var weekStart = moment().isoWeekday(1).startOf('day')._d.toISOString();
var weekStop = moment().isoWeekday(7).startOf('day')._d.toISOString();

console.log(moment().endOf("year")._d.toISOString());
console.log(moment().startOf('year')._d.toISOString());

// get current month and day
var d = new Date();
var m = d.getMonth();
var n = d.getDate();
var y = d.getFullYear();
var day = d.getDay();


// endDate is the end of TODAY
var endDate = new Date(y, m, n+1).toISOString();
// isodate is the time now
var isodate = new Date().toISOString();
// begDate is the beginning of TODAY
var begDate = new Date(y, m, n).toISOString();
var yesterdayBegDate = new Date(y, m, n-1).toISOString();

var mongs = {};

mongs.addUser = function(req, res) {
	var new_user = new User({name: req.body.enteredName,
							 email: req.body.enteredEmail,
							 password: req.body.password,
							 age: '',
							 location: '',
							 weight: '',
							 height: '',
							 ethnicity: '',
							 gym: '',
							 workouts: []});
	console.log("Got to controller with: "+new_user);
	new_user.save(function(err, result) {
		if(err) {
			res.send('something went wrong');
		} else {
			res.json({id:result._id});
		}
	})
}

mongs.index = function(req, res) {
	User.find({}, function(err, results) {
		if(err) {
			res.send('something went wrong');
		} else {
			res.json(results);
		}
	})
}

mongs.addWorkoutToUser = function(req, res) {
	console.log("attempting to add workout to user "+req.params.id);
	User.findOne({_id: req.params.id}, function(err, user){
		User.update({_id: req.params.id}, {$set: 
											{last_updated: isodate
											 }}, function(err, result) {
			if(err) {
				res.send('something went wrong');
			} else {
				res.end();
			}
		})
		var workout = new Workout(req.body);
		console.log(workout);
		// associate the workout being added to the user we are adding to
		workout._user = user._id;
		// push the workout we want to add to the workouts array inside the user model
		user.workouts.push(workout);
		workout.save(function(err){
			user.save(function(err){
				res.end();
			})
		})
	})
}

mongs.updateLastWorkout = function (req, res) {
	console.log("Updating last workout "+req.params.id);
		Workout.update({_id: req.params.id}, {$set:
			req.body
		}, function(err, result) {
			if(err) {
				res.send("something went wrong");
			} else {
				res.end();
			}
		})
}

mongs.getWorkoutsForUser = function(req, res) {
	console.log("trying to get workouts from db with: "+req.params.id);
	// findOne post based on _id. Return every field except the password
	User.findOne({_id: req.params.id}, '_id age ethnicity gym height last_updated location name weight workouts')
	.populate('workouts')
	.exec(function (err, user){
		res.json(user);
	})
}

mongs.updateProfile = function (req, res) {
	console.log(req.body);
	User.update({_id: req.params.id}, {$set: 
										{name: req.body.name, 
										 email: req.body.email,
										 password: req.body.password,
										 age: req.body.age,
										 location: req.body.location,
										 weight: req.body.weight,
										 height: req.body.height,
										 ethnicity: req.body.ethnicity,
										 gym: req.body.gym
										 }}, function(err, result) {
		if(err) {
			res.send('something went wrong');
		} else {
			res.end();
		}
	})
}

mongs.getTodaysWorkouts = function (req, res) {
	console.log("trying to get workouts for today");
	Workout.find({created_at: { $gte: begDate, $lt: endDate}})
			.populate('_user', 'name _id age location weight height ethnicity gym')
			.exec(function (err, result){
				// console.log("post is "+post);
				res.json(result);
	})
}

mongs.getYesterdaysWorkouts = function(req, res) {
	console.log("Trying to get workouts for yesterday");
	Workout.find({created_at: { $gte: yesterdayBegDate, $lt: begDate}})
			.populate('_user', 'name _id age location weight height ethnicity gym')
			.exec(function (err, result){
				// console.log("post is "+post);
				res.json(result);
	})
}

mongs.getWeeklyData = function(req, res) {
	console.log("Trying to get workouts for the week");
	Workout.find({created_at: { $gte: weekStart, $lt: weekStop}})
			.populate('_user', 'name _id age location weight height ethnicity gym')
			.exec(function (err, result){
				// console.log("post is "+post);
				res.json(result);
	})
}

mongs.getMonthlyData = function(req, res) {
	console.log("Trying to get workouts for the month");
	Workout.find({created_at: { $gte: moment().startOf('month')._d.toISOString(), $lt: moment().endOf("month")._d.toISOString()}})
			.populate('_user', 'name _id age location weight height ethnicity gym')
			.exec(function (err, result){
				// console.log("post is "+post);
				console.log("Loggind output of month");
				console.log(result);
				res.json(result);
	})
}

mongs.getYearlyData = function(req, res) {
	console.log("Trying to get workouts for the year");
	Workout.find({created_at: { $gte: moment().startOf('year')._d.toISOString(), $lt: moment().endOf("year")._d.toISOString()}})
			.populate('_user', 'name _id age location weight height ethnicity gym')
			.exec(function (err, result){
				// console.log("post is "+post);
				res.json(result);
	})
}

mongs.loginAndGetOneuser = function (req, res) {
	User.find({$and: [{email: req.body.email},{password: req.body.password}]}, function(err, results) {
		if(err) {
			res.json("Not found");
		} else {
			res.json(results);
		}
	})
}

module.exports = mongs;