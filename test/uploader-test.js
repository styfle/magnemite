"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxyquire = require("proxyquire");
const test = require("tape");
test('uploadToServer', async (t) => {
    t.plan(9);
    const baseDir = '/fakefolder';
    const host = 'hostname';
    const port = 51234;
    const data = [1, 3, 3, 7];
    const stream = {
        on: (event, o) => {
            t.true(!!event);
        }
    };
    const tar = {
        create: (o, dirs) => {
            t.equal(o.gzip, true);
            t.equal(o.portable, true);
            t.equal(dirs[0], baseDir);
            return stream;
        }
    };
    const socket = {
        write: (o) => {
            t.equal(o, data);
        },
        on: (event) => {
            t.true(!!event);
        }
    };
    const net = {
        createConnection: (o) => {
            t.equal(o.host, host);
            t.equal(o.port, port);
            return socket;
        }
    };
    const uploader = proxyquire('../src/uploader', { tar, net });
    const dir = await uploader.uploadToServer(baseDir, host, port);
    t.equal(dir, baseDir);
});
