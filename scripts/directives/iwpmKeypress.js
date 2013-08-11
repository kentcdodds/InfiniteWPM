angular.module('iwpm').directive('iwpmKeypress', function($document) {
  var keys = {
    backspace: 8
  }
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    link: function postLink(scope, iElement, iAttrs) {
      $(document).on('keydown', function(e) {
        scope.$apply(scope.keyDown(e));
      }).
      on('keypress', function(e) {
        scope.$apply(scope.keyPressed(e));
      });
    }
  };
});