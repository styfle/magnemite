// Add typings for missing Web APIs
declare class MediaRecorder {
    constructor(m: MediaStream);
    start(): void;
    stop(): void;
    ondataavailable(e: BlobEvent): void;
    onerror(e: Error): void;
}

interface BlobEvent {
    data: Blob;
}

type GetUserMediaFunction = (
    options: { video?: any; audio?: boolean; },
    success: (stream: MediaStream) => void,
    error: (error: Error) => void
) => void;

interface Navigator {
    //getUserMedia: GetUserMediaFunction;
    webkitGetUserMedia: GetUserMediaFunction;
    //mediaDevices: { getUserMedia: GetUserMediaFunction }
}