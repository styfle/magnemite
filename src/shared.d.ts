declare var MediaRecorder: any;

interface MediaStream {

}

interface Navigator {
    webkitGetUserMedia(
        options: { video?: any; audio?: boolean; },
        success: (stream: MediaStream) => void,
        error: (error: Error) => void
        ) : void;
}