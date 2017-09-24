import { createServer } from 'net';
import { createWriteStream } from 'fs';
import { SERVER_HOST, SERVER_PORT } from './config';

const server = createServer(socket => {

    const invalidFileName = new RegExp('[:/]', 'g');
    const now = new Date().toISOString().replace(invalidFileName , '_');
    const stream = createWriteStream(`./videos/vid-${now}.tgz`);
    
    socket.on('data', data => {
        console.log('data');
        stream.write(data);
    });

    socket.on('end', () => {
        console.log('end');
        stream.end();
    });

    socket.on('close', () => {
        console.log('close');
    });

}).listen(SERVER_PORT, SERVER_HOST);

console.log(`Listening on ${SERVER_HOST}:${SERVER_PORT}`);