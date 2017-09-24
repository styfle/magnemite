"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recorder_1 = require("./recorder");
const config_1 = require("./config");
const temp = recorder_1.createTemp()
    .then(() => init())
    .catch(err => alert(err));
function init() {
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
            alert('Recording saved to disk!');
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
}
