import { create } from 'tar';
import { createConnection } from 'net';

export function uploadToServer(dir: string, host: string, port: number) {
    return new Promise<string>((resolve, reject) => {
        const stream = create({ gzip: true, portable: true }, [dir]);
        const socket = createConnection({ host, port });
    
        stream.on('data', (data: Buffer) => {
            console.log('data');
            socket.write(data);
        });
    
        stream.on('end', () => {
            console.log('end');
            socket.end();
        });
    
        socket.on('close', () => {
            console.log('close');
            resolve(dir);
        });

        socket.on('error', (err: Error) => {
            reject(err);
        });
    });
    
}