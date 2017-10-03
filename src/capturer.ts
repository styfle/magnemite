import { desktopCapturer } from 'electron';

const SECRET_KEY = 'Magnemite';

export async function captureStream() {
    const origTitle = document.title;
    document.title = SECRET_KEY;
    const sources = await getSources();
    console.log('sources', sources);
    const matching = sources.filter(src => src.name === SECRET_KEY);
    if (matching.length === 0) {
        throw new Error('Unable to find matching source');
    }
    const source = matching[0];
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