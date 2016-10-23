"use strict";
const renderer_1 = require('./renderer');
window.onload = function () {
    renderer_1.startRecording(99);
    var w = window;
    w['__stopRecording'] = renderer_1.stopRecording;
};
