'use strict';
(function() {
  var app = angular.module('iwpm');
  
  app.factory('Gist', function($http, $rootScope) {
    var listUrl = 'https://api.github.com/gists/';
    return {
      getContent: function(id, gistFile, callback) {
        var req = $http.get(listUrl + id);
        req.success(function(data) {
          var fileNumber;
          if (!angular.isString(gistFile)) {
            fileNumber = angular.isNumber(gistFile) ? gistFile : 0;
            gistFile = Object.keys(data.files)[fileNumber];
          }
          callback(data.files[gistFile].content);
        });
        req.error(function(data, status) {
          console.log(arguments);
          if (status === 404) {
            console.log('404: ' + data.message);
          } else {
            console.log('Unknown Error - ' + status + ': ' + data.message);
          }
        });
      }
    }
  });
})();