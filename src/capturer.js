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
const SECRET_KEY = 'magnemite_secret_key_to_find_window';
function captureStream(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const origTitle = document.title;
        document.title = SECRET_KEY;
        const sources = yield getSources();
        console.log('sources', sources);
        const source = sources.find(src => src.name === SECRET_KEY);
        if (!source) {
            throw new Error('Unable to find matching source');
        }
        console.log('Found matching source with id: ', source.id);
        document.title = origTitle;
        const stream = yield getMedia(source.id);
        return stream;
    });
}
exports.captureStream = captureStream;
function getSources() {
    return new Promise((resolve, reject) => {
        electron_1.desktopCapturer.getSources({ types: ['window', 'screen'] }, (err, sources) => {
            if (err)
                reject(err);
            else
                resolve(sources);
        });
    });
}
function getMedia(sourceId) {
    return new Promise((resolve, reject) => {
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 800,
                    maxWidth: 1280,
                    minHeight: 600,
                    maxHeight: 720
                }
            }
        }, stream => resolve(stream), err => reject(err));
    });
}
