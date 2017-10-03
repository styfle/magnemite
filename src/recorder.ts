import { join } from 'path'
import { captureStream } from './capturer';
import { uploadToServer } from './upload';
import { SERVER_HOST, SERVER_PORT } from './config';
import { toArrayBuffer, toTypedArray } from './converter'
import { writeFileAsync, copyFileAsync } from './file';

export class Recorder {
    private baseDir: string;
    private recorder: MediaRecorder;
    private id: number;
    private done: Function | null;

    constructor(dir: string) {
        this.baseDir = dir;
    }

    async startRecording(id: number) {
        this.id = id;
        this.done = null;
        console.log('startRecording', this.id);
        const stream = await captureStream();
        const data: Blob[] = [];
        const r = new MediaRecorder(stream);
        this.recorder = r;
        r.onerror = (e) => console.error('recorder error ', e);
        r.ondataavailable = (event: BlobEvent) => {
            console.log('event data recv');
            data.push(event.data);
        };
        r.onstop = async () => {
            const blob = new Blob(data, { type: 'video/webm' });
            const ab = await toArrayBuffer(blob);
            const bytes = toTypedArray(ab);
            const file = join(this.baseDir, `video-nav-${this.id}.webm`);
            const path = await writeFileAsync(file, bytes);
            console.log('Saved video: ', path);
        
            if (this.done) {
                const play = 'playall.html';
                await copyFileAsync(join('./src', play), join(this.baseDir, play));
                await uploadToServer(this.baseDir, SERVER_HOST, SERVER_PORT);
                this.done();
            }
        };
        return r.start();
    }

    stopRecording() {
        console.log('stopRecording', this.id);
        if (!this.recorder) {
            console.error('Nothing to stop', this.id);
            return;
        }
        return this.recorder.stop();
    }

    doneRecording(callback: () => void) {
        console.log('doneRecording');
        this.done = callback;
        this.stopRecording();
    }
}









