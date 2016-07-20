// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// In the renderer process.
const {desktopCapturer} = require('electron');
const SECRET_KEY = 'ELECTRON_APP_SHELL'
var title = document.title;
document.title = SECRET_KEY

desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error;
    console.log('sources', sources)
    for (let i = 0; i < sources.length; ++i) {
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
    var recorder = new MediaRecorder(stream);
    var blobs = [];
    recorder.ondataavailable = function(event) {
        blobs.push(event.data);
    };
    recorder.start();
    setTimeout(function() {
        recorder.stop();
        console.log('captured ' + blobs.length);
    }, 5000); // 15 seconds
    //document.querySelector('video').src = URL.createObjectURL(stream);
}

function getUserMediaError(e) {
    console.log('getUserMediaError', e);
    throw e;
}