angular.module('CountriesCapitals', ['ngRoute', 'ngAnimate'])
	.constant('API_CONFIG', {
    	BASE_URL: 'http://api.geonames.org',
    	COUNTRY_ENDPOINT: '/countryInfoJSON',
    	CAPITAL_ENDPOINT: '/searchJSON',
    	NEIGHBORS_ENDPOINT: '/neighboursJSON',
    	USERNAME: 'demo',
    	METHOD: 'JSONP',
    	CALLBACK: 'JSON_CALLBACK'
  	})
	.factory("servGetGeoCountries", function($http, API_CONFIG) {
		return function(endpoint, qryParams) {
			console.log("inside servGetGeoCountries");
			var apiParams = {
				username: API_CONFIG.USERNAME,
				callback: API_CONFIG.CALLBACK
			};
			return $http({
				method: API_CONFIG.METHOD, 
				url: API_CONFIG.BASE_URL + endpoint, 
				params: apiParams,
			});
		};
	})
	.factory("servGetCountryDetails", function($http, API_CONFIG, servGetGeoCountries) {
		return function(countryCode) {
			console.log("inside servGetCountryDetails");
			var qryParams = {
				country: countryCode 
			};
			return servGetGeoCountries(API_CONFIG.COUNTRY_ENDPOINT, qryParams).then(function(countryDetails) {
				console.log(countryCode);
				console.log("display countryDetails");
				if (countryCode) {
					console.log(countryDetails.data.geonames[0]);
            		return countryDetails.data.geonames[0];
          		} else {
          			console.log(countryDetails.data.geonames);
           			return countryDetails.data.geonames;
          		}
			});
		};
	})
	.factory("servGetCapitalDetails", function($http, API_CONFIG, servGetGeoCountries) {
		return function(countryCode) {
			console.log("inside servGetCapitalDetails");
			var qryParams = {
				country: countryCode 
			};
			return servGetGeoCountries(API_CONFIG.CAPITAL_ENDPOINT, qryParams).then(function(capitalDetails) {
				return capitalDetails.data.geonames;
			});
		};
	})
	.factory("servGetNeighbors", function($http, API_CONFIG, servGetGeoCountries) {
		return function(countryCode) {
			console.log("inside servGetNeighbors");
			var qryParams = {
				country: countryCode 
			};
			return servGetGeoCountries(API_CONFIG.NEIGHBORS_ENDPOINT, qryParams).then(function(neighbors) {
				return neighbors.data.geonames;
			});
		};
	})

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
					console.log("display $route.current.params.countryCode");
					console.log($route.current.params.countryCode);
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
	.controller('HomeCtrl', function($scope, servGetGeoCountries) {
		console.log("inside HomeCtrl");
	})
	.controller('CountriesCtrl', function($scope, servGetCountryDetails) {
		console.log("inside CountriesCtrl");	
		servGetCountryDetails().then(function(countryDetails) {
			console.log("returned countryDetails");
			console.log(countryDetails);
      		$scope.countries = countryDetails;
    	});
	})
	.controller('CapitalCtrl', function($scope, countryCode, servGetCapitalDetails, servGetCountryDetails, servGetNeighbors) {
		console.log("inside CapitalCtrl");

		var getCapitalDetails = function() {
			return servGetCapitalDetails(countryCode).then(function(capitalDetails) {
				console.log("returned capitalDetails");
				console.log(capitalDetails);
				$scope.capitalDetails = capitalDetails;
				return capitalDetails;
			});
		};

		var getCountryDetails = function() {
			return servGetCountryDetails(countryCode).then(function(countryDetails) {
				console.log("returned countryDetails");
				console.log(countryDetails);
				$scope.countryDetails = countryDetails;
				return countryDetails;
			});
		};

		var getNeighbors = function() {
			return servGetNeighbors(countryCode).then(function(neighbors) {
				console.log("returned neighbors");
				console.log(neighbors);
				$scope.neighbors = neighbors;
				return neighbors;
			});
	    };

		$scope.countryCode = countryCode;

		getCountryDetails();
    	getCapitalDetails();
    	getNeighbors(countryCode);
	})
