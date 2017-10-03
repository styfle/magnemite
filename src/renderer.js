"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const temporary_1 = require("./temporary");
const recorder_1 = require("./recorder");
const config_1 = require("./config");
async function init() {
    const dir = await temporary_1.createTemp();
    const rec = new recorder_1.Recorder(dir, document);
    const view = document.getElementById('webview');
    const loading = document.getElementById('loading');
    const issue = document.getElementById('issue');
    const back = document.getElementById('back');
    const forward = document.getElementById('forward');
    let num = 0;
    view.addEventListener('did-start-loading', () => {
        loading.style.visibility = 'visible';
    });
    view.addEventListener('did-stop-loading', () => {
        loading.style.visibility = 'hidden';
    });
    back.addEventListener('click', () => {
        view.goBack();
    });
    forward.addEventListener('click', () => {
        view.goForward();
    });
    view.addEventListener('will-navigate', (e) => {
        rec.stopRecording();
    });
    view.addEventListener('did-navigate', (e) => {
        rec.startRecording(++num);
    });
    issue.addEventListener('click', () => {
        rec.doneRecording(() => alert('Your bug report was submitted!'));
    });
    view.addEventListener('dom-ready', () => {
        if (process.env['NODE_ENV'] === 'development') {
            view.openDevTools();
        }
        back.disabled = !view.canGoBack();
        forward.disabled = !view.canGoForward();
    });
    view.src = config_1.WEBVIEW_START_PAGE;
}
init();
//# sourceMappingURL=renderer.js.map