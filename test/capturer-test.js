"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxyquire = require("proxyquire");
const test = require("tape");
test('captureStream reject with getSources error', async (t) => {
    t.plan(2);
    const error = new Error('the error');
    const secret = 'secret_id';
    const sources = [{ id: '1', name: secret }, { id: '2', name: 'two' }];
    const title = 'the original title';
    const document = { title };
    const navigator = {};
    const electron = {
        desktopCapturer: {
            getSources: (o, callback) => {
                t.equal(o.types.length, 2);
                callback(error, sources);
            }
        }
    };
    const capturer = proxyquire('../src/capturer', { electron });
    try {
        const stream = await capturer.captureStream(document, navigator, secret);
        t.error(stream);
    }
    catch (e) {
        t.equal(e, error);
    }
});
test('captureStream resolve', async (t) => {
    t.plan(3);
    const error = null;
    const secret = 'secret_id';
    const sources = [{ id: '1', name: secret }, { id: '2', name: 'two' }];
    const title = 'the original title';
    const document = { title };
    const navigator = {};
    const stream = {};
    navigator.webkitGetUserMedia = (o, onSuccess, onError) => {
        onSuccess(stream);
    };
    const electron = {
        desktopCapturer: {
            getSources: (o, callback) => {
                t.equal(o.types.length, 2);
                callback(error, sources);
            }
        }
    };
    const capturer = proxyquire('../src/capturer', { electron });
    var data = await capturer.captureStream(document, navigator, secret);
    t.equal(data, stream);
    t.equal(document.title, title);
});
//# sourceMappingURL=capturer-test.js.map