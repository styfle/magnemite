"use strict";
const electron_1 = require('electron');
const fs = require('fs');
const SECRET_KEY = 'ELECTRON_APP_SHELL';
const title = document.title;
document.title = SECRET_KEY;
electron_1.desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error)
        throw error;
    console.log('sources', sources);
    for (let i = 0; i < sources.length; ++i) {
        let src = sources[i];
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
    recorder.ondataavailable = (event) => {
        blobs.push(event.data);
    };
    recorder.start();
    setTimeout(function () {
        recorder.stop();
        console.log('captured ' + blobs.length);
        const w = window;
        w.blobs = blobs;
        toArrayBuffer(new Blob(blobs, { type: 'video/webm' }), function (ab) {
            const buffer = toBuffer(ab);
            fs.writeFile('./videos/video3.webm', buffer, err => console.error('failed to write', err));
        });
    }, 5000);
}
function getUserMediaError(e) {
    console.log('getUserMediaError', e);
    throw e;
}
function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function () {
        var arrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}
function toBuffer(ab) {
    let buffer = new Buffer(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}
function toBufferConcat(abArray) {
    let len = 0;
    abArray.forEach(ab => { len += ab.byteLength; });
    let buffer = new Buffer(len);
    let bIndex = 0;
    for (let ab of abArray) {
        let arr = new Uint8Array(ab);
        for (let aIndex = 0; aIndex < arr.byteLength; aIndex++) {
            buffer[bIndex] = arr[aIndex];
            bIndex++;
        }
    }
    return buffer;
}
