"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = require("fs");
const SECRET_KEY = 'Magnemite';
var recorder;
var blobs = [];
var seqNumber;
function deleteExistingVideos() {
    const dir = './videos/';
    fs_1.readdir(dir, (err, files) => {
        if (err)
            console.error(err);
        files.filter(f => f.endsWith('.webm')).forEach(f => fs_1.unlink(dir + f, (err) => {
            if (err) {
                console.error(err);
            }
        }));
    });
}
exports.deleteExistingVideos = deleteExistingVideos;
function startRecording(num) {
    seqNumber = num;
    console.log('startRecording', seqNumber);
    const origTitle = document.title;
    document.title = SECRET_KEY;
    electron_1.desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
        if (error)
            throw error;
        console.log('sources', sources);
        const matching = sources.filter(src => src.name === SECRET_KEY);
        if (matching.length === 0) {
            console.error('unable to find matching source');
            return;
        }
        const source = matching[0];
        console.log('found matching source ', source.id);
        document.title = origTitle;
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    minWidth: 800,
                    maxWidth: 1280,
                    minHeight: 600,
                    maxHeight: 720
                }
            }
        }, handleStream, handleUserMediaError);
    });
}
exports.startRecording = startRecording;
function handleStream(stream) {
    console.log('handleStream', seqNumber);
    recorder = new MediaRecorder(stream);
    blobs = [];
    recorder.ondataavailable = handleRecorderData;
    recorder.onerror = handleRecorderError;
    recorder.onstop = handleRecorderStop;
    recorder.start();
}
function stopRecording() {
    console.log('stopRecording', seqNumber);
    if (!recorder) {
        console.log('nothing to stop', seqNumber);
        return;
    }
    recorder.stop();
}
exports.stopRecording = stopRecording;
function handleUserMediaError(e) {
    console.error('handleUserMediaError', e);
}
function handleRecorderStop() {
    toArrayBuffer(new Blob(blobs, { type: 'video/webm' }), (ab) => {
        const data = toTypedArray(ab);
        const file = `./videos/video-nav-${seqNumber}.webm`;
        fs_1.writeFile(file, data, err => {
            if (err) {
                console.error('Failed to save video ' + err);
            }
            else {
                console.log('Saved video: ' + file);
            }
        });
    });
}
function handleRecorderData(event) {
    console.log('event data recv');
    blobs.push(event.data);
}
function handleRecorderError(e) {
    console.error('recorder error ', e);
}
function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function (ev) {
        let arrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}
function toTypedArray(ab) {
    return new Uint8Array(ab);
}
function toBuffer(ab) {
    let buffer = Buffer.alloc(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}