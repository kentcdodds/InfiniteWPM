angular.module('hif', [])
  .config(function($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider.
      otherwise({redirectTo:'/'});
  });
