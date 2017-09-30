"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const fs_1 = require("fs");
const config_1 = require("./config");
const server = net_1.createServer(socket => {
    const invalidFileName = new RegExp('[:/]', 'g');
    const now = new Date().toISOString().replace(invalidFileName, '_');
    const stream = fs_1.createWriteStream(`./recording-${now}.tgz`);
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
}).listen(config_1.SERVER_PORT, config_1.SERVER_HOST);
console.log(`Listening on ${config_1.SERVER_HOST}:${config_1.SERVER_PORT}`);
