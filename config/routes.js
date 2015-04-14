var stats = require('../controllers/stats');
var mongoose = require('mongoose');

module.exports = function(app) {
	app.post('/user', function(req, res) {
		console.log("Adding new user");
		stats.addUser(req, res);
	})
	app.get('/getUsers', function(req, res) {
		console.log("Getting all users from mongodb");
		stats.index(req, res);
	})
	app.put('/workout/:id', function (req, res) {
		stats.addWorkoutToUser(req, res);
	})
	app.put('/updateWorkout/:id', function (req, res) {
		stats.updateLastWorkout(req, res);
	})
	app.get('/user/:id', function (req, res){
		stats.getWorkoutsForUser(req, res);
	})
	app.put('/update/:id', function (req, res) {
		console.log("Updating user in mongo");
		console.log(req.body);
		stats.updateProfile(req, res);
	})
	app.get('/getTodaysData', function (req, res) {
		console.log("getting users for today");
		var isodate = new Date().toISOString();
		console.log(isodate);
		stats.getTodaysWorkouts(req, res);
	})
	app.get('/getYesterdaysData', function (req, res) {
		console.log("Getting workouts for yesterday");
		stats.getYesterdaysWorkouts(req, res);
	})
	app.get('/getWeeklyData', function (req, res) {
		console.log("Getting workouts for this week");
		stats.getWeeklyData(req, res);
	})
	app.get('/getMonthlyData', function (req, res) {
		console.log("Getting workouts for this month");
		stats.getMonthlyData(req, res);
	})
	app.get('/getYearlyData', function (req, res) {
		console.log("Getting workouts for this year");
		stats.getYearlyData(req, res);
	})
	app.post('/getOneUser', function (req, res) {
		console.log("Getting profile for one user");
		console.log(req.body);
		stats.loginAndGetOneuser(req, res);
	})
}