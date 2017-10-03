import * as test from 'tape';
import { SERVER_HOST, SERVER_PORT, WEBVIEW_START_PAGE } from '../src/config';

test('config', t => {
    t.plan(3);
    t.equal(typeof SERVER_HOST, 'string');
    t.equal(typeof SERVER_PORT, 'number');
    t.equal(typeof WEBVIEW_START_PAGE, 'string');
});