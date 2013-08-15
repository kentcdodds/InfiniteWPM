'use strict';
(function() {
  var app = angular.module('iwpm');
  
  app.factory('TextSources', function($http, $rootScope) {
    var sources, sendRequest;
    
    sources = {
      gist: function(options) {
        var url = 'https://api.github.com/gists/' + options.id;
        sendRequest(url, function(data) {
          var fileNumber;
          var gistFile = options.file;
          if (!angular.isString(gistFile)) {
            fileNumber = angular.isNumber(gistFile) ? gistFile : 0;
            gistFile = Object.keys(data.files)[fileNumber];
          }
          options.callback(data.files[gistFile].content);
        });
      },
      github: function(options) {
        var url = 'https://api.github.com/repos/' +
          options.owner + '/' + options.repo +
          '/contents/' + options.path +
          (options.ref ? '?ref=' + options.ref : '');
        
        sendRequest(url, function(data) {
          options.callback(atob(data.content.replace(/\n/g, '')));
        });
      },
      api: function(options) {
        var url = options.endpointUrl;
        sendRequest(url, function(data) {
          if (options.path) {
            var regex = /\['(.*?)'\]/g;
            var prop;
            while (prop = regex.exec(options.path)) {
              data = data[prop[1]];
            }
          }
          if (angular.isObject(data)) {
            data = angular.toJson(data, true);
          }
          options.callback(data);
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
          sourceFunction(options);
        }
      }
    }
  });
})();