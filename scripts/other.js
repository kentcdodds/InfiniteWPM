// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
} else {
  alert('The File APIs are not fully supported in this browser. App will not work. Try Google Chrome.');
}

