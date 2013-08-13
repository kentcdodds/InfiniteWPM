// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
} else {
  alert('The File APIs are not fully supported in this browser. Some parts of the app will not work. Try using Google Chrome.');
}

