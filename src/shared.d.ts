declare class MediaRecorder {
    constructor(m: MediaStream);
    start(): void;
    stop(): void;
    ondataavailable(e: BlobEvent): void;
}

interface BlobEvent {
    data: Blob;
}

//interface MediaStream { }

interface Navigator {
    webkitGetUserMedia(
        options: { video?: any; audio?: boolean; },
        success: (stream: MediaStream) => void,
        error: (error: Error) => void
        ) : void;
}