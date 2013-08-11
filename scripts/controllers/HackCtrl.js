angular.module('hif').controller('HackCtrl', function($scope, $location, Gist, $timeout) {
  
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
      scope.currentOut = "";
      scope.allText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dapibus tortor lorem, nec faucibus augue tristique ac. Nulla facilisi. Suspendisse potenti. Etiam mattis orci tempor, suscipit lacus eget, rhoncus ante. Quisque condimentum ipsum ac nunc dictum hendrerit. Sed ultricies volutpat ligula, vitae eleifend sapien pulvinar non. Aenean fringilla nec turpis eget commodo. Phasellus mattis fermentum lorem sit amet congue. Phasellus fermentum massa neque, ac volutpat urna pretium ut.";
      scope.upcomingText = scope.allText;
      scope.charsPerPress = 3;
      scope.showSettings = false;
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
          var end = scope.currentOut.length;
          var start = end - scope.charsPerPress;
          var removedOutput = scope.currentOut.substring(start, end);
          scope.currentOut = scope.currentOut.substring(0, start);
          scope.upcomingText += removedOutput;
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
          scope.currentOut += newOutput;
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
        '/': function() {
          scope.showSettings = false;
        }
      };
      var queryParams = {
        gist: function(gistId) {
          var file = $location.search().gistFile;
          Gist.getContent(gistId, file, function(content) {
            scope.allText = content;
            scope.upcomingText = content;
            scope.currentText = '';
          });
        }
      };
      scope.$watch(function() {
        return $location.path();
      }, function() {
        var path = $location.path();
        if (locations[path]) {
          locations[path]();
        } else if (/gist/g.test(path)) {
          var gistId = path.substring(path.lastIndexOf('/') + 1, path.length);
          Gist.getContent(gistId, function(content) {
            scope.upcomingText = content;
            scope.currentText = '';
          });
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
    go: function(scope) {
      this.keyEvents(scope);
      this.defaults(scope);
      this.location(scope);
      cursorGo();
    }
  }.go($scope);
});