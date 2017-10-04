"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const temp = require('temp');
temp.track();
function createTemp() {
    return new Promise((resolve, reject) => {
        temp.mkdir('com.ceriously.magnemite', (err, dirPath) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(dirPath);
            }
        });
    });
}
exports.createTemp = createTemp;
function cleanup() {
    return temp.cleanupSync();
}
exports.cleanup = cleanup;
//# sourceMappingURL=temporary.js.map