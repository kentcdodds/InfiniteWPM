'use strict';
(function() {
  var app = angular.module('iwpm');
  
  app.factory('TextSources', function($http, $rootScope) {
    var sources, sendRequest;
    
    sources = {
      gist: function(options, callback) {
        var url = 'https://api.github.com/gists/' + options.id;
        sendRequest(url, function(data) {
          var fileNumber;
          var gistFile = options.file;
          if (!angular.isString(gistFile)) {
            fileNumber = angular.isNumber(gistFile) ? gistFile : 0;
            gistFile = Object.keys(data.files)[fileNumber];
          }
          callback(data.files[gistFile].content);
        });
      },
      pastebin: function(options, callback) {
        var url = 'http://pastebin.com/raw.php?i=' + options.id;
        sendRequest(url, callback);
      },
      github: function(options) {
        var url = 'https://api.github.com/repos/' + options.owner + '/' + options.repo + '/contents' + options.path;
        sendRequest(url, function(data) {
          callback(atob(data.content));
        });
      }
    };

    sendRequest = function(url, callback) {
      var req = $http.get(url);
      req.success(callback);
      req.error(function(data, status) {
        console.log(arguments);
        if (status === 404) {
          console.log('404: ' + data.message);
        } else {
          console.log('Unknown Error - ' + status + ': ' + data.message);
        }
      });
    };

    return {
      getContent: function(options) {
        var sourceFunction = sources[options.type];
        if (angular.isFunction(sourceFunction)) {
          sourceFunction(options, options.callback);
        }
      }
    }
  });
})();