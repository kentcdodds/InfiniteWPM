angular.module('iwpm').directive('dropzone', function() {
  return {
    restrict : 'A',
    link: function (scope, elem) {
      console.log(arguments);
      var dropzone = document.querySelector('[dropzone]');
      dropzone.addEventListener('dragenter', function(event) {
        console.log(event.type);
        dropzone.className = dropzone.className.replace(/hide/g, '');
      }, false);
      dropzone.addEventListener('dragleave', function(event) {
        console.log(event.type);
        dropzone.className += ' hide';
      }, false);
      /*
      $(document).on('drop', function(event) {
        console.log('dropped');
        event.stopPropagation();
        event.preventDefault();

        var files = event.dataTransfer.files;
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
              console.log(newFile);
              //scope.addfile(newFile);
            };
          })(f);
        }
      }).on('dragenter', function(event) {
          event.stopPropagation();
        console.log('dragenter');
        $(elem).removeClass('hide');
      }).on('dragleave', function(event) {
          event.stopPropagation();
        console.log('dragleave');
        $(elem).addClass('hide'); 
      });
*/
      console.log(elem);
    }
  };
});