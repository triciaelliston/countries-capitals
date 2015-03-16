angular.module('CountriesCapitals', ['ngRoute', 'ngAnimate'])
	.config(function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : './home.html',
			controller : 'HomeCtrl'
		}).when('/countries', {
			templateUrl : './countries.html',
			controller : 'CountriesCtrl'
		}).when('/countries/:countryCode/capital', {
			templateUrl : './capital.html',
			controller : 'CapitalCtrl',
			resolve : {
				countryCode: function($route) {
					return $route.current.params.countryCode;
				}
			}
		}).when('/error', {
			templateUrl : '<p>Error Page Not Found</p>'
		}).otherwise( {
			redirectTo : '/error'
		});
	})
	
	.run(function($rootScope, $location, $timeout) {
		$rootScope.$on('$routeChangeError', function() {
			$location.path('/error');
			console.log("inside $routeChangeError");
		});
		$rootScope.$on('$routeChangeStart', function() {
			$rootScope.isLoading = true;
			console.log("inside $routeChangeStart");
		});
		$rootScope.$on('$routeChangeSuccess', function() {
			$timeout(function() {
				$rootScope.isLoading = false;
			}, 1000);
			console.log("inside $routeChangeSuccess");
		});
	})
	.controller('HomeCtrl', function($scope) {
		console.log("inside HomeCtrl");
	})
	.controller('CountriesCtrl', function($scope) {
		console.log("inside CountriesCtrl");
	})
	.controller('CapitalCtrl', function($scope) {
		console.log("inside CapitalCtrl");
	})
