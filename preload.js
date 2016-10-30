"use strict";
const renderer_1 = require('./renderer');
const electron_1 = require('electron');
window.onload = function () {
    let counts = electron_1.remote.getGlobal('counts');
    counts.recordingNumber++;
    renderer_1.startRecording(counts.recordingNumber);
    var w = window;
    w['__stopRecording'] = renderer_1.stopRecording;
};
window.onbeforeunload = function () {
};
