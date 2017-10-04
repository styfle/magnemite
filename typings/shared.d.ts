// Add typings for missing Web APIs
declare class MediaRecorder {
    constructor(m: MediaStream);
    start(): void;
    stop(): void;
    ondataavailable(e: BlobEvent): void;
    onerror(e: Error): void;
    onstop(): void;
}

interface BlobEvent {
    data: Blob;
}

type GetUserMediaFunction = (
    options: {
        audio: boolean,
        video: {
            mandatory: {
                chromeMediaSource: string,
                chromeMediaSourceId: string,
                minWidth: number,
                maxWidth: number,
                minHeight: number,
                maxHeight: number
            }
        }
    },
    success: (stream: MediaStream) => void,
    error: (error: Error) => void
) => void;

interface Navigator {
    //getUserMedia: GetUserMediaFunction;
    webkitGetUserMedia: GetUserMediaFunction;
    //mediaDevices: { getUserMedia: GetUserMediaFunction }
}