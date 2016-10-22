// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// In the renderer process.
import {desktopCapturer} from 'electron';
import {writeFile} from 'fs';
const SECRET_KEY = 'ELECTRON_APP_SHELL'
const title = document.title;
document.title = SECRET_KEY

desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error;
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

function gotStream(stream: MediaStream) {
    console.log(typeof stream, stream);

    let recorder = new MediaRecorder(stream);
    let blobs: Blob[] = [];
    recorder.ondataavailable = (event: any) => {
        blobs.push(event.data);
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
        // DEBUG
        console.log('captured ' + blobs.length);
        const w: any = window;
        w.blobs = blobs;
        // END DEBUG
        toArrayBuffer(new Blob(blobs, {type: 'video/webm'}), function(ab) {
            const buffer = toBuffer(ab);
            writeFile('./videos/video5.webm', buffer, err => {
                if (err) {
                    alert('Failed to save video ' + err);
                } else {
                    console.log('Saved video!');
                }
            });
        });
        /*
        fileReader.onload = () => {
            var dataUrl: string = this.result;
            var base64 = dataUrl.split(',')[1];
        };
        fileReader.readAsDataURL(blob);
        */

    }, 5000); // 5 seconds
    //document.querySelector('video').src = URL.createObjectURL(stream);
}

function getUserMediaError(e: Error) {
    console.log('getUserMediaError', e);
    throw e;
}

function toArrayBuffer(blob: Blob, cb: (ab: ArrayBuffer) => void) {
    let fileReader = new FileReader();
    fileReader.onload = function() {
        let arrayBuffer: ArrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab: ArrayBuffer) {
    let buffer = new Buffer(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}

function toBufferConcat(abArray: ArrayBuffer[]) {
    let len = 0;
    abArray.forEach(ab => { len += ab.byteLength });

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