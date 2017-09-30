"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tar_1 = require("tar");
const net_1 = require("net");
function uploadToServer(dir, host, port) {
    return new Promise((resolve, reject) => {
        const stream = tar_1.create({ gzip: true, portable: true }, [dir]);
        const socket = net_1.createConnection({ host, port });
        stream.on('data', (data) => {
            console.log('data');
            socket.write(data);
        });
        stream.on('end', () => {
            console.log('end');
            socket.end();
        });
        socket.on('close', () => {
            console.log('close');
            resolve();
        });
        socket.on('error', (err) => {
            reject(err);
        });
    });
}
exports.uploadToServer = uploadToServer;
