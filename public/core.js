// public/core.js
var ng3Scape = angular.module('3ScapeMain', []);

ng3Scape.controller('projectController', ['$scope', '$http', function($scope, $http) {
	
	$scope.message = "Hello!"

	$scope.formData = {};

	// when landing on the page, get all projects and show them
	$http.get('/api/projects')
		.success(function(data) {
			$scope.projects = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createProject = function() {
		$http.post('/api/projects', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.projects = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a project after checking it
	$scope.deleteProject = function(id) {
		$http.delete('/api/projects/' + id)
			.success(function(data) {
				$scope.projects = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}])
.controller('headerController', ['$scope', 'Global', function($scope, Global) {
	$scope.global	= Global;
}])
.factory('Global', function(){
	var testVar = "Me!"
	var current_user = window.user;
	return {
	  currentUser: function() {
	    return current_user;
	  },
	  isSignedIn: function() {
	    return !!current_user;
	  }
	};
})


// //header.js
// window.angular.module('ngff.controllers.header', [])
//   .controller('headerController', ['$scope', 'Global',
//     function ($scope, Global) {
//  		$scope.global = Global;
 		
// 		$scope.testVar = "Hello!"
//     }]);

// //project.js
// window.angular.module('ngff.controllers.projects', [])
// 	.controller('projectController', ['$scope', 'Global', '$http',
// 		function ($scope, Global, $http) {
	
// 			$scope.message = "Hello!"

// 			$scope.formData = {};

// 			// when landing on the page, get all projects and show them
// 			$http.get('/api/projects')
// 				.success(function(data) {
// 					$scope.projects = data;
// 					console.log(data);
// 				})
// 				.error(function(data) {
// 					console.log('Error: ' + data);
// 				});

// 			// when submitting the add form, send the text to the node API
// 			$scope.createProject = function() {
// 				$http.post('/api/projects', $scope.formData)
// 					.success(function(data) {
// 						$scope.formData = {}; // clear the form so our user is ready to enter another
// 						$scope.projects = data;
// 						console.log(data);
// 					})
// 					.error(function(data) {
// 						console.log('Error: ' + data);
// 					});
// 			};

// 			// delete a project after checking it
// 			$scope.deleteProject = function(id) {
// 				$http.delete('/api/projects/' + id)
// 					.success(function(data) {
// 						$scope.projects = data;
// 						console.log(data);
// 					})
// 					.error(function(data) {
// 						console.log('Error: ' + data);
// 					});
// 			};
// 		}]);

// //app.js
// window.app = angular.module('ngFantasyFootball', ['ngff.controllers']);

// // bundling dependencies
// window.angular.module('ngff.controllers', ['ngff.controllers.header','ngff.controllers.projects']);
// // window.angular.module('ngff.services', ['ngff.services.global', 'ngff.services.nfl', 'ngff.services.leagues', 'ngff.services.fantasyTeams', 'ngff.services.players']);


// //init.js
// window.bootstrap = function () {
//     angular.bootstrap(document, ['ngFantasyFootball']);
// }

// window.init = function () {
//     window.bootstrap();
// }

// $(document).ready(function () {
// 	if (window.location.hash == "#_=_") window.location.hash = "";
//     window.init();
// });