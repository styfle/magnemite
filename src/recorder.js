"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const upload_1 = require("./upload");
const config_1 = require("./config");
const converter_1 = require("./converter");
const file_1 = require("./file");
const SECRET_KEY = 'Magnemite';
const playall = 'playall.html';
var videoDirectory = '/tmp/magnemite';
var recorder;
var blobs = [];
var seqNumber;
var done;
function initRecorder(dir) {
    videoDirectory = dir;
    return file_1.copyFileAsync(path_1.join('./src', playall), path_1.join(videoDirectory, playall));
}
exports.initRecorder = initRecorder;
function startRecording(num) {
    seqNumber = num;
    done = null;
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
function doneRecording(callback) {
    console.log('doneRecording');
    done = callback;
    stopRecording();
}
exports.doneRecording = doneRecording;
function handleUserMediaError(e) {
    console.error('handleUserMediaError', e);
}
function handleRecorderStop() {
    return __awaiter(this, void 0, void 0, function* () {
        const blob = new Blob(blobs, { type: 'video/webm' });
        const ab = yield converter_1.toArrayBuffer(blob);
        const bytes = converter_1.toTypedArray(ab);
        const file = path_1.join(videoDirectory, `video-nav-${seqNumber}.webm`);
        const path = yield file_1.writeFileAsync(file, bytes);
        console.log('Saved video: ' + path);
        if (done) {
            yield upload_1.uploadToServer(videoDirectory, config_1.SERVER_HOST, config_1.SERVER_PORT);
            done();
        }
    });
}
function handleRecorderData(event) {
    console.log('event data recv');
    blobs.push(event.data);
}
function handleRecorderError(e) {
    console.error('recorder error ', e);
}
