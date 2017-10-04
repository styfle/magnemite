import { createTemp } from './temporary';
import { Recorder } from './recorder';
import { WEBVIEW_START_PAGE } from './config';

async function init() {
    const dir = await createTemp();
    const rec = new Recorder(dir, document);
    const view = document.getElementById('webview') as Electron.WebviewTag;
    const loading = document.getElementById('loading') as HTMLElement;
    const issue = document.getElementById('issue') as HTMLElement;
    const back = document.getElementById('back') as HTMLButtonElement;
    const forward = document.getElementById('forward') as HTMLButtonElement;
    let num = 0;

    view.addEventListener('did-start-loading', () => {
        loading.style.visibility = 'visible';
    });

    view.addEventListener('did-stop-loading', () => {
        loading.style.visibility = 'hidden';
    });

    back.addEventListener('click', () => {
        rec.stopRecording();
        view.goBack();
    });

    forward.addEventListener('click', () => {
        rec.stopRecording();
        view.goForward();
    });

    view.addEventListener('will-navigate', (e: Event) => {
        rec.stopRecording();
    });

    view.addEventListener('did-navigate', (e: Event) => {
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

    view.src = WEBVIEW_START_PAGE;
}

init();