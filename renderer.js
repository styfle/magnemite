"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// In the renderer process.
var electron_1 = require('electron');
var fs = require('fs');
var SECRET_KEY = 'ELECTRON_APP_SHELL';
var title = document.title;
document.title = SECRET_KEY;
electron_1.desktopCapturer.getSources({ types: ['window', 'screen'] }, function (error, sources) {
    if (error)
        throw error;
    console.log('sources', sources);
    for (var i = 0; i < sources.length; ++i) {
        var src = sources[i];
        if (src.name === SECRET_KEY) {
            document.title = title;
            navigator.webkitGetUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: src.id,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            }, gotStream, getUserMediaError);
            return;
        }
    }
});
function gotStream(stream) {
    console.log(typeof stream, stream);
    var recorder = new MediaRecorder(stream);
    var blobs = [];
    recorder.ondataavailable = function (event) {
        blobs.push(event.data);
    };
    recorder.start();
    setTimeout(function () {
        recorder.stop();
        console.log('captured ' + blobs.length);
        var fileReader = new FileReader();
        fileReader.onload = function () {
            var arrayBuffer = this.result;
            fs.writeFile('./blobs.txt', arrayBuffer, 'binary', function (err) { return console.error('failed to write', err); });
        };
        fileReader.readAsArrayBuffer(blobs[0]);
    }, 5000); // 15 seconds
    //document.querySelector('video').src = URL.createObjectURL(stream);
}
function getUserMediaError(e) {
    console.log('getUserMediaError', e);
    throw e;
}
