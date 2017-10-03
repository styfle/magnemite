import * as proxyquire from 'proxyquire';
import * as test from 'tape';

test('captureStream reject', t => {
    t.plan(2);

    const error = new Error('fail');
    const stream = {};
    const document = {
        title: 'the orig title'
    };

    const electron = {
        desktopCapturer: {
            getSources: (o: any, callback: Function) => {
                t.equal(o.types.length, 2);
                callback(error, stream)
            }
        }
    };

    const capturer = proxyquire('../src/capturer', { electron });
    capturer.captureStream(document)
        .then((stream: any) => t.error(stream))
        .catch((err: Error) => t.equal(err, error));
});


test('captureStream resolve', t => {
    t.plan(2);

    const error = new Error('fail');
    const stream = {};
    const document = {
        title: 'the orig title'
    };

    const electron = {
        desktopCapturer: {
            getSources: (o: any, callback: Function) => {
                t.equal(o.types.length, 2);
                callback(error, stream)
            }
        }
    };

    const capturer = proxyquire('../src/capturer', { electron });
    capturer.captureStream(document)
        .then((stream: any) => t.equal(stream, stream))
        .catch((err: Error) => t.error(err));
});