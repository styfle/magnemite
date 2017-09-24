// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// In the renderer process.
import { desktopCapturer } from 'electron';
import { writeFile } from 'fs';
import { join } from 'path'
import { create } from 'tar';
const temp = require('temp');

const SECRET_KEY = 'Magnemite';
var videoDirectory = './videos/';
var recorder: MediaRecorder;
var blobs: Blob[] = [];
var seqNumber: number;
var done: Function | null;

export function createTemp() {
    temp.mkdir('com.ceriously.magnemite', (err: Error, dirPath: string) => {
        if (err) throw err;
        temp.track();
        videoDirectory = dirPath;
    });
}

export function startRecording(num: number) {
    seqNumber = num;
    done = null;
    console.log('startRecording', seqNumber);
    const origTitle = document.title;
    document.title = SECRET_KEY;

    desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
        if (error) throw error;
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

function handleStream(stream: MediaStream) {
    console.log('handleStream', seqNumber);
    recorder = new MediaRecorder(stream);
    blobs = [];
    recorder.ondataavailable = handleRecorderData;
    recorder.onerror = handleRecorderError;
    recorder.onstop = handleRecorderStop;
    recorder.start();
}

export function stopRecording() {
    console.log('stopRecording', seqNumber);
    if (!recorder) {
        console.log('nothing to stop', seqNumber);
        return;
    }
    recorder.stop();
}

export function doneRecording(callback: () => void) {
    console.log('doneRecording');
    done = callback;
    stopRecording();
}

function handleUserMediaError(e: Error) {
    console.error('handleUserMediaError', e);
}

function handleRecorderStop() {
    toArrayBuffer(new Blob(blobs, { type: 'video/webm' }), (ab) => {
        const data = toTypedArray(ab);
        const file = join(videoDirectory, `video-nav-${seqNumber}.webm`);
        
        writeFile(file, data, err => {
            if (err) {
                console.error('Failed to save video ' + err);
            } else {
                console.log('Saved video: ' + file);
            }

            if (done) {
                const today = new Date().toISOString().split('T')[0];
                const fileCompressed = join(videoDirectory, `./bug-report-${today}.tgz`);
                create({ gzip: true, file: fileCompressed }, [videoDirectory]);
                console.log('Saved compressed file: ' + fileCompressed);
                done();
            }
        });
    });
}

function handleRecorderData(event: BlobEvent) {
    console.log('event data recv');
    blobs.push(event.data);
}

function handleRecorderError(e: Error) {
    console.error('recorder error ', e);
}

function toArrayBuffer(blob: Blob, cb: (ab: ArrayBuffer) => void) {
    let fileReader = new FileReader();
    fileReader.onload = function(ev) {
        let arrayBuffer: ArrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}

function toTypedArray(ab: ArrayBuffer) {
    return new Uint8Array(ab);
}

function toBuffer(ab: ArrayBuffer) {
    let buffer = Buffer.alloc(ab.byteLength);
    let arr = new Uint8Array(ab); // TODO: can we just return Uint8Array?
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}