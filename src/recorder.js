"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const capturer_1 = require("./capturer");
const uploader_1 = require("./uploader");
const config_1 = require("./config");
const converter_1 = require("./converter");
const file_1 = require("./file");
class Recorder {
    constructor(dir, document) {
        this.secret = 'magnemite_secret_key_to_find_window';
        this.baseDir = dir;
        this.document = document;
        this.navigator = navigator;
    }
    async startRecording(id) {
        this.id = id;
        this.done = null;
        console.log('startRecording', this.id);
        const stream = await capturer_1.captureStream(this.document, this.navigator, this.secret);
        const data = [];
        const r = new MediaRecorder(stream);
        this.recorder = r;
        r.onerror = (e) => console.error('recorder error ', e);
        r.ondataavailable = (event) => {
            console.log('event data recv');
            data.push(event.data);
        };
        r.onstop = async () => {
            const blob = new Blob(data, { type: 'video/webm' });
            const ab = await converter_1.toArrayBuffer(blob);
            const bytes = converter_1.toTypedArray(ab);
            const file = path_1.join(this.baseDir, `video-nav-${this.id}.webm`);
            const path = await file_1.writeFileAsync(file, bytes);
            console.log('Saved video: ', path);
            if (this.done) {
                const play = 'playall.html';
                await file_1.copyFileAsync(path_1.join('./src', play), path_1.join(this.baseDir, play));
                await uploader_1.uploadToServer(this.baseDir, config_1.SERVER_HOST, config_1.SERVER_PORT);
                this.done();
            }
        };
        return r.start();
    }
    stopRecording() {
        console.log('stopRecording', this.id);
        if (!this.recorder) {
            console.error('Nothing to stop', this.id);
            return;
        }
        return this.recorder.stop();
    }
    doneRecording(callback) {
        console.log('doneRecording');
        this.done = callback;
        this.stopRecording();
    }
}
exports.Recorder = Recorder;
