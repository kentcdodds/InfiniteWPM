'use strict';
(function() {
  var app = angular.module('iwpm');
  
  app.controller('MainCtrl', function($scope, defaultText, $location, TextSources, $timeout) {
    
    var cursorGo = (function() {
      var timeout;
      return function() {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(function() {
          $scope.cursorOn = !$scope.cursorOn;
          cursorGo();
        }, 350);
      }
    })();
    
    var setup = {
      defaults: function(scope) {
        scope.currentText = '';
        scope.allText = defaultText;
        scope.upcomingText = scope.allText;
        scope.charsPerPress = 3;
        scope.showSettings = false;
        scope.showHint = true;
        scope.cursorOn = true;
        scope.repeatText = true;
      },
      keyEvents: function(scope) {
        var wildcard = '*';
        var executeKey;
        var keys = (function() {
          var keyDown = {};
          var keyPressed = {};
          var charCode = function(character) {
            return character.charCodeAt(0);
          };
          var canType = function() {
            return !scope.showSettings;
          };
          var otherKeys = {
            backspace: '8'
          };

          keyDown[otherKeys.backspace] = function(event) {
            if (!canType()) {
              return;
            }
            var end = scope.currentText.length;
            var start = end - scope.charsPerPress;
            var removedOutput = scope.currentText.substring(start, end);
            scope.currentText = scope.currentText.substring(0, start);
            scope.upcomingText = removedOutput + scope.upcomingText;
            event.preventDefault();
          };

          keyPressed[wildcard] = function() {
            if (!canType()) {
              return;
            }
            if (scope.upcomingText.length < scope.charsPerPress) {
              scope.upcomingText += scope.allText;
            }
            var newOutput = scope.upcomingText.substring(0, scope.charsPerPress);
            scope.upcomingText = scope.upcomingText.substring(scope.charsPerPress);
            scope.currentText += newOutput;
          };

          keyPressed[charCode('?')] = function() {
            if (scope.showSettings) {
              $location.path('/');
            } else {
              $location.path('/settings');
            }
          };

          return {
            keyDown: keyDown,
            keyPressed: keyPressed
          };
        })();

        executeKey = function(event, keyset) {
          var key = keyset['' + event.which] || keyset[wildcard];
          if (key) {
            key(event);
            cursorGo();
            scope.cursorOn = true;
          }
        };

        scope.keyPressed = function(event) {
          executeKey(event, keys.keyPressed);
        };

        scope.keyDown = function(event) {
          executeKey(event, keys.keyDown);
        };
      },
      location: function(scope) {
        var locations = {
          '/settings': function() {
            scope.showSettings = true;
          },
          '/hint': function() {
            scope.showHint = true;
          },
          '/': function() {
            scope.showSettings = false;
            scope.showHint = false;
          }
        };
        var resetContent = function(type, id) {
          var file = $location.search().file;
          TextSources.getContent({
            type: type,
            id: id,
            file: file,
            callback: function(content) {
              scope.allText = content;
              scope.upcomingText = content;
              scope.currentText = '';
            }
          });
        }
        var queryParams = {
          gist: function(id) {
            resetContent('gist', id);
          },
          pastebin: function(id) {
            resetContent('pastebin', id);
          }
        };
        scope.$watch(function() {
          return $location.path();
        }, function() {
          var path = $location.path();
          if (locations[path]) {
            locations[path]();
          }
        });
        scope.$watch(function() {
          return $location.search();
        }, function() {
          var search = $location.search();
          angular.forEach(search, function(value, key) {
            var paramFunction = queryParams[key];
            if (paramFunction) {
              paramFunction(value);
            }
          });
        });
      },
      fadeHint: function() {
        $location.path('/hint');
        $timeout(function() {
          $location.path('/');
        }, 500);
      },
      go: function(scope) {
        this.fadeHint();
        this.keyEvents(scope);
        this.defaults(scope);
        this.location(scope);
        cursorGo();
      }
    }.go($scope);
  });
})();