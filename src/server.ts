import { createServer } from 'net';
import { createWriteStream } from 'fs';
import { SERVER_HOST, SERVER_PORT } from './config';

const server = createServer(socket => {

    const invalidFileName = new RegExp('[:/]', 'g');
    const now = new Date().toISOString().replace(invalidFileName , '_');
    const stream = createWriteStream(`./recording-${now}.tgz`);
    
    socket.on('data', data => {
        console.log(now, 'data');
        stream.write(data);
    });

    socket.on('end', () => {
        console.log(now, 'end');
        stream.end();
    });

    socket.on('close', () => {
        console.log(now, 'close');
    });

}).listen(SERVER_PORT, SERVER_HOST);

console.log(`Listening on ${SERVER_HOST}:${SERVER_PORT}`);