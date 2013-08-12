'use strict';
(function() {
  var app = angular.module('iwpm');
  
  var fakeNgModel = function(initValue) {
    return {
      $setViewValue: function(value) {
        this.$viewValue = value;
      },
      $viewValue: initValue
    };
  };

  app.directive('scrollGlue', function() {
    return {
      priority: 1,
      require: ['?ngModel'],
      restrict: 'A',
      link: function(scope, $el, attrs, ctrls) {
        var el = $el[0];
        var ngModel = ctrls[0] || fakeNgModel(true);

        var scrollToBottom = function() {
          el.scrollTop = el.scrollHeight;
        }

        var shouldActivateAutoScroll = function() {
          return el.scrollTop + el.clientHeight == el.scrollHeight;
        }

        scope.$watch(function() {
          if(ngModel.$viewValue){
              scrollToBottom();
          }
        });

        $el.bind('scroll', function() {
          scope.$apply(ngModel.$setViewValue.bind(ngModel, shouldActivateAutoScroll()));
        });
      }
    };
  });
})();