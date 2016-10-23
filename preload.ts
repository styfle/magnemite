//alert('hello');
import {startRecording, stopRecording} from './renderer';
window.onload = function() {

    //var r = require('./renderer.js');
    startRecording(99);
    var w: any = window;
    w['__stopRecording'] = stopRecording;
    //setTimeout(function() { stopRecording(); }, 15000);

};