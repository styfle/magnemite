import { desktopCapturer } from 'electron';

const SECRET_KEY = 'magnemite_secret_key_to_find_window';

export async function captureStream(document: Document) {
    const origTitle = document.title;
    document.title = SECRET_KEY;
    const sources = await getSources();
    console.log('sources', sources);
    const source = sources.find(src => src.name === SECRET_KEY);
    if (!source) {
        throw new Error('Unable to find matching source');
    }
    console.log('Found matching source with id: ', source.id);
    document.title = origTitle;
    const stream = await getMedia(source.id);
    return stream;
}

function getSources() {
    return new Promise<Electron.DesktopCapturerSource[]>((resolve, reject) => {
        desktopCapturer.getSources({ types: ['window', 'screen'] }, (err, sources) => {
            if (err) reject(err);
            else resolve(sources);
        });
    });
}

function getMedia(sourceId: string) {
    return new Promise<MediaStream>((resolve, reject) => {
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
        },
        stream => resolve(stream),
        err => reject(err));
    });
}