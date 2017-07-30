// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// In the renderer process.
import {desktopCapturer} from 'electron';
import {writeFile, readdir, unlink} from 'fs';
const SECRET_KEY = 'Magnemite';

var recorder: MediaRecorder;
var blobs: Blob[] = [];
var seqNumber: number;

export function deleteExistingVideos() {
    const dir = './videos/';
    readdir(dir, (err, files) => {
        if (err) console.error(err);
        files.filter(f => f.endsWith('.webm')).forEach(f => unlink(dir + f, (err) => {
            if (err) {console.error(err); }
        }));
    });
}

export function startRecording(num: number) {
    seqNumber = num;
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

function handleUserMediaError(e: Error) {
    console.error('handleUserMediaError', e);
}

function handleRecorderStop() {
    toArrayBuffer(new Blob(blobs, {type: 'video/webm'}), (ab) => {
        const data = toTypedArray(ab);
        const file = `./videos/video-nav-${seqNumber}.webm`;
        writeFile(file, data, err => {
            if (err) {
                console.error('Failed to save video ' + err);
            } else {
                console.log('Saved video: ' + file);
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