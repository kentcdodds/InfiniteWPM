angular.module('iwpm').directive('dropzone', function() {
  var toggleClass = 'hide', supportedUrls; //hoist-monster
  
  var handleDragEvent, getDataTransferFromEvent,
    handleDropEvent, handleDroppedString, handleDroppedFile,
    prepStringForTextReset; //function hoister
  
  handleDragEvent = function(event, element) {
    var $element = $(element);
    if (!event) {
      return;
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault()) {
      event.preventDefault();
    }
    if (event.originalEvent) {
      if (event.originalEvent.stopPropagation) {
        event.originalEvent.stopPropagation();
      }
      if (event.originalEvent.preventDefault) {
        event.originalEvent.preventDefault();
      }
    }

    if (event.type === 'dragover') {
      $element.removeClass(toggleClass);
    } else {
      $element.addClass(toggleClass);
    }
  };
  
  getDataTransferFromEvent = function(event) {
    if (event.originalEvent) {
      return event.originalEvent.dataTransfer;
    } else if (event.dataTransfer) {
      return event.dataTransfer;
    } else {
      return undefined;
    }
  };

  handleDropEvent = function(e, element, scope) {
    handleDragEvent(e, element);
    var dataTransfer = getDataTransferFromEvent(e);
    if (!dataTransfer) {
      return;
    }
    var dataTransferItems = dataTransfer.items;
    if (!dataTransferItems) {
      return;
    }
    
    dataTransfer = dataTransferItems.item(0);
    if (!dataTransfer) {
      return;
    }
    
    if (dataTransfer.kind === 'string') {
      dataTransfer = dataTransferItems.item(1) || dataTransfer;
      handleDroppedString(dataTransfer, scope);
    } else {
      handleDroppedFile(dataTransfer, scope);
    }
  };

  supportedUrls = [
    function gist(url) {
      if (url.indexOf('gist.github.com') < 0) {
        return null;
      }
      alert('you dropped a gist!');
      return url;
    },
    function github(url) {
      if (url.indexOf('github.com') < 0) {
        return null;
      }
      alert('you dropped a github url!');
      return url;
    },
    function api(url) {
      return url;
    }
  ];
  
  handleDroppedString = function(dataTransfer, scope) {
    dataTransfer.getAsString(function(string) {
      prepStringForTextReset(string, scope);
    });
  };

  handleDroppedFile = function(dataTransfer, scope) {
    var file = dataTransfer.getAsFile();
    var reader = new FileReader();
    reader.onload = function(event) {
      prepStringForTextReset(event.target.result, scope);
    };
    reader.readAsText(file);
  };
  
  prepStringForTextReset = function(string, scope) {
    var resolvedUrl = null;
    if (/^http(s)?:\/\/.*$/.test(string)) {
      console.log('url dropped');
      for (var i = 0; i < supportedUrls.length; i++) {
        resolvedUrl = supportedUrls[i](string);
        if (resolvedUrl) {
          string = resolvedUrl;
          break;
        }
      }
    }
    scope.resetText(string);
  };
  
  return {
    restrict : 'A',
    link: function (scope, elem) {
      var dropzone = $(elem);
      var onDragEvent = function(event) {
        handleDragEvent(event, elem);
      };
      dropzone.on('dragover', onDragEvent);
      dropzone.on('dragleave', onDragEvent);
      dropzone.on('drop', function(event) {
        handleDropEvent(event, elem, scope);
      });
    }
  };
});