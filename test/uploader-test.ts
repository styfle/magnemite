import * as proxyquire from 'proxyquire';
import * as test from 'tape';

test('uploadToServer', async t => {
    t.plan(9);
    const baseDir = '/fakefolder';
    const host = 'hostname';
    const port = 51234;
    const data = [1, 3, 3, 7];

    const stream = {
        on: (event: string, o: any) => {
            t.true(!!event); // 2x
        }
    };

    const tar = {
        create: (o: any, dirs: string[]) => {
            t.equal(o.gzip, true);
            t.equal(o.portable, true);
            t.equal(dirs[0], baseDir);
            return stream;
        }
    };

    const socket = {
        write: (o: any) => {
            t.equal(o, data);
        },
        on: (event: string) => {
            t.true(!!event); // 2x
        }
    };

    const net = {
        createConnection: (o: any) => {
            t.equal(o.host, host);
            t.equal(o.port, port);
            return socket;
        }
    };

    const uploader = proxyquire('../src/uploader', { tar, net });

    const dir = await uploader.uploadToServer(baseDir, host, port)
    t.equal(dir, baseDir);
});