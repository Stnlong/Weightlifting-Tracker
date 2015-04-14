var appModule = angular.module('app', ['ngRoute', 'LocalStorageModule', 'highcharts-ng']);

appModule.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: './partials/main.html'
		})
		.when('/profile', {
			templateUrl: './partials/profile.html',
			controller: 'userProfileCtrl'
		})
		.when('/graph', {
			templateUrl: './partials/graph.html',
			controller: 'graphCtrl'
		})
		.when('/viewProfile', {
			templateUrl: './partials/viewprofile.html',
			controller: 'userProfileCtrl'
		})

})