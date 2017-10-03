"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const converter_1 = require("../src/converter");
test('toTypedArray', t => {
    const array = [0, 0, 0, 0];
    t.plan(array.length);
    const ab = new ArrayBuffer(array.length);
    const actual = converter_1.toTypedArray(ab);
    const expected = new Uint8Array(array);
    array.forEach((o, i) => {
        t.equal(actual[i], expected[i]);
    });
});
//# sourceMappingURL=converter-test.js.map