'use strict';
(function() {
  var app = angular.module('iwpm');

  app.controller('MainCtrl', function($scope, $location, TextSources, $timeout) {
    
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
        $.get('./resources/defaultText.txt', function(data) {
          scope.allText = data;
          scope.upcomingText = data;
        });
        scope.charsPerPress = 3;
        scope.showSettings = false;
        scope.showAbout = false;
        scope.showHint = true;
        scope.cursorOn = true;
        scope.repeatText = true;
        scope.showDropzone = true;
        scope.resetText = function(newContent) {
          if (newContent === undefined) {
            newContent = scope.allText;
          }
          if (!angular.isString(newContent)) {
            newContent = angular.toJson(newContent);
          }
          scope.allText = newContent;
          scope.upcomingText = newContent;
          scope.currentText = '';
          if ($location.path() === '/settings') {
            $location.path('/');
          } else {
            scope.showSettings = false;
          }
        };
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
            if (scope.repeatText && scope.upcomingText.length < scope.charsPerPress) {
              scope.upcomingText += '\n' + scope.allText;
            }
            var newOutput = scope.upcomingText.substring(0, scope.charsPerPress);
            scope.upcomingText = scope.upcomingText.substring(scope.charsPerPress);
            scope.currentText += newOutput;
          };

          keyPressed[charCode('?')] = function(event) {
            if (scope.showSettings) {
              $location.path('/');
            } else {
              $location.path('/settings');
            }
            event.preventDefault();
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
        var showOneOverlay = function(name) {
          scope.showSettings = false;
          scope.showHint = false;
          scope.showAbout = false;
          if (name) {
            scope['show' + name] = true;
          }
        };
        var locations = {
          '/settings': 'Settings',
          '/hint': 'Hint',
          '/about': 'About',
          '/': function() {
            showOneOverlay();
            document.activeElement.blur();
          }
        };
        var resetContent = function(options) {
          TextSources.getContent(angular.extend({
            callback: scope.resetText
          }, options));
        }
        var queryParams = {
          gist: function(value) {
            var file = $location.search().file;
            resetContent({
              type: 'gist',
              id: value,
              file: file
            });
          },
          github: function(value) {
            var repo = $location.search().repo;
            var owner = $location.search().owner;
            var ref = $location.search().ref;
            if (!repo || !owner) {
              return; //Can't get anything...
            }
            resetContent({
              type: 'github',
              repo: repo,
              owner: owner,
              ref: ref,
              path: value
            });
          },
          api: function(value) {
            var path = $location.search().path;
            resetContent({
              type: 'api',
              endpointUrl: value,
              path: path
            });
          }
        };
        scope.$watch(function() {
          return $location.path();
        }, function() {
          var path = $location.path();
          path = path || '/';
          var action = locations[path];
          if (action) {
            if (angular.isFunction(action)) {
              action();
            } else {
              showOneOverlay(action);
            }
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
      otherBindings: function(scope) {
        var hackArea = document.getElementById('hack-area');
        scope.$watch('currentText', function() {
          hackArea.scrollTop = hackArea.scrollHeight;
        });
      },
      go: function(scope) {
        for (var prop in this) {
          if (prop !== 'go') {
            this[prop](scope);
          }
        }
        cursorGo();
      }
    };
    
    setup.go($scope);
  });
})();