angular.module('hif').controller('HackCtrl', function($scope, $timeout) {
  var keys;
  var executeKey, resetCursor;
  var wildcard = '*';

  $scope.currentOut = "";
  $scope.upcomingText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dapibus tortor lorem, nec faucibus augue tristique ac. Nulla facilisi. Suspendisse potenti. Etiam mattis orci tempor, suscipit lacus eget, rhoncus ante. Quisque condimentum ipsum ac nunc dictum hendrerit. Sed ultricies volutpat ligula, vitae eleifend sapien pulvinar non. Aenean fringilla nec turpis eget commodo. Phasellus mattis fermentum lorem sit amet congue. Phasellus fermentum massa neque, ac volutpat urna pretium ut.";
  $scope.charsPerPress = 3;
  $scope.showSettings = false;
  $scope.cursorOn = true;

  keys = (function() {
    var keyDown = {};
    var keyPressed = {};
    var charCode = function(character) {
      return character.charCodeAt(0);
    };
    var otherKeys = {
      backspace: '8'
    };

    keyDown[otherKeys.backspace] = function() {
      var end = $scope.currentOut.length;
      var start = end - $scope.charsPerPress;
      var removedOutput = $scope.currentOut.substring(start, end);
      $scope.currentOut = $scope.currentOut.substring(0, start);
      $scope.upcomingText += removedOutput;
    };

    keyPressed[wildcard] = function() {
      var newOutput = $scope.upcomingText.substring(0, $scope.charsPerPress);
      $scope.upcomingText = $scope.upcomingText.substring($scope.charsPerPress);
      $scope.currentOut += newOutput;
    };

    keyPressed[charCode('?')] = function() {
      $scope.showSettings = !$scope.showSettings;
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
      $scope.cursorOn = true;
    }
  };

  $scope.keyPressed = function(event) {
    executeKey(event, keys.keyPressed);
  }

  $scope.keyDown = function(event) {
    executeKey(event, keys.keyDown);
  };

  var cursorGo = (function() {
    var timeout;
    return function() {
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function() {
        $scope.cursorOn = !$scope.cursorOn;
        cursorGo();
      }, 500);
    }
  })();
  cursorGo();
});