'use strict';
(function() {
  var app = angular.module('iwpm', ['ngCookies']);
  app.config(function($routeProvider) {
    $routeProvider.otherwise({redirectTo:'/'});
  });
  
  app.run(function($window, $location, $timeout, $cookies) {
    var hintCookieId = 'iwpm-hint-shown';
    $window.onresize = function() {
      document.getElementById('hack-area').style.height = ($window.innerHeight - 30) + 'px';
    };
    $window.onresize();
    if (!$cookies[hintCookieId]) {
      $location.path('/hint');
      $timeout(function() {
        $cookies[hintCookieId] = true;
        $location.path('/');
      }, 2000);
    }
  });

})();
