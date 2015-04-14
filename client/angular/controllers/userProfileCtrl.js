appModule.controller('userProfileCtrl', function($scope, utils, $routeParams, statFactory, localStorageService, $anchorScroll, $location){
	var d = new Date();
	var m = d.getMonth();
	var n = d.getDate();
	var y = d.getFullYear();
	var endDate = new Date(y, m, n+1).toISOString();
	var begDate = new Date(y, m, n).toISOString();

	// Variable for the data of the user we are viewing
	$scope.userData;
	// toggle variable for whether a user has already entered data
	$scope.enterOrUpdate;

	console.log("trying to get all workouts for this user");
	// Assumes we are viewing a specific user's page so pull up their data
	statFactory.getWorkoutsForUser($scope.viewUser, function (data) {
		$scope.userData = data;
		console.log($scope.loggedUser);
		console.log("got back workouts from server");
		console.log($scope.userData);
		// check if the user's last updated workout was entered today
		if($scope.userData.last_updated < endDate && $scope.userData.last_updated >= begDate) {
			console.log("True");
			$scope.enterOrUpdate = "True";
		}
	})
	$scope.addWorkout = function(input) {
		console.log("adding workout");
		console.log(input);
		// replace 0 and $scope.user._id
		statFactory.addWorkoutToUser($scope.newStat, $scope.loggedUser[0]._id, $scope.loggedUser[0].name, function (data) {
			console.log("added workout to user");
			console.log(data);
			$location.path('/');
		})
	}
	$scope.updateWorkout = function(input) {
		console.log(input);
		statFactory.editUserWorkout(input, $scope.userData.workouts[$scope.userData.workouts.length - 1]._id, $scope.loggedUser[0].name, function (data) {
			console.log("added workout to user");
			console.log(data);
			$location.path('/');
		})
	}
	$scope.updateProfile = function (input) {
		console.log("Updating user");
		console.log(input.name);
		// if any of the input fields are undefined from having just registered, fill it in with empty
		if(input.age == undefined) {
			input.age = 0;
		}
		if(input.location == undefined) {
			input.location = "";
		}
		if(input.weight == undefined) {
			input.weight = 0;
		}
		if(input.height == undefined) {
			input.height = 0;
		}
		if(input.ethnicity == undefined) {
			input.ethnicity = "";
		}
		if(input.gym == undefined) {
			input.gym = "";
		}
		if(input.password != $scope.loggedUser[0].password) {
			// DISPLAY AN ERROR MSG
			console.log("Re-enter your pw");
		} 
		else {
			statFactory.editUser(input, $scope.loggedUser[0]._id, $scope.indexofLoggedUser, function (data) {
				console.log("updating user");
					$scope.loggedUser[0].age = input.age,
					$scope.loggedUser[0].location = input.location,
					$scope.loggedUser[0].weight = input.weight,
					$scope.loggedUser[0].height = input.height,
					$scope.loggedUser[0].ethnicity = input.ethnicity,
					$scope.loggedUser[0].gym = input.gym
				$scope.flash = "Profile successfully updated!";
			})
		}
	}
	// call the utils directive and use the sort function
	$scope.sortIt = function (input, data, sortedData) {
		utils.sort_by(input, data, sortedData);
		$scope.userData.workouts = data;
	}
})