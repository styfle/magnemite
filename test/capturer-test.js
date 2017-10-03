"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxyquire = require("proxyquire");
const test = require("tape");
test('captureStream reject', t => {
    t.plan(2);
    const error = new Error('fail');
    const stream = {};
    const document = {
        title: 'the orig title'
    };
    const electron = {
        desktopCapturer: {
            getSources: (o, callback) => {
                t.equal(o.types.length, 2);
                callback(error, stream);
            }
        }
    };
    const capturer = proxyquire('../src/capturer', { electron });
    capturer.captureStream(document)
        .then((stream) => t.error(stream))
        .catch((err) => t.equal(err, error));
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
            getSources: (o, callback) => {
                t.equal(o.types.length, 2);
                callback(error, stream);
            }
        }
    };
    const capturer = proxyquire('../src/capturer', { electron });
    capturer.captureStream(document)
        .then((stream) => t.equal(stream, stream))
        .catch((err) => t.error(err));
});
