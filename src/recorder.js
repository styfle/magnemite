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
const path_1 = require("path");
const capturer_1 = require("./capturer");
const uploader_1 = require("./uploader");
const config_1 = require("./config");
const converter_1 = require("./converter");
const file_1 = require("./file");
class Recorder {
    constructor(dir) {
        this.baseDir = dir;
    }
    startRecording(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.id = id;
            this.done = null;
            console.log('startRecording', this.id);
            const stream = yield capturer_1.captureStream();
            const data = [];
            const r = new MediaRecorder(stream);
            this.recorder = r;
            r.onerror = (e) => console.error('recorder error ', e);
            r.ondataavailable = (event) => {
                console.log('event data recv');
                data.push(event.data);
            };
            r.onstop = () => __awaiter(this, void 0, void 0, function* () {
                const blob = new Blob(data, { type: 'video/webm' });
                const ab = yield converter_1.toArrayBuffer(blob);
                const bytes = converter_1.toTypedArray(ab);
                const file = path_1.join(this.baseDir, `video-nav-${this.id}.webm`);
                const path = yield file_1.writeFileAsync(file, bytes);
                console.log('Saved video: ', path);
                if (this.done) {
                    const play = 'playall.html';
                    yield file_1.copyFileAsync(path_1.join('./src', play), path_1.join(this.baseDir, play));
                    yield uploader_1.uploadToServer(this.baseDir, config_1.SERVER_HOST, config_1.SERVER_PORT);
                    this.done();
                }
            });
            return r.start();
        });
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
