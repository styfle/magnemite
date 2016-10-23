"use strict";
const electron_1 = require('electron');
const fs_1 = require('fs');
const SECRET_KEY = 'Magnemite';
var recorder;
var blobs = [];
var seqNumber;
function startRecording(num) {
    seqNumber = num;
    console.log('startRecording', seqNumber);
    const title = document.title;
    document.title = SECRET_KEY;
    electron_1.desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
        if (error)
            throw error;
        console.log('sources', sources);
        for (let i = 0; i < sources.length; i++) {
            let src = sources[i];
            if (src.name === SECRET_KEY) {
                document.title = title;
                navigator.webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: src.id,
                            minWidth: 800,
                            maxWidth: 1280,
                            minHeight: 600,
                            maxHeight: 720
                        }
                    }
                }, handleStream, handleUserMediaError);
                return;
            }
        }
    });
}
exports.startRecording = startRecording;
function handleStream(stream) {
    console.log('handleStream', seqNumber);
    recorder = new MediaRecorder(stream);
    blobs = [];
    recorder.ondataavailable = (event) => {
        blobs.push(event.data);
    };
    recorder.start();
}
function stopRecording() {
    console.log('stopRecording', seqNumber);
    if (!recorder) {
        console.log('nothing to stop', seqNumber);
        return;
    }
    recorder.stop();
    toArrayBuffer(new Blob(blobs, { type: 'video/webm' }), function (ab) {
        const buffer = toBuffer(ab);
        const file = `./videos/video-nav-${seqNumber}.webm`;
        fs_1.writeFile(file, buffer, err => {
            if (err) {
                alert('Failed to save video ' + err);
            }
            else {
                console.log('Saved video: ' + file);
            }
        });
    });
}
exports.stopRecording = stopRecording;
function handleUserMediaError(e) {
    console.error('handleUserMediaError', e);
    throw e;
}
function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function () {
        let arrayBuffer = this.result;
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
