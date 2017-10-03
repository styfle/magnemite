import { desktopCapturer } from 'electron';

export async function captureStream(document: Document, navigator: Navigator, secret: string) {
    const origTitle = document.title;
    document.title = secret;
    const sources = await getSources();
    console.log('sources', sources);
    const source = sources.find(src => src.name === secret);
    if (!source) {
        throw new Error('Unable to find matching source');
    }
    console.log('Found matching source with id: ', source.id);
    document.title = origTitle;
    const stream = await getMedia(navigator, source.id);
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

function getMedia(navigator: Navigator, sourceId: string) {
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