import { desktopCapturer } from 'electron';
import { join } from 'path'
import { create } from 'tar';
import { createConnection } from 'net';
const temp = require('temp');
import { SERVER_HOST, SERVER_PORT } from './config';
import { toArrayBuffer, toTypedArray } from './converter'
import { writeFileAsync } from './file';

const SECRET_KEY = 'Magnemite';
var videoDirectory = '/tmp/magnemite';
var recorder: MediaRecorder;
var blobs: Blob[] = [];
var seqNumber: number;
var done: Function | null;

export function createTemp() {
    return new Promise<string>((resolve, reject) => {
        temp.mkdir('com.ceriously.magnemite', (err: Error, dirPath: string) => {
            if (err) {
                reject(err);
            } else {
                temp.track();
                videoDirectory = dirPath;
                resolve(videoDirectory);
            }
        });
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

async function handleRecorderStop() {
    const blob = new Blob(blobs, { type: 'video/webm' });
    const ab = await toArrayBuffer(blob);
    const bytes = toTypedArray(ab);
    const file = join(videoDirectory, `video-nav-${seqNumber}.webm`);
    const path = await writeFileAsync(file, bytes);
    console.log('Saved video: ' + path);

    if (done) {
        const complete = done;
        const stream = create({ gzip: true, portable: true }, [videoDirectory]);
        const socket = createConnection({ host: SERVER_HOST, port: SERVER_PORT });

        stream.on('data', (data: Buffer) => {
            console.log('data');
            socket.write(data);
        });

        stream.on('end', () => {
            console.log('end');
            socket.end();
        });

        socket.on('close', () => {
            console.log('close');
            complete();
        });
    }
}

function handleRecorderData(event: BlobEvent) {
    console.log('event data recv');
    blobs.push(event.data);
}

function handleRecorderError(e: Error) {
    console.error('recorder error ', e);
}