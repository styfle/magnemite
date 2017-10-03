import * as test from 'tape';
import { toArrayBuffer, toTypedArray } from '../src/converter';

/*
test('toArrayBuffer', async t => {
    const array = [1, 3, 3, 7];
    const blob = new Blob(array); // Does not exist!
    const ab = await toArrayBuffer(blob);
    t.equal(ab, array);
});
*/


test('toTypedArray', t => {
    const array = [0, 0, 0, 0];
    t.plan(array.length);
    const ab = new ArrayBuffer(array.length);
    const actual = toTypedArray(ab);
    const expected = new Uint8Array(array);
    array.forEach((o, i) => {
        t.equal(actual[i], expected[i]);
    });
});
