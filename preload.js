//alert('hello');
window.onload = function() {

    var r = require('./renderer.js');
    r.startRecording('preload');
    setTimeout(function() { r.stopRecording(); }, 15000);

};