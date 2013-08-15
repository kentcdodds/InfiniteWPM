angular.module('iwpm').directive('dropzone', function($location) {
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
      var specificFileRegex, generalGistRegex, generalGistWithoutUsernameRegex;
      var matchArray;
      specificFileRegex = /gist\.github\.com\/(.*?)\/(\d+)\/raw\/.*?\/(.*?)$/;
      matchArray = specificFileRegex.exec(url);
      if (matchArray) {
        $location.search({
          gist: matchArray[2],
          file: matchArray[3]
        });
        return true;
      }
      generalGistRegex = /gist\.github\.com\/(.*?)\/(\d+)$/;
      matchArray = generalGistRegex.exec(url);
      if (matchArray) {
        $location.search({
          gist: matchArray[2]
        });
        return true;
      }
      generalGistWithoutUsernameRegex = /gist\.github\.com\/(\d+)$/;
      matchArray = generalGistWithoutUsernameRegex.exec(url);
      if (matchArray) {
        $location.search({
          gist: matchArray[1]
        });
        return true;
      }
      return false;
    },
    function github(url) {
      var githubRegex, githubRawRegex;
      var matchedArray;
      githubRawRegex = /raw\.github\.com\/(.*?)\/(.*?)\/(.*?)\/(.*?)$/;
      matchedArray = githubRawRegex.exec(url);
      if (matchedArray) {
        $location.search({
          github: matchedArray[4],
          owner: matchedArray[1],
          repo: matchedArray[2],
          ref: matchedArray[3]
        });
        return true;
      }
      githubRegex = /github\.com\/(.*?)\/(.*?)\/.*?\/(.*?)\/(.*?)$/;
      matchedArray = githubRegex.exec(url);
      if (matchedArray) {
        $location.search({
          github: matchedArray[4],
          owner: matchedArray[1],
          repo: matchedArray[2],
          ref: matchedArray[3]
        });
        return true;
      }
      return false;
    },
    function api(url) {
      // No need to test if it's a URL because this
      // function should only be called when it is...
      $location.search({
        api: url
      });
      return true;
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
    var urlRegex = /^http(s)?:\/\/.*?\..+$/;
    if (urlRegex.test(string)) {
      for (var i = 0; i < supportedUrls.length; i++) {
        resolvedUrl = supportedUrls[i](string);
        if (resolvedUrl) {
          return;
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