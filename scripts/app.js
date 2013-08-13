'use strict';
(function() {
  var app = angular.module('iwpm', []);
  app.config(function($routeProvider) {
    $routeProvider.otherwise({redirectTo:'/'});
  });
  app.run(function($window, $location, $timeout) {
    $window.onresize = function() {
      document.getElementById('hack-area').style.height = ($window.innerHeight - 30) + 'px';
    };
    $window.onresize();

    //Show hint...
    $location.path('/hint');
    $timeout(function() {
      $location.path('/');
    }, 500);
  });

})();
