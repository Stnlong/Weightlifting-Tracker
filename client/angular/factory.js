appModule.factory('statFactory', function($http) {

	var users = [];
	var loggedInUser;
	var factory = {};

	factory.addUser = function (newUser, callback) {
		$http.post('/user', newUser).success(function(output) {
			newUser._id = output.id;
			console.log("Output of adding new user to mongo: "+output)
			callback(output);
		})
	}

	factory.addWorkoutToUser = function(newWorkout, userID, userName, callback) {
		console.log("addWorkoutToUser params received: Stats:"+newWorkout+ " userID:" + userID);
		$http.put('/workout/'+userID, newWorkout).success(function() {
			// update the users scope variable for that responsiveness
			users.push({
						benchRep: newWorkout.benchRep,
						benchWeight: newWorkout.benchWeight,
						deadLiftRep: newWorkout.deadLiftRep,
						deadLiftWeight: newWorkout.deadLiftWeight,
						ohpRep: newWorkout.ohpRep,
						ohpWeight: newWorkout.ohpWeight,
						squatRep: newWorkout.squatRep,
						squatWeight: newWorkout.squatWeight,
						_user: {
							name: userName
						}
			});
			console.log(users);
			callback(users);
		})
	}

	factory.editUserWorkout = function(newStat, workOutID, userName, callback) {
		console.log("Updating user workout for today");
		console.log(newStat);
		console.log(workOutID);
		$http.put('/updateWorkout/'+workOutID, newStat).success(function() {
			// find in the user array the entry to update
			// run a for loop through the users array and look for the _id that matches against the logged in user _id
			for(var i = 0; i < users.length; i++) {
				if(users[i]._user._id == loggedInUser._id) {
					console.log(i);
					if(newStat.squatRep) { users[i].squatRep = newStat.squatRep; }
					if(newStat.squatWeight) { users[i].squatWeight = newStat.squatWeight; }
					if(newStat.ohpRep) { users[i].ohpRep = newStat.ohpRep; }
					if(newStat.ohpWeight) { users[i].ohpWeight = newStat.ohpWeight; }
					if(newStat.benchRep) { users[i].benchRep = newStat.benchRep; }
					if(newStat.benchWeight) { users[i].benchWeight = newStat.benchWeight; }
					if(newStat.deadLiftRep) { users[i].deadLiftRep = newStat.deadLiftRep; }
					if(newStat.deadLiftWeight) { users[i].deadLiftWeight = newStat.deadLiftWeight; }
				} 
			}
			callback(users);
		})
	}

	factory.editUser = function(newInfo, userID, index, callback) {
		console.log("editUser params received: Info:"+newInfo+ " userID:" + userID);
		$http.put('/update/'+userID, newInfo).success(function() {
			console.log(newInfo);
			callback(users);
		})
	}

	factory.getWorkoutsForUser = function (userID, callback) {
		console.log("calling getWorkoutsForUser from the factory");
		$http.get('/user/'+userID).success(function(output) {
			console.log("getWorkoutsForUser(factory) has returned from server. this is the output: ");
			loggedInUser = output;
			callback(loggedInUser);
		})
	}

	factory.getData = function (input, callback) {
		switch(input) {
			case "Today":
				$http.get('/getTodaysData').success(function(output) {
					console.log("returned workouts for today");
					users = output;
					console.log(users);
					callback(users);
				})
				break;
			case "Yesterday":
				$http.get('/getYesterdaysData').success(function(output) {
					console.log("Returned workouts for yesterday");
					users = output;
					console.log(users);
					callback(users);
				})
				break;
			case "Week":
				$http.get('/getWeeklyData').success(function(output) {
					console.log("Returned workouts for this week");
					users = output;
					console.log(users);
					callback(users);
				})
				break;
			case "Month":
				$http.get('/getMonthlyData').success(function(output) {
					console.log("Returned workouts for this month");
					users = output;
					console.log(users);
					callback(users);
				})
				break;
			case "Year":
				$http.get('/getYearlyData').success(function(output) {
					console.log("Returned workouts for this year");
					users = output;
					console.log(users);
					callback(users);
				})
				break;
			default:
				console.log("Nothing to see here");	
		}
	}

	factory.loginAndFetchUser = function (input, callback) {
		$http.post('/getOneUser', input).success(function(output) {
			console.log("returned info for user");
			if(output.length != 0) {
				loggedInUser = output;
				console.log(loggedInUser);
				callback(loggedInUser);
			} else {
				console.log("Wrong credentials");
				callback(loggedInUser);
			}
		})
	}
	return factory
});