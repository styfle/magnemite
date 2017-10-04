import * as proxyquire from 'proxyquire';
import * as test from 'tape';

test('captureStream reject with getSources error', async t => {
    t.plan(2);

    const error = new Error('the error');
    const secret = 'secret_id';
    const sources = [{ id: '1', name: secret }, { id: '2', name: 'two' }];
    const title = 'the original title';
    const document = { title };
    const navigator = {} as Navigator;

    const electron = {
        desktopCapturer: {
            getSources: (o: { types: string[] }, callback: Function) => {
                t.equal(o.types.length, 2);
                callback(error, sources);
            }
        }
    };

    const capturer = proxyquire('../src/capturer', { electron });
    try {
    const stream = await capturer.captureStream(document, navigator, secret)
    t.error(stream);
    } catch (e) {
        t.equal(e, error);
    }
});


test('captureStream resolve', async t => {
    t.plan(3);

    const error = null;
    const secret = 'secret_id';
    const sources = [{ id: '1', name: secret }, { id: '2', name: 'two' }];
    const title = 'the original title';
    const document = { title };
    const navigator = {} as Navigator;
    const stream = {} as MediaStream;
    navigator.webkitGetUserMedia = (o, onSuccess, onError) => {
        onSuccess(stream);
    };

    const electron = {
        desktopCapturer: {
            getSources: (o: { types: string[] }, callback: Function) => {
                t.equal(o.types.length, 2);
                callback(error, sources)
            }
        }
    };

    const capturer = proxyquire('../src/capturer', { electron });
    var data = await capturer.captureStream(document, navigator, secret)
    t.equal(data, stream);
    t.equal(document.title, title);
});