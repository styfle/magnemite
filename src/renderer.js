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
const temporary_1 = require("./temporary");
const recorder_1 = require("./recorder");
const config_1 = require("./config");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = yield temporary_1.createTemp();
        const rec = yield recorder_1.initRecorder(dir);
        const webview = document.getElementById('webview');
        const loading = document.getElementById('loading');
        const issue = document.getElementById('issue');
        const back = document.getElementById('back');
        const forward = document.getElementById('forward');
        var num = 0;
        webview.addEventListener('did-start-loading', () => {
            loading.style.visibility = 'visible';
        });
        webview.addEventListener('did-stop-loading', () => {
            loading.style.visibility = 'hidden';
        });
        back.addEventListener('click', () => {
            webview.goBack();
        });
        forward.addEventListener('click', () => {
            webview.goForward();
        });
        webview.addEventListener('will-navigate', (e) => {
            recorder_1.stopRecording();
        });
        webview.addEventListener('did-navigate', (e) => {
            num++;
            recorder_1.startRecording(num);
        });
        issue.addEventListener('click', () => {
            recorder_1.doneRecording(() => {
                alert('Your bug report was submitted!');
            });
        });
        webview.addEventListener('dom-ready', () => {
            if (process.env['NODE_ENV'] === 'development') {
                webview.openDevTools();
            }
            back.disabled = !webview.canGoBack();
            forward.disabled = !webview.canGoForward();
        });
        webview.src = config_1.WEBVIEW_START_PAGE;
    });
}
init();
