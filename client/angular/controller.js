appModule.controller('statController', function ($scope, utils, statFactory, localStorageService, $location, $anchorScroll) {

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = mm+'/'+dd+'/'+yyyy;
	console.log(today);
	// This var stores a logged in user's information
	$scope.user;
	$scope.loggedIn = false;
	$scope.loggedUser = localStorageService.cookie.get('currentUserID');
	// Array variables for highcharts plotting
	$scope.todaysData = [];
	$scope.yesterdaysData = [];
	$scope.weeklyData = [];
	$scope.monthlyData = [];
	$scope.yearlyData = [];
	// variable name for exercise type
	$scope.exerciseType;
	// array for the templates to use
	$scope.activeData = [];
	// array for highcharts to use to plot
	$scope.dataToPlot = [];
	// Variables for viewing a user's profile page
	$scope.viewAsGuest = false;
	$scope.viewUser;
	// variable for error messages
	$scope.msg;

	// Today's data is the first page that gets loaded so let's pull the appropriate data
	statFactory.getData('Today', function(data) {
		console.log("got to the controller, getting todays data from factory");
		$scope.activeData = data;
	})
	// Partials to use
	$scope.templates =
	    [ { name: 'Today', url: './partials/today.html'},
	      { name: 'Yesterday', url: './partials/yesterday.html'},
	      { name: 'Week', url: './partials/week.html'},
	      { name: 'Month', url: './partials/month.html'},
	      { name: 'Year', url: './partials/year.html'} ];
  	$scope.template = $scope.templates[0];

	$scope.viewUserProfile = function (input) {
		console.log(input);
		if($scope.loggedUser[0] == undefined) {
			console.log("Not logged in");
			$scope.viewUser = input;
		}
		else if(input != $scope.loggedUser[0]._id) {
			console.log("Not viewing as the owner");
			$scope.viewUser = input;
		}
		else {
			$scope.viewUser = $scope.loggedUser[0]._id;
		}
	}
	// Call the utils directive and use its sort function
	$scope.sortIt = function (input, data) {
		utils.sort_by(input, data);
	}
	// Function used when a user enters a workout session
	$scope.addSession = function (input) {
		console.log(input);
		statFactory.addSession(input, function (data) {
			console.log("session");
			$scope.todaysData = data;
			updateData();
		})
	}
	$scope.registerUser = function (input) {
		statFactory.addUser(input, function (data) {
			$scope.loginAndFetch({email: input.enteredEmail, password: input.password}, 1);
		})
	}
	$scope.logOut = function () {
		console.log("got here");
		$scope.loggedUser = '';
		localStorageService.cookie.remove('currentUserID');
		$location.path('/');
	}
	// Used for both login and registering
	// Sets the cookie for a logged in/newly created user
	$scope.loginAndFetch = function (input, registered) {
		if(input == undefined) {
			$scope.msg = "Fields can't be blank";
			$location.path('/');
		} else {
			statFactory.loginAndFetchUser(input, function (data) {
				if(data == undefined) {
					console.log("Bad credentials");
					$scope.msg = "Bad credentials";
					$location.path('/');
				} else {
					console.log(data);
					$scope.user = data;
					console.log($scope.user);
					$scope.loggedIn = true;
					localStorageService.cookie.set('currentUserID', data);
					$scope.loggedUser = localStorageService.cookie.get('currentUserID');
					console.log($scope.loggedUser);
					$location.path('/profile');
					if(registered ==1) {
						$location.hash('anchor');
					} else {
						$location.hash('register');
					}
					$anchorScroll();
				}
				
			})
		}
	}
	// Determines which data set to use for plotting with highcharts
	$scope.getParams = function (input, day, data) {
		var arrayToUse = [];
		arrayToUse = data;
		switch(input) {
			case "Squats":
				console.log("Squats");
				$scope.exerciseType = "Squats";
				$scope.dataToPlot = [];
				for(var i = 0; i < Object.keys(arrayToUse).length; i ++) {
					$scope.dataToPlot.push({weight: arrayToUse[i].squatWeight, reps: arrayToUse[i].squatRep, name: arrayToUse[i]._user.name});
				}
				console.log($scope.dataToPlot);
				$scope.dataToPlot.sort(function(a, b){
					return b.weight - a.weight;
				})
				break;
			case "Deadlifts":
				console.log("Deadlifts");
				$scope.exerciseType = "Deadlifts";
				$scope.dataToPlot = [];
				for(var i = 0; i < Object.keys(arrayToUse).length; i ++) {
					$scope.dataToPlot.push({weight: arrayToUse[i].deadLiftWeight, reps: arrayToUse[i].deadLiftRep, name: arrayToUse[i]._user.name});
				}
				$scope.dataToPlot.sort(function(a, b){
					return b.weight - a.weight;
				})
				break;
			case "Bench Press":
				console.log("Bench Press");
				$scope.exerciseType = "Bench Press";
				$scope.dataToPlot = [];
				for(var i = 0; i < Object.keys(arrayToUse).length; i ++) {
					$scope.dataToPlot.push({weight: $arrayToUse[i].benchWeight, reps: arrayToUse[i].benchRep, name: arrayToUse[i]._user.name});
				}
				$scope.dataToPlot.sort(function(a, b){
					return b.weight - a.weight;
				})
				break;
			case "Overhead Press":
				console.log("Overhead Press");
				$scope.exerciseType = "Overhead Press";
				$scope.dataToPlot = [];
				for(var i = 0; i < Object.keys(arrayToUse).length; i ++) {
					$scope.dataToPlot.push({weight: arrayToUse[i].ohpWeight, reps: arrayToUse[i].ohpRep, name: arrayToUse[i]._user.name});
				}
				$scope.dataToPlot.sort(function(a, b){
					return b.weight - a.weight;
				})
				break;
			default:
				console.log("All");
		}
	}

	$scope.getData = function (input) {
		statFactory.getData(input, function (data) {
		console.log("got to the controller, getting data for "+input+" from factory");
			switch(input) {
				case "Today":
					$scope.todaysData = data;
					$scope.activeData = data;
					$scope.template = $scope.templates[0];
					break;
				case "Yesterday":
					$scope.yesterdaysData = data;
					$scope.activeData = data;
					$scope.template = $scope.templates[1];
					break;
				case "Week":
					$scope.weeklyData = data;
					$scope.activeData = data;
					$scope.template = $scope.templates[2];
					break;
				case "Month":
					$scope.monthlyData = data;
					$scope.activeData = data;
					$scope.template = $scope.templates[3];
					break;
				case "Year":
					$scope.yearlyData = data;
					$scope.activeData = data;
					$scope.template = $scope.templates[4];
					break;
				default:
					console.log("Nothing to see here");	
			}
		})
	}
})

appModule.controller('graphCtrl', function($scope, $routeParams, statFactory, localStorageService){
	// take the dataToPlot array and break it up for highcharts
	$scope.weightToPlot = [];
	$scope.repsToPlot = [];
	$scope.userNamesToPlot = [];

	for(var i = 0; i < Object.keys($scope.dataToPlot).length; i++){
		$scope.weightToPlot.push($scope.dataToPlot[i].weight);
		$scope.repsToPlot.push($scope.dataToPlot[i].reps);
		$scope.userNamesToPlot.push($scope.dataToPlot[i].name);
	}
	
	console.log($scope.userNamesToPlot);
	// Details for highcharts
	$scope.chartSeries = [
	  {"name": $scope.exerciseType, "data": $scope.weightToPlot},
	  {"name": "Reps", "data": $scope.repsToPlot}
	];

	$scope.chartConfig = {
		options: {
			chart: {
			            type: 'bar'
			        },
			        title: {
			            text: 'Buffest Doodz'
			        },
			        xAxis: {
			            categories: $scope.userNamesToPlot,
			            title: {
			                text: null
			            }
			        },
			        yAxis: {
			            min: 0,
			            title: {
			                text: 'Weight(pounds)',
			                align: 'high'
			            },
			            labels: {
			                overflow: 'justify'
			            }
			        },
			        // tooltip: {
			        //     valueSuffix: ' pounds'
			        // },
			        plotOptions: {
			            bar: {
			                dataLabels: {
			                    enabled: true
			                }
			            },
			            series: {
	                            stacking: 'normal'
		                        }
			        },
			        credits: {
			            enabled: false
			        },
		        },
		        series: $scope.chartSeries
	}
})

// This service has shared functions that multiple controllers can use
appModule.service('utils', function () {
	var sorted = [];
	var getSorted = function() {
		return sorted;
	}

	var sort_by = function(input, data, sortedData) {
		console.log(input, data, sortedData);
		switch(input) {
			case "Name":
				data.sort(function(a, b){
					var textA = a._user.name.toUpperCase();
				    var textB = b._user.name.toUpperCase();
				    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				})
				break;
			case "Date":
				data.sort(function(a, b){
					var textA = a.created_at.toUpperCase();
				    var textB = b.created_at.toUpperCase();
				    return (textB < textA) ? -1 : (textB > textA) ? 1 : 0;
				})
			case "Age":
				data.sort(function(a, b){
					return b._user.age - a._user.age;
				})
				break;
			case "Squat":
				data.sort(function(a, b){
					return b.squatWeight - a.squatWeight;
				})
				break;
			case "Deadlifts":
				data.sort(function(a, b){
					return b.deadLiftWeight - a.deadLiftWeight;
				})
				break;
			case "Bench":
				data.sort(function(a, b){
					return b.benchWeight - a.benchWeight;
				})
				break;
			case "Press":
				data.sort(function(a, b){
					return b.ohpWeight - a.ohpWeight;
				})
				break;
			default:
				console.log("Nothing to see here");	
		}
	}
	return {
    sort_by: sort_by
  };
})