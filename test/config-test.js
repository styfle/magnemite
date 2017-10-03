"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const config_1 = require("../src/config");
test('config', t => {
    t.plan(3);
    t.equal(typeof config_1.SERVER_HOST, 'string');
    t.equal(typeof config_1.SERVER_PORT, 'number');
    t.equal(typeof config_1.WEBVIEW_START_PAGE, 'string');
});
//# sourceMappingURL=config-test.js.map