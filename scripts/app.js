'use strict';
(function() {
  var app = angular.module('iwpm', []);
  app.config(function($routeProvider) {
    $routeProvider.otherwise({redirectTo:'/'});
  });
  
  app.run(function($window, $location, $timeout) {
    var hintCookieId = 'iwpm-hint-shown';
    $window.onresize = function() {
      document.getElementById('hack-area').style.height = ($window.innerHeight - 30) + 'px';
    };
    $window.onresize();
    if (!localStorage || localStorage.getItem(hintCookieId)) {
      $location.path('/hint');
      $timeout(function() {
        localStorage.setItem('iwpm-hint-shown', true);
        $location.path('/');
      }, 2000);
    }
  });

})();
