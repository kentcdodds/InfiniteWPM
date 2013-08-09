angular.module('hif').directive('dropzone', function() {
  return {
    restrict : 'A',
    link: function (scope, elem) {
      console.log('link');
      $(elem).bind('drop', function(evt) {
        console.log('dropped');
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files;
        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
          reader.readAsArrayBuffer(f);

          reader.onload = (function(theFile) {
            return function(e) {
              var newFile = {
                name : theFile.name,
                type: theFile.type,
                size: theFile.size,
                lastModifiedDate: theFile.lastModifiedDate
              };
              scope.addfile(newFile);
            };
          })(f);
        }
      });
    }
  };
});