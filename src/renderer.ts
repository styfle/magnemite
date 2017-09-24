import { createTemp, startRecording, stopRecording, doneRecording } from './recorder';
import { WEBVIEW_START_PAGE } from './config';

const temp = createTemp()
    .then(() => init())
    .catch(err => alert(err));

function init() {
    const webview = document.getElementById('webview') as Electron.WebviewTag;
    const loading = document.getElementById('loading') as HTMLElement;
    const issue = document.getElementById('issue') as HTMLElement;
    const back = document.getElementById('back') as HTMLButtonElement;
    const forward = document.getElementById('forward') as HTMLButtonElement;

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

    webview.addEventListener('will-navigate', (e: Event) => {
        stopRecording();
    });
    webview.addEventListener('did-navigate', (e: Event) => {
        num++;
        startRecording(num);
    });

    issue.addEventListener('click', () => {
        doneRecording(() => {
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

    webview.src = WEBVIEW_START_PAGE;
}