'use strict';
(function() {
  var app = angular.module('iwpm');
  
  app.factory('Gist', function($http, $rootScope) {
    var listUrl = 'https://api.github.com/gists/';
    return {
      getContent: function(id, gistFile, callback) {
        $http.get(listUrl + id).success(function(data) {
          if (!gistFile) {
            gistFile = Object.keys(data.files)[0];
          }
          callback(data.files[gistFile].content);
        });
      }
    }
  });
})();